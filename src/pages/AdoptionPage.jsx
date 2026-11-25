
import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PETS_API_URL = `${API_BASE}/api/pets`;

function AdoptionPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(PETS_API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }

        const data = await response.json();
        setPets(data);

      } catch (err) {
        console.error('Fetch Pets Error:', err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 font-semibold">
          Loading adorable pets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-5 rounded-xl">
        {error}. Please check whether your backend is running.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Find Your New Best Friend 🐾
        </h1>
        <p className="text-slate-500 mt-2">
          Meet lovely pets waiting for a loving home.
        </p>
      </div>

      {pets.length === 0 ? (
        <p className="text-slate-500 py-10 text-center">
          No pets are available for adoption right now.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >

              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5 space-y-3">

                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">
                    {pet.name}
                  </h2>

                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                    {pet.status}
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  {pet.breed} • {pet.age} years old
                </p>

                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-slate-100 px-3 py-1.5 rounded-full">
                    {pet.type}
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-full">
                    {pet.gender}
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-full">
                    {pet.size}
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  {pet.description}
                </p>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdoptionPage;
