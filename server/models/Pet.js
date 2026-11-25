
import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['Dog', 'Cat'],
    required: true
  },

  breed: {
    type: String,
    required: true
  },

  age: {
    type: Number,
    required: true,
    min: 0
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    required: true
  },

  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Unknown'],
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: String,
    default: ''
  },

  // Adoption or Rehoming
  listingType: {
    type: String,
    enum: ['Adoption', 'Rehoming'],
    default: 'Adoption'
  },

  // Person who created the listing
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Admin approval
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  status: {
    type: String,
    enum: ['Available', 'Adopted'],
    default: 'Available'
  }

}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
