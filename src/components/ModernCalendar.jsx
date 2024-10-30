import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from './Modal';

export default function ModernCalendar({ spectacles, sourceNames }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Définir les couleurs comme une constante réutilisable
  const sourceColors = {
    'testscrap': '#3B82F6', // bleu
    'spectacles_mac_orlan': '#10B981', // vert
    'spectacles_brest_arena': '#F59E0B', // orange
    'spectacles_maison_theatre': '#EC4899', // rose
    'spectacles_morlaix': '#8B5CF6', // violet
    'spectacles_novomax': '#EF4444', // rouge
    'spectacles_cornouaille': '#6366F1', // indigo
  };

  // Fonction améliorée pour parser les dates
  const parseCustomDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;

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

    // Pour les autres formats de date
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Fonction pour formater la date pour Google Calendar
  const formatGoogleCalendarDate = (dateString) => {
    if (!dateString) return null;
    
    const date = parseCustomDate(dateString);
    if (!date || isNaN(date.getTime())) {
      console.warn('Date invalide:', dateString);
      return null;
    }
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  // Fonction pour créer le lien Google Calendar
  const createGoogleCalendarLink = (event) => {
    if (!event || !event.date) return '#';

    const startDate = formatGoogleCalendarDate(event.date);
    if (!startDate) return '#';

    const parsedDate = parseCustomDate(event.date);
    if (!parsedDate) return '#';

    // Créer la date de fin (2 heures après le début)
    const endDate = formatGoogleCalendarDate(
      new Date(parsedDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
    );
    
    if (!endDate) return '#';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.nom || 'Événement',
      details: `${event.description || ''}\n\nLien: ${event.lien || ''}`,
      location: sourceNames[event.source] || '',
      dates: `${startDate}/${endDate}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Création des événements avec validation
  const events = spectacles.flatMap(spectacle => {
    if (!spectacle || !spectacle.date) return [];

    const dates = spectacle.date.split(',').map(d => d.trim());
    
    return dates.map(date => {
      const startDate = parseCustomDate(date);
      
      if (!startDate || isNaN(startDate.getTime())) {
        console.warn(`Date invalide pour le spectacle ${spectacle.nom}:`, date);
        return null;
      }

      return {
        id: `${spectacle.id || Math.random()}_${date}`,
        title: spectacle.nom,
        start: startDate,
        allDay: true,
        backgroundColor: sourceColors[spectacle.source] || '#3B82F6',
        borderColor: sourceColors[spectacle.source] || '#3B82F6',
        extendedProps: {
          ...spectacle
        }
      };
    }).filter(Boolean); // Filtrer les événements null
  });

  const handleEventClick = (clickInfo) => {
    const spectacle = clickInfo.event.extendedProps;
    setSelectedEvent(spectacle);
    setIsModalOpen(true);
  };

  // Ajoutez ces styles CSS personnalisés pour la popup
  const customStyles = `
    .fc-popover {
      max-width: 200px !important;
      transform: translateY(-100%) !important;
    }
    .fc-popover-body {
      max-height: 200px;
      overflow-y: auto;
    }
    .fc-popover .fc-daygrid-event {
      max-width: 180px !important;
      white-space: normal !important;
      margin: 2px 4px !important;
      padding: 2px 4px !important;
    }
    .fc-popover .fc-event {
      width: 180px !important;
    }
    .fc-popover .fc-event-main {
      width: 100% !important;
    }
    .fc-theme-standard .fc-popover {
      z-index: 1000 !important;
    }

    /* Styles spécifiques pour mobile */
    @media (max-width: 768px) {
      .fc-popover {
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
      }
    }
  `;

  return (
    <div className="relative">
      <style>{customStyles}</style>
      <button 
        className="p-2 bg-blue-300 text-white hover:bg-blue-400 rounded-full transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg 
          className="w-6 h-6 text-gray-700"
          viewBox="0 0 24 24"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed md:absolute top-[50%] md:top-full left-[50%] md:left-auto md:right-0 
          transform -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:-translate-y-0 
          z-50 bg-white rounded-lg shadow-lg p-2 md:p-3 border border-gray-200
          w-[90vw] md:w-[500px] max-h-[90vh] md:max-h-none">
          
          {/* Légende des couleurs plus compacte */}
          <div className="mb-1 md:mb-2 p-1 md:p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium mb-1">Légende des salles :</p>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              {Object.entries(sourceNames).map(([key, name]) => (
                <div key={key} className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: sourceColors[key] }}
                  />
                  <span className="truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conteneur du calendrier */}
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={frLocale}
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'today'
              }}
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois'
              }}
              height={400} // Hauteur fixe plus petite
              displayEventTime={false}
              displayEventEnd={false}
              dayMaxEvents={2}
              moreLinkContent={(args) => `+${args.num} autres`}
              eventContent={(eventInfo) => (
                <div className="truncate text-[8px] hover:bg-opacity-90 cursor-pointer py-0.5 px-1">
                  <div className="flex items-center gap-0.5">
                    <div 
                      className="w-1 h-1 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: sourceColors[eventInfo.event.extendedProps.source] }}
                    />
                    <span className="font-medium truncate leading-none">
                      {eventInfo.event.title}
                    </span>
                  </div>
                </div>
              )}
              moreLinkClassNames="text-[8px] md:text-xs text-blue-600 hover:text-blue-800 hover:underline px-1"
              eventClassNames="mx-0.5 my-0.5 rounded"
              dayCellClassNames="text-[10px] md:text-xs min-h-[30px]"
              dayHeaderFormat={{ weekday: 'narrow' }} // Jours plus courts (L,M,M,J,V,S,D)
            />
          </div>
        </div>
      )}

      {/* Modal pour afficher les détails du spectacle */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      >
        {selectedEvent && (
          <div className="text-[#333333]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.nom} 
              className="w-full h-auto object-contain mb-2 rounded-t-lg" 
            />
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.nom}</h2>
            <p className="mb-2">{selectedEvent.description}</p>
            <p className="mb-2">Date: {selectedEvent.date}</p>
            <h2 className="mb-2">Lieu: {sourceNames[selectedEvent.source]}</h2>
            
            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 mt-4">
              <a 
                href={selectedEvent.lien} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Voir sur le site
              </a>
              
              {parseCustomDate(selectedEvent.date) && (
                <a 
                  href={createGoogleCalendarLink(selectedEvent)}
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
        )}
      </Modal>
    </div>
  );
}
