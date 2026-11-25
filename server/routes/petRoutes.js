
import express from 'express';
import Pet from '../models/Pet.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({
    message: 'Pet routes are working!'
  });
});

const capitalize = (s) =>
  typeof s === 'string' && s
    ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    : s;


// ADD A NEW PET LISTING
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      gender,
      size,
      description,
      listingType
    } = req.body;

    const userRole = req.user.role;

    // Default listing type
    const finalListingType = listingType
      ? capitalize(listingType)
      : 'Adoption';

    // Check allowed roles
    if (
      finalListingType === 'Adoption' &&
      !['owner', 'rescuer', 'shelter'].includes(userRole)
    ) {
      return res.status(403).json({
        message: 'You are not allowed to create adoption listings'
      });
    }

    if (
      finalListingType === 'Rehoming' &&
      userRole !== 'owner'
    ) {
      return res.status(403).json({
        message: 'Only pet owners can create rehoming listings'
      });
    }

    if (!['Adoption', 'Rehoming'].includes(finalListingType)) {
      return res.status(400).json({
        message: 'Invalid listing type'
      });
    }

    // Validate required fields
    if (
      !name ||
      !type ||
      !breed ||
      age === undefined ||
      age === '' ||
      !gender ||
      !size ||
      !description
    ) {
      return res.status(400).json({
        message: 'Please provide all required pet details'
      });
    }

    if (!Number.isFinite(Number(age)) || Number(age) < 0) {
      return res.status(400).json({
        message: 'Please provide a valid pet age'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a pet image'
      });
    }

    // Upload image to Cloudinary
    const imageUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'pawsomeadapt/pets' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    // Save pet details in MongoDB
    const newPet = new Pet({
      name,
      type: capitalize(type),
      breed,
      age: Number(age),
      gender: capitalize(gender),
      size: capitalize(size),
      description,
      image: imageUrl,
      listingType: finalListingType,
      owner: req.user.id,
      approvalStatus: 'Pending'
    });

    await newPet.save();

    res.status(201).json({
      message: 'Pet listing submitted successfully! Waiting for admin approval.',
      pet: newPet
    });

  } catch (error) {
    console.error('Add Pet Error:', error);
    console.log('Cloudinary HTTP Code:', error.http_code);
    console.log('Cloudinary Message:', error.message);

    res.status(500).json({
      message: 'Failed to add pet',
      error: error.message
    });
  }
});

// GET LISTINGS CREATED BY THE LOGGED-IN USER
router.get('/my-listings', protect, async (req, res) => {
  try {
    const pets = await Pet.find({
      owner: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: pets.length,
      pets
    });

  } catch (error) {
    console.error('My Listings Error:', error);

    res.status(500).json({
      message: 'Failed to fetch your listings'
    });
  }
});

// GET APPROVED AND AVAILABLE PETS
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find({
      status: 'Available',

      // Keep older listings like Bruno visible
      // if they don't have an approvalStatus yet.
      approvalStatus: {
        $in: ['Approved', null]
      }
    });

    res.status(200).json(pets);

  } catch (error) {
    console.error('Fetch Pets Error:', error);

    res.status(500).json({
      message: 'Failed to fetch pets'
    });
  }
});

export default router;
