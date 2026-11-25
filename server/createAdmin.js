
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('Admin environment variables are missing');
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error('Admin password must contain at least 8 characters');
    }

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase().trim()
    });

    if (existingAdmin) {
      console.log('An account with this email already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('Admin account created successfully!');

  } catch (error) {
    console.error('Admin creation failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
