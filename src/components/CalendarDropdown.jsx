import { useState, useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'fr': fr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarDropdown({ spectacles }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Convertir les spectacles au format attendu par react-big-calendar
  const events = spectacles.map(spectacle => ({
    title: spectacle.nom,
    start: new Date(spectacle.date),
    end: new Date(spectacle.date),
    resource: spectacle
  }));

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
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
        <div className="absolute top-full right-0 z-50 bg-white rounded-lg shadow-lg p-4 w-[800px] border border-gray-200">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            culture="fr"
            messages={{
              next: "Suivant",
              previous: "Précédent",
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour"
            }}
          />
        </div>
      )}
    </div>
  );
}
