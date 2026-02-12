import mongoose from 'mongoose';
import { Role } from '../models/role.model.js';
import { User } from '../models/user.model.js';
import { DEFAULT_ROLES, groupPermissionsByResource } from '../config/permissions.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrm_db';

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Step 1: Create default roles
 */
async function createDefaultRoles() {
  console.log('\n📝 Step 1: Creating default roles...');

  const createdRoles: Record<string, any> = {};

  for (const [key, roleConfig] of Object.entries(DEFAULT_ROLES)) {
    try {
      // Kiểm tra role đã tồn tại chưa
      let role = await Role.findOne({ name: roleConfig.name });

      if (role) {
        console.log(`   ⚠️  Role '${roleConfig.displayName}' already exists, skipping...`);
        createdRoles[roleConfig.name] = role;
        continue;
      }

      // Group permissions by resource
      const permissions = groupPermissionsByResource(roleConfig.permissions);

      // Tạo role mới
      role = await Role.create({
        name: roleConfig.name,
        displayName: roleConfig.displayName,
        description: roleConfig.description,
        permissions,
        hierarchy: roleConfig.hierarchy,
        isSystemRole: roleConfig.isSystemRole,
        isActive: roleConfig.isActive,
      });

      createdRoles[roleConfig.name] = role;
      console.log(`   ✅ Created role: ${roleConfig.displayName} (hierarchy: ${roleConfig.hierarchy})`);
    } catch (error) {
      console.error(`   ❌ Error creating role ${roleConfig.displayName}:`, error);
    }
  }

  return createdRoles;
}

/**
 * Step 2: Migrate existing users
 */
async function migrateUsers(roles: Record<string, any>) {
  console.log('\n📝 Step 2: Migrating existing users...');

  try {
    // Lấy tất cả users có role string nhưng chưa có roleId
    const usersToMigrate = await User.find({
      role: { $exists: true, $ne: null },
      $or: [
        { roleId: { $exists: false } },
        { roleId: null }
      ]
    });

    console.log(`   Found ${usersToMigrate.length} users to migrate`);

    if (usersToMigrate.length === 0) {
      console.log('   ✅ No users to migrate');
      return;
    }

    let migratedCount = 0;
    let errorCount = 0;

    for (const user of usersToMigrate) {
      try {
        // Map old role string to new roleId
        let roleId;
        const oldRole = user.role as string;

        switch (oldRole) {
          case 'admin':
            roleId = roles['admin']._id;
            break;
          case 'hr_manager':
            roleId = roles['hr_manager']._id;
            break;
          case 'manager':
          case 'department_manager':
            roleId = roles['department_manager']._id;
            break;
          case 'employee':
          default:
            roleId = roles['employee']._id;
            break;
        }

        // Update user
        await User.updateOne(
          { _id: user._id },
          {
            $set: { roleId },
            // Giữ lại role cũ để backward compatibility
          }
        );

        migratedCount++;
        console.log(`   ✅ Migrated user: ${user.email} (${oldRole} -> ${roleId})`);
      } catch (error) {
        errorCount++;
        console.error(`   ❌ Error migrating user ${user.email}:`, error);
      }
    }

    console.log(`\n   📊 Migration summary:`);
    console.log(`      - Successfully migrated: ${migratedCount} users`);
    console.log(`      - Failed: ${errorCount} users`);
  } catch (error) {
    console.error('   ❌ Error during user migration:', error);
  }
}

/**
 * Step 3: Create indexes
 */
async function createIndexes() {
  console.log('\n📝 Step 3: Creating database indexes...');

  try {
    // User collection indexes
    await User.collection.createIndex({ roleId: 1 });
    await User.collection.createIndex({ roleId: 1, isActive: 1 });
    await User.collection.createIndex({ departmentId: 1 });
    console.log('   ✅ Created User indexes');

    // Role collection indexes (should already exist from schema)
    await Role.collection.createIndex({ name: 1, isActive: 1 });
    await Role.collection.createIndex({ hierarchy: 1 });
    console.log('   ✅ Created Role indexes');
  } catch (error) {
    console.error('   ❌ Error creating indexes:', error);
  }
}

/**
 * Step 4: Verify migration
 */
async function verifyMigration() {
  console.log('\n📝 Step 4: Verifying migration...');

  try {
    // Count roles
    const roleCount = await Role.countDocuments();
    console.log(`   ✅ Total roles: ${roleCount}`);

    // Count users with roleId
    const usersWithRoleId = await User.countDocuments({ roleId: { $exists: true, $ne: null } });
    const totalUsers = await User.countDocuments();
    console.log(`   ✅ Users with roleId: ${usersWithRoleId}/${totalUsers}`);

    // Show users without roleId
    const usersWithoutRoleId = await User.find({ 
      $or: [
        { roleId: { $exists: false } },
        { roleId: null }
      ]
    }).select('email role');

    if (usersWithoutRoleId.length > 0) {
      console.log(`   ⚠️  Users without roleId: ${usersWithoutRoleId.length}`);
      usersWithoutRoleId.forEach(user => {
        console.log(`      - ${user.email} (role: ${user.role})`);
      });
    }

    // Show role distribution
    console.log('\n   📊 Role distribution:');
    const roles = await Role.find({ isActive: true }).select('name displayName');
    for (const role of roles) {
      const count = await User.countDocuments({ roleId: role._id });
      console.log(`      - ${role.displayName}: ${count} users`);
    }
  } catch (error) {
    console.error('   ❌ Error during verification:', error);
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting RBAC Migration...\n');
  console.log('=' .repeat(60));

  try {
    // Connect to database
    await connectDB();

    // Step 1: Create default roles
    const roles = await createDefaultRoles();

    // Step 2: Migrate users
    await migrateUsers(roles);

    // Step 3: Create indexes
    await createIndexes();

    // Step 4: Verify migration
    await verifyMigration();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

/**
 * Rollback function (optional)
 */
async function rollback() {
  console.log('🔄 Starting RBAC Rollback...\n');

  try {
    await connectDB();

    console.log('📝 Removing roleId from users...');
    await User.updateMany(
      {},
      { $unset: { roleId: 1, departmentId: 1 } }
    );
    console.log('✅ Removed roleId from users');

    console.log('📝 Deleting custom roles...');
    await Role.deleteMany({ isSystemRole: false });
    console.log('✅ Deleted custom roles');

    console.log('\n✅ Rollback completed!');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

/**
 * CLI Interface
 */
const command = process.argv[2];

if (command === 'migrate' || !command) {
  migrate();
} else if (command === 'rollback') {
  rollback();
} else if (command === 'verify') {
  connectDB().then(verifyMigration).then(() => mongoose.disconnect());
} else {
  console.log('Usage:');
  console.log('  npm run migrate:rbac           # Run migration');
  console.log('  npm run migrate:rbac rollback  # Rollback migration');
  console.log('  npm run migrate:rbac verify    # Verify migration');
  process.exit(1);
}
