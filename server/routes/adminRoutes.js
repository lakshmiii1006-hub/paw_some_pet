
import express from 'express';
import Pet from '../models/Pet.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes below require an admin login
router.use(protect, allowRoles('admin'));


// 1. GET ALL PENDING PET LISTINGS
router.get('/pets/pending', async (req, res) => {
  try {
    const pets = await Pet.find({
      approvalStatus: 'Pending'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: pets.length,
      pets
    });

  } catch (error) {
    console.error('Pending Pets Error:', error);

    res.status(500).json({
      message: 'Failed to fetch pending listings'
    });
  }
});


// 2. APPROVE A PET LISTING
router.patch('/pets/:id/approve', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: 'Pet listing not found'
      });
    }

    if (pet.approvalStatus !== 'Pending') {
      return res.status(400).json({
        message: 'This listing has already been reviewed'
      });
    }

    pet.approvalStatus = 'Approved';
    await pet.save();

    res.status(200).json({
      message: 'Pet listing approved successfully!',
      pet
    });

  } catch (error) {
    console.error('Approve Pet Error:', error);

    res.status(500).json({
      message: 'Failed to approve pet listing'
    });
  }
});


// 3. REJECT A PET LISTING
router.patch('/pets/:id/reject', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: 'Pet listing not found'
      });
    }

    if (pet.approvalStatus !== 'Pending') {
      return res.status(400).json({
        message: 'This listing has already been reviewed'
      });
    }

    pet.approvalStatus = 'Rejected';
    await pet.save();

    res.status(200).json({
      message: 'Pet listing rejected successfully!',
      pet
    });

  } catch (error) {
    console.error('Reject Pet Error:', error);

    res.status(500).json({
      message: 'Failed to reject pet listing'
    });
  }
});

export default router;
