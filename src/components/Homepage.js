import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import Header from './Header';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga4';
import MapboxMap from './MapboxMap';
import ShowList from './ShowList';
import ModernCalendar from './ModernCalendar';

// Votre configuration Firebase
const firebaseConfig = {
  // Remplacez ceci par votre propre configuration
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "https://theathre-31302-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function parseDate(dateString) {
  if (!dateString) {
    console.warn('Date non définie');
    return new Date(0); // Retourne une date très ancienne pour les trier en premier
  }

  const months = {
    'jan': 0, 'fév': 1, 'mar': 2, 'avr': 3, 'mai': 4, 'juin': 5,
    'juil': 6, 'août': 7, 'sept': 8, 'oct': 9, 'nov': 10, 'déc': 11
  };

  // Gestion des formats comme "13 sept. 24"
  const match = dateString.match(/(\d+)\s+(\w+)\.?\s+(\d+)/);
  if (match) {
    const [, day, month, year] = match;
    const monthIndex = months[month.toLowerCase().slice(0, 3)];
    return new Date(2000 + parseInt(year), monthIndex, parseInt(day));
  }

  // Gestion des formats comme "jeudi 22 mai 2025"
  const match2 = dateString.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (match2) {
    const [, day, month, year] = match2;
    const monthIndex = months[month.toLowerCase().slice(0, 3)];
    return new Date(parseInt(year), monthIndex, parseInt(day));
  }

  // Si aucun format ne correspond, essayez de parser directement
  return new Date(dateString);
}


function HomePage() {
  const [allSpectacles, setAllSpectacles] = useState([]);
  const [displayedSpectacles, setDisplayedSpectacles] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [mapActions, setMapActions] = useState(null);

  // Objet de mappage pour les noms de sources
  const sourceNames = {
    
    'testscrap' : 'Le Quartz',
    'spectacles_mac_orlan': 'Le Mac Orlan',
    'spectacles_brest_arena': 'Le Brest Arena',
    'spectacles_maison_theatre': 'La Maison du Théâtre',
    'spectacles_morlaix': 'Théâtre du Pays de Morlaix',
    'spectacles_novomax': 'Le Novomax',
    'spectacles_cornouaille': 'Théâtre de Cornouaille',
    

    // Ajoutez d'autres mappages ici si nécessaire
  };

  const theatres = [
    { name: "Théâtre du Pays de Morlaix", lat: 48.5758718, lon: -3.8290353},
    { name: "Le Quartz", lat: 48.3888921, lon: -4.484611 },
    { name: "Le Mac Orlan", lat: 48.3841577, lon: -4.5027278},
    { name: "Le Brest Arena", lat: 48.385108947753906, lon: -4.535250663757324 },
    { name: "La Maison du Théâtre", lat: 48.4150702, lon: -4.4933257 },
    { name: "Le Novomax", lat: 47.9950341, lon: -4.0977542 },
    { name: "Théâtre de Cornouaille", lat: 47.995408, lon: -4.110228 },
    // Ajoutez d'autres théâtres ici
  ];

  const locations = [
    { key: 'all', name: 'Tous' },
    ...Object.entries(sourceNames).map(([key, name]) => ({ key, name }))
  ];

 

  useEffect(() => {
    const spectaclesRef = ref(database, '/');
    const listener = onValue(spectaclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allSpectacles = [];
        
        // Fonction pour normaliser les dates
        const parseDate = (dateString) => {
          if (!dateString) return new Date(0);
          
          // Pour les dates avec flèche (ex: "4 oct. → 5 oct. 2024")
          if (dateString.includes('→')) {
            dateString = dateString.split('→')[0].trim();
          }
          
          // Pour les dates multiples séparées par des virgules
          if (dateString.includes(',')) {
            dateString = dateString.split(',')[0].trim();
          }

          return new Date(dateString);
        };

        // Récupérer tous les spectacles et les mélanger par salle
        const salles = Object.keys(data);
        let currentIndex = 0;
        
        while (salles.some(salle => data[salle].length > currentIndex)) {
          salles.forEach(salle => {
            if (data[salle][currentIndex]) {
              allSpectacles.push({
                ...data[salle][currentIndex],
                source: salle,
                id: `${salle}-${data[salle][currentIndex].nom}-${data[salle][currentIndex].date}`
              });
            }
          });
          currentIndex++;
        }

        // Trier par date
        allSpectacles.sort((a, b) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          return dateA - dateB;
        });

        setAllSpectacles(allSpectacles);
      }
    });

    return () => off(spectaclesRef, listener);
  }, []);

  useEffect(() => {
    // Filtrer les spectacles selon le currentFilter
    let spectaclesToDisplay = currentFilter === 'all' 
      ? [...allSpectacles]
      : allSpectacles.filter(spectacle => spectacle.source === currentFilter);
    
    // Limiter le nombre de spectacles affichés
    setDisplayedSpectacles(spectaclesToDisplay.slice(0, displayCount));
  }, [allSpectacles, displayCount, currentFilter]);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setDisplayCount(20);
    if (mapActions) {
      const theatre = theatres.find(t => t.name === sourceNames[filter]);
      if (theatre) {
        mapActions.flyTo(theatre);
      }
    }
  };

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  

  const handleMapLoad = useCallback((actions) => {
    setMapActions(actions);
  }, []);

  const buttonStyle = "bg-blue-200 text-blue-800 px-4 py-2 rounded-md shadow-sm hover:bg-blue-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50";

  return (
    <div> 
      <header>
        <Header />
      </header>
      <main>
      <MapboxMap theatres={theatres} onMapLoad={handleMapLoad} />
      <div className="bg-[#FAF9F6] min-h-screen">
        <header className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {locations.map((location) => (
              <button
                key={location.key}
                onClick={() => handleFilterChange(location.key)}
                className={`${buttonStyle} ${
                  currentFilter === location.key ? 'bg-blue-300 text-blue-900' : ''
                }`}
              >
                {location.name}
              </button>
            ))}
            {/* <CalendarDropdown spectacles={displayedSpectacles} /> */}
            <ModernCalendar spectacles={allSpectacles} sourceNames={sourceNames} validRange={{
    start: '2024-01-01',
    end: '2025-12-31'
  }}
  initialDate={new Date()} // Date actuelle
  showNonCurrentDates={true}
  fixedWeekCount={false}/>
          </div>
        </header>
        <div className="p-8">
          <ShowList 
            shows={displayedSpectacles} 
            currentFilter={currentFilter}
            sourceNames={sourceNames}
          />
          {displayedSpectacles.length < allSpectacles.filter(s => currentFilter === 'all' || s.source === currentFilter).length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-blue-300 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
              >
                Afficher plus
              </button>
            </div>
          )}
        </div>
        <Helmet>
    <title>Finistère en Scène - Spectacles, Théâtre et Événements Culturels en Finistère</title>
        <meta name="description" content="Découvrez les meilleurs spectacles, concerts, et événements culturels en Finistère. Explorez notre agenda complet des événements à venir dans les théâtres et salles de spectacle de la région." />
        <meta name="keywords" content="spectacles Finistère, événements culturels, concerts Finistère, théâtre Finistère, agenda culturel Finistère, spectacles Bretagne" />
</Helmet>

      </div>
      </main>
    </div>
    
  );
}

export default HomePage;
