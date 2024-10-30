import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import Header from './Header';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga4';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [allSpectacles, setAllSpectacles] = useState([]);
   // Objet de mappage pour les noms de sources
   const sourceNames = {
    'spectacles': 'Le Quartz',
    'spectacles_mac_orlan': 'Le Mac Orlan',
    'spectacles_brest_arena': 'Le Brest Arena',
    'spectacles_maison_theatre': 'La Maison du Théâtre',
    'spectacles_morlaix': 'Le Théâtre de Morlaix',
    'spectacles_novomax': 'Le Novomax',

    // Ajoutez d'autres mappages ici si nécessaire
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);

    // Charger tous les spectacles depuis Firebase
    const database = getDatabase();
    const spectaclesRef = ref(database, '/');
    onValue(spectaclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const spectaclesArray = [];
        Object.keys(data).forEach(key => {
          if (Array.isArray(data[key])) {
            spectaclesArray.push(...data[key].map(spectacle => ({
              ...spectacle,
              source: key,
              id: `${key}-${spectacle.nom}-${spectacle.date}`
            })));
          }
        });
        setAllSpectacles(spectaclesArray);
      }
    });
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  const removeFavorite = (spectacleId) => {
    const newFavorites = favorites.filter(id => id !== spectacleId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const favoriteSpectacles = allSpectacles.filter(spectacle => favorites.includes(spectacle.id));

  return (
    <div>
      <Header />    
      <div className="bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Mes Spectacles Favoris</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteSpectacles.map((spectacle) => (
          <div key={spectacle.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            {spectacle.image && (
              <a href={spectacle.lien} target="_blank" rel="noopener noreferrer">
                <img 
                  src={spectacle.image} 
                  alt={spectacle.nom} 
                  className="w-full h-48 object-cover"
                />
              </a>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{spectacle.nom}</h2>
              <p className="text-gray-600 mb-1">Date: {spectacle.date}</p>
              {spectacle.realisateur && (
                <p className="text-gray-600 mb-2">Réalisateur: {spectacle.realisateur}</p>
              )}
              {spectacle.description && (
                <p className="text-gray-700 text-sm mb-2">{spectacle.description.slice(0, 150)}...</p>
              )}
              {spectacle.lieu && (
                <h2 className="text-gray-600 mb-1">Lieu: {spectacle.lieu}</h2>
              )}
              {spectacle.genre && (
                <h3 className="text-gray-600 mb-1">Genre: {spectacle.genre}</h3>
              )}
              {spectacle.prix && (
                <p className="text-gray-600 mb-1">Prix: {spectacle.prix}</p>
              )}
              {spectacle.source && (
                <p className="text-gray-500 text-xs mt-2">
                  Lieu: {sourceNames[spectacle.source] || spectacle.source}
                </p>
              )}
              <button
                onClick={() => removeFavorite(spectacle.id)}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Retirer des favoris
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Helmet>
  <title>Vos Spectacles Favoris - Finistère en Scène</title>
  <meta name="description" content="Retrouvez vos spectacles et événements culturels favoris en Finistère sur Finistère en Scène. Gardez un œil sur les spectacles que vous aimez !" />
  <meta name="keywords" content="favoris spectacles, favoris événements culturels, spectacles préférés Finistère, Finistère en Scène, spectacles à voir Finistère" />
</Helmet>

    </div>
  );
}

export default FavoritesPage;
