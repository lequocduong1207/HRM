import { Schema, model, Document, Types } from "mongoose";
import { resetPassword } from "../services";

export type UserRole =
  | "admin"
  | "hr_manager"
  | "department_manager"
  | "employee";

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  fullName: string;
  phone?: string;
  role?: UserRole;          
  roleId: Types.ObjectId;    
  departmentId?: Types.ObjectId; 
  employeeId?: Types.ObjectId;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  refreshToken?: string | null;
  refreshTokenExpires?: Date | null;
  loginAttempts: number;
  lockUntil?: Date | null;
}

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
      enum: ["admin", "hr_manager", "department_manager", "manager", "employee"],
      required: false,
    },

    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false
    },
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
    
    refreshToken: {
      type: String,
      default: null
    },
    refreshTokenExpires: {
      type: Date,
      default: null
    },
    
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

// khong tra ve passwordHash va refreshToken
userSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.passwordHash;
    delete ret.refreshToken;
    return ret;
  }
});

// Virtual property: isLocked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Increment failed login attempts and lock account if needed
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
  const lockTime = 30 * 60 * 1000; 
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + lockTime) };
  }
  
  return await this.updateOne(updates);
};

// Reset login attempts and unlock account
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

export const User = model<IUser>("User", userSchema);
