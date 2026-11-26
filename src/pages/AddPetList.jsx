
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://paw-some-pet.onrender.com';
const API_URL = `${API_BASE}/api/pets`;


function AddPetListing() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('authUser') || 'null');

  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    gender: 'Unknown',
    size: 'Medium',
    description: '',
    listingType: 'Adoption'
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isOwner = user?.role === 'owner';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.');
      return;
    }

    setError('');
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const token = sessionStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    if (!image) {
      setError('Please upload a pet image.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append('image', image);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit listing');
      }

      setSuccess(result.message);

      setTimeout(() => {
        navigate('/my-listings');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !['owner', 'rescuer', 'shelter'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-800">
            Access Restricted
          </h2>
          <p className="text-slate-500 mt-3">
            Only pet owners, rescuers and shelters can submit pet listings.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <p className="text-indigo-600 font-semibold">
            PAWSOMEADAPT 🐾
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
            Add a Pet Listing
          </h1>

          <p className="text-slate-500 mt-2">
            Help a pet find a loving and caring home.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6"
        >

          {/* PET IMAGE */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Pet Image *
            </label>

            <label className="block border-2 border-dashed border-slate-300 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-400">
              {preview ? (
                <img
                  src={preview}
                  alt="Pet preview"
                  className="w-full h-56 object-cover rounded-lg"
                />
              ) : (
                <div className="py-10">
                  <p className="text-4xl">📸</p>
                  <p className="font-semibold text-slate-700 mt-3">
                    Click to upload pet image
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    JPG, PNG or WEBP · Maximum 5 MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* PET NAME */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Pet Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pet name"
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* TYPE AND BREED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Animal Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Breed *
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g. Indie, Labrador"
                required
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>

          {/* AGE AND GENDER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Age (years) *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="e.g. 2"
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* SIZE */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Pet Size *
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* LISTING TYPE */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Listing Type *
            </label>
            <select
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Adoption">Adoption</option>

              {isOwner && (
                <option value="Rehoming">Rehoming</option>
              )}
            </select>

            <p className="text-sm text-slate-400 mt-2">
              {isOwner
                ? 'Choose whether you are offering the pet for adoption or rehoming.'
                : 'Rescuers and shelters can submit adoption listings.'}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about the pet, its personality, health and special needs..."
              rows="5"
              required
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          {/* MESSAGES */}
          {error && (
            <p className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </p>
          )}

          {success && (
            <p className="bg-green-50 text-green-700 p-3 rounded-lg">
              {success}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? 'Submitting Listing...' : 'Submit Pet Listing 🐾'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Your listing will be visible publicly after admin approval.
          </p>

        </form>
      </div>
    </div>
  );
}

export default AddPetListing;
