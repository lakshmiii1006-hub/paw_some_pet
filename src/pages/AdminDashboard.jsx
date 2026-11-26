
import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://paw-some-pet.onrender.com';
const API_URL = `${API_BASE}/api`;


function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingPets = async () => {
    try {
      setLoading(true);
      setError('');

      const token = sessionStorage.getItem('adminToken');

      if (!token) {
        throw new Error('Please login as admin first.');
      }

      const response = await fetch(`${API_URL}/admin/pets/pending`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch listings');
      }

      setPets(data.pets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPets();
  }, []);

  const handleReview = async (petId, action) => {
    try {
      setProcessingId(petId);
      setMessage('');
      setError('');

      const token = sessionStorage.getItem('adminToken');

      const response = await fetch(
        `${API_URL}/admin/pets/${petId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Action failed');
      }

      setPets((previousPets) =>
        previousPets.filter((pet) => pet._id !== petId)
      );

      setMessage(
        action === 'approve'
          ? 'Pet listing approved successfully!'
          : 'Pet listing rejected successfully!'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            Admin Dashboard 🐾
          </h1>
          <p className="text-slate-500 mt-2">
            Manage PawsomeAdapt pet listings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-slate-500 font-medium">
              Pending Approvals
            </p>
            <h2 className="text-3xl font-black text-orange-500 mt-3">
              {pets.length}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm mt-8 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Pending Pet Approvals
          </h2>

          {message && (
            <p className="text-green-600 mb-4">{message}</p>
          )}

          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}

          {loading && <p>Loading pending listings...</p>}

          {!loading && !error && pets.length === 0 && (
            <p className="text-slate-500">
              No pending listings.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="border rounded-xl p-4"
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-52 object-cover rounded-lg"
                />

                <h3 className="text-xl font-bold mt-3">
                  {pet.name}
                </h3>

                <p className="text-slate-600">
                  {pet.type} · {pet.breed}
                </p>

                <p className="text-slate-600">
                  Age: {pet.age} · Gender: {pet.gender}
                </p>

                <p className="text-slate-600">
                  Listing: {pet.listingType}
                </p>

                <p className="text-slate-600 mt-2">
                  {pet.description}
                </p>

                <p className="text-orange-600 font-semibold mt-3">
                  {pet.approvalStatus}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleReview(pet._id, 'approve')}
                    disabled={processingId === pet._id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50"
                  >
                    {processingId === pet._id ? 'Processing...' : 'Approve'}
                  </button>

                  <button
                    onClick={() => handleReview(pet._id, 'reject')}
                    disabled={processingId === pet._id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg disabled:opacity-50"
                  >
                    {processingId === pet._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
