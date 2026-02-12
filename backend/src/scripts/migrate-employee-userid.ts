import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EmployeeModel } from '../models/employee.model.js';
import { User } from '../models/user.model.js';

dotenv.config();

async function migrateEmployeeUserId() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB\n');

        // Get all employees without userId
        const employees = await EmployeeModel.find({ 
            $or: [
                { userId: null },
                { userId: { $exists: false } }
            ]
        });

        console.log(`Found ${employees.length} employees without userId\n`);

        let updated = 0;
        let notFound = 0;

        for (const employee of employees) {
            console.log(`Processing employee: ${employee.fullName} (${employee.email || 'no email'})`);
            
            // Try to find user with this employee's employeeId
            let user = await User.findOne({ employeeId: employee._id });
            
            // If not found, try by email
            if (!user && employee.email) {
                user = await User.findOne({ 
                    email: { $regex: new RegExp(`^${employee.email}$`, 'i') } 
                });
            }

            if (user) {
                (employee as any).userId = user._id;
                await employee.save();
                console.log(`✓ Linked to user: ${user.email} (${user._id})\n`);
                updated++;
            } else {
                console.log(`✗ No matching user found\n`);
                notFound++;
            }
        }

        console.log('\n=== MIGRATION SUMMARY ===');
        console.log(`Total employees processed: ${employees.length}`);
        console.log(`Successfully linked: ${updated}`);
        console.log(`Not found: ${notFound}`);

        // Show employees still without userId
        const remaining = await EmployeeModel.find({ 
            $or: [
                { userId: null },
                { userId: { $exists: false } }
            ]
        }).select('fullName email position');

        if (remaining.length > 0) {
            console.log('\n=== EMPLOYEES WITHOUT USER LINK ===');
            remaining.forEach(emp => {
                console.log(`- ${emp.fullName} (${emp.email || 'no email'}) - ${emp.position || 'no position'}`);
            });
        }

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

migrateEmployeeUserId();
