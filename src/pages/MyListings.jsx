
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/pets';

function MyListings() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = sessionStorage.getItem('authToken');

        const response = await fetch(`${API_URL}/my-listings`, {
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

    fetchMyListings();
  }, []);

  const statusStyle = {
    Pending: 'bg-orange-100 text-orange-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-black text-slate-900">
          My Listings 🐾
        </h1>

        <p className="text-slate-500 mt-2 mb-8">
          Manage and track the pets you have submitted.
        </p>

        {loading && <p>Loading your listings...</p>}

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {!loading && !error && pets.length === 0 && (
          <div className="bg-white p-8 rounded-2xl text-center border">
            <p className="text-4xl mb-3">🐶</p>
            <h2 className="text-xl font-bold">
              No listings yet
            </h2>
            <p className="text-slate-500 mt-2">
              Your submitted pet listings will appear here.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            >

              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold text-slate-900">
                  {pet.name}
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  {pet.type} · {pet.breed}
                </p>

                <p className="text-slate-600 mt-3 text-sm">
                  Age: {pet.age} years
                </p>

                <p className="text-slate-600 text-sm">
                  Listing Type: {pet.listingType}
                </p>

                <div className="flex justify-between items-center mt-5 gap-2">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      statusStyle[pet.approvalStatus] ||
                      'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pet.approvalStatus || 'Legacy Listing'}
                  </span>

                  <span className="text-sm text-slate-500">
                    {pet.status}
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default MyListings;
