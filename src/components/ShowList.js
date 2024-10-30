import React from 'react';
import useModal from '../hooks/usemodal';
import Modal from './Modal';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const ShowList = ({ shows, sourceNames }) => {
  const { isOpen, content, openModal, closeModal } = useModal();
  const [favorites, setFavorites] = useState([]);
  const [sortedShows, setSortedShows] = useState([]);

  useEffect(() => {
    // Fonction pour obtenir la première date d'un spectacle
    const getFirstDate = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes(',')) {
        return dateStr.split(',')[0].trim();
      }
      if (dateStr.includes('→')) {
        return dateStr.split('→')[0].trim();
      }
      return dateStr;
    };

    // Fonction pour convertir une date en objet Date
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0);
      // Format DD.MM.YYYY
      const [day, month, year] = dateStr.split('.');
      if (day && month && year) {
        return new Date(year, month - 1, day);
      }
      return new Date(dateStr);
    };

    // Fusionner et trier tous les spectacles
    const sorted = [...shows].sort((a, b) => {
      const dateA = parseDate(getFirstDate(a.date));
      const dateB = parseDate(getFirstDate(b.date));
      return dateA - dateB;
    });

    setSortedShows(sorted);
  }, [shows]);

  useEffect(() => {
    // Charger les favoris depuis le localStorage au chargement de la page
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    // Préchargez les 3-5 premières images
    shows.slice(0, 5).forEach(show => {
      if (show.image) {
        preloadImage(show.image);
      }
    });
  }, [shows]);

  // Fonction pour parser la date
  const parseCustomDate = (dateString) => {
    if (!dateString) return null;

    // Pour les dates multiples, prendre la première
    if (dateString.includes(',')) {
      dateString = dateString.split(',')[0].trim();
    }
    if (dateString.includes('→')) {
      dateString = dateString.split('→')[0].trim();
    }

    // Pour le format DD.MM.YYYY
    if (dateString.includes('.')) {
      const parts = dateString.split('.');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        // S'assurer que l'année est sur 4 chiffres
        const fullYear = year.length === 2 ? `20${year}` : year;
        return new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
      }
    }

    // Pour les formats avec texte (ex: "sam 5 oct 19h00")
    if (dateString.includes(' ')) {
      try {
        // Convertir en français vers format ISO
        const months = {
          'jan': '01', 'fév': '02', 'mar': '03', 'avr': '04',
          'mai': '05', 'jun': '06', 'jul': '07', 'aoû': '08',
          'sep': '09', 'oct': '10', 'nov': '11', 'déc': '12'
        };
        
        const parts = dateString.toLowerCase().split(' ');
        const day = parts.find(p => !isNaN(p));
        const month = Object.entries(months).find(([key]) => 
          parts.some(p => p.startsWith(key)))?.[1];
        
        if (day && month) {
          const currentYear = new Date().getFullYear();
          return new Date(currentYear, parseInt(month) - 1, parseInt(day));
        }
      } catch (e) {
        console.warn('Erreur parsing date:', dateString);
      }
    }

    // Pour les autres formats de date
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (e) {
      console.warn('Format de date non reconnu:', dateString);
    }

    return null;
  };

  // Fonction pour formater la date pour Google Calendar
  const formatGoogleCalendarDate = (dateString) => {
    const date = parseCustomDate(dateString);
    if (!date || isNaN(date.getTime())) {
      console.warn('Date invalide:', dateString);
      return null;
    }
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  // Fonction pour créer le lien Google Calendar
  const createGoogleCalendarLink = (event) => {
    const startDate = formatGoogleCalendarDate(event.date);
    if (!startDate) return '#'; // Retourne un lien vide si la date est invalide

    // Créer la date de fin (2 heures après le début)
    const endDate = formatGoogleCalendarDate(
      new Date(parseCustomDate(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString()
    );
    
    if (!endDate) return '#';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.nom,
      details: `${event.description || ''}\n\nLien: ${event.lien || ''}`,
      location: sourceNames[event.source] || event.lieu || '',
      dates: `${startDate}/${endDate}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const handleShowClick = (show) => {
    openModal(
      <div className="text-[#333333]" onClick={(e) => e.stopPropagation()}>
        <img src={show.image} alt={show.nom} className="w-full h-auto object-contain mb-2 rounded-t-lg" />
        <h2 className="text-2xl font-bold mb-4">{show.nom}</h2>
        <p className="mb-2">{show.description}</p>
        <p className="mb-2">Date: {show.date}</p>
        <h2 className="mb-2">Lieu: {sourceNames[show.source]}</h2>
        
        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4 mt-4">
          <a 
            href={show.lien} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir sur le site
          </a>
          
          {parseCustomDate(show.date) && ( // N'affiche le bouton que si la date est valide
            <a 
              href={createGoogleCalendarLink(show)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-green-500 hover:text-green-700 cursor-pointer flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ajouter à Google Calendar
            </a>
          )}
        </div>
      </div>
    );
  };

  const toggleFavorite = (spectacleId) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav === spectacleId);
      const newFavorites = isFavorite
        ? prevFavorites.filter(fav => fav !== spectacleId)
        : [...prevFavorites, spectacleId];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  
    

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-[#FAF9F6]">
      {sortedShows.map((show) => (
        <div 
          key={show.id} 
          className="bg-white shadow-md rounded-lg p-4 cursor-pointer 
             transition-all duration-300 ease-in-out
             hover:shadow-lg hover:bg-gray-50 hover:scale-[1.03] 
               hover:border-gray-200 relative flex flex-col"
          onClick={() => handleShowClick(show)}
        >
          {show.image && (
            <LazyLoadImage
              src={show.image}
              alt={show.nom}
              loading="lazy"
              effect="blur"
              className="w-full h-48 object-cover mb-2 rounded-t-lg"
            />
          )}
          <h3 className="text-xl font-semibold mb-2">{show.nom}</h3>
          <p className="text-gray-600">{show.date}</p>
          <h3 className="text-gray-600">{sourceNames[show.source]}</h3>
          <p className="text-gray-600 pt-4 line-clamp-3 flex-grow">{show.description}</p>
          <div className="mt-4 flex justify-between items-center">
            {show.link && (
              <a 
                href={show.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:text-blue-700 cursor-pointer inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                Voir sur le site
              </a>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(show.id);
              }}
              className="p-2 bg-white rounded-full shadow-md transition-colors duration-300 hover:bg-gray-100"
              aria-label={favorites.includes(show.id) ? `Retirer ${show.nom} des favoris` : `Ajouter ${show.nom} aux favoris`}
            >
              {favorites.includes(show.id) ? (
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              <span className="sr-only">
                {favorites.includes(show.id) ? `Retirer ${show.nom} des favoris` : `Ajouter ${show.nom} aux favoris`}
              </span>
            </button>
          </div>
        </div>
      ))}

      <Modal isOpen={isOpen} onClose={closeModal} allowClickInside={true}>
        {content}
      </Modal>
    </div>
  );
  
};


export default ShowList;
