import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Assurez-vous que cette ligne est exécutée avant toute utilisation de mapboxgl
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapboxMap = ({ theatres, onMapLoad }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef();

  // Tableau des URLs des sites web des salles de spectacle
  const theatreWebsites = {
    'Théâtre du Pays de Morlaix': 'https://www.theatre-du-pays-de-morlaix.fr/',
    'Le Mac Orlan': 'https://mac-orlan.brest.fr/',
    'Le Quartz': 'https://www.lequartz.com/',
    'Le Brest Arena': 'https://brestarena.fr/',
    'Le Novomax': 'https://www.lenovomax.bzh/',
    'La Maison du Théâtre': 'https://lamaisondutheatre.com/',
    'Théâtre de Cornouaille': 'https://www.theatre-cornouaille.fr/',
    // Ajoutez ici les autres salles de spectacle et leurs URLs
  };

  useEffect(() => {
    if (mapboxgl.accessToken) {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && onMapLoad) {
      onMapLoad({
        flyTo: (theatre) => {
          mapRef.current?.flyTo({
            center: [theatre.lon, theatre.lat],
            zoom: 15,
            duration: 2000
          });
        }
      });
    }
  }, [mapLoaded, onMapLoad]);

  if (!mapLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      paddingTop: '20px',
      paddingBottom: '20px',
      height: '420px' ,
      backgroundColor: '#FAF9F6',
      opacity: '1'
    }}>
      <Map 
        ref={mapRef}
        initialViewState={{
        longitude: -4.486076,
        latitude: 48.390394,
        zoom: 7
      }}
      style={{width: '75%', 
        height: '400px', 
        borderRadius: '15px',
        overflow: 'hidden'}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {theatres.map((theatre, index) => (
        <Marker
          key={index}
          longitude={theatre.lon}
          latitude={theatre.lat}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo(theatre);
          }}
        >
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.lon)}
          latitude={Number(popupInfo.lat)}
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <h3>{popupInfo.name}</h3>
            {theatreWebsites[popupInfo.name] ? (
              <a 
                href={theatreWebsites[popupInfo.name]} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visiter le site web
              </a>
            ) : (
              <p>Pas de site web disponible</p>
            )}
          </div>
        </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapboxMap;
