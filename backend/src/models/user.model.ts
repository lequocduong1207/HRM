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

export const User = model<IUser>("User", userSchema);
