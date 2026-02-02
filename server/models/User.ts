import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  plan: 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'suspended' | 'churned';
  signupDate: Date;
  lastLogin?: Date;
  jobsSubmitted: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    plan: {
      type: String,
      enum: ['standard', 'premium', 'enterprise'],
      default: 'standard',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'churned'],
      default: 'active',
    },
    signupDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    jobsSubmitted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);



// Method to convert user to JSON without password
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = mongoose.model<IUser>('User', UserSchema);

