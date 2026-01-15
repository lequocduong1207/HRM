import { Schema, model, Document, Types } from "mongoose";
import { resetPassword } from "../services";

/**
 * Role của user
 */
export type UserRole =
  | "admin"
  | "hr_manager"
  | "manager"
  | "employee";

/**
 * Interface User
 */
export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  employeeId?: Types.ObjectId;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  // Account Lockout fields
  loginAttempts: number;
  lockUntil?: Date | null;
}

/**
 * Schema User
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      enum: ["admin", "hr_manager", "manager", "employee"],
      default: "employee"
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    /**
     * FK → employee
     * NULL nếu là system account
     */
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      unique: true,
      sparse: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    
    // 🔒 Account Lockout fields
    loginAttempts: {
      type: Number,
      default: 0,
      required: true
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/**
 * Không trả password ra API
 */
userSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.passwordHash;
    return ret;
  }
});

/**
 * 🔒 Virtual field: isLocked
 * Check if account is currently locked
 */
userSchema.virtual('isLocked').get(function() {
  // Check if lockUntil exists and is in the future
  return !!(this.lockUntil && this.lockUntil > new Date());
});

/**
 * 🔒 Method: incrementLoginAttempts
 * Increment failed login attempts and lock account if needed
 */
userSchema.methods.incrementLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  // Otherwise increment attempts
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock the account if we've reached max attempts (5)
  const maxAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + lockTime) };
  }
  
  return await this.updateOne(updates);
};

/**
 * 🔒 Method: resetLoginAttempts
 * Reset login attempts after successful login
 */
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

export const User = model<IUser>("User", userSchema);
