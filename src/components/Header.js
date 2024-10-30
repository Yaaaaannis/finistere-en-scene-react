import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-yellow-400 text-[#333333] p-4 shadow-md  z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">
            <Link to="/" className="relative group">
              <span className="relative z-10">Finistère en Scène</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </h1>
          <nav className="hidden md:flex space-x-4">
            <Link to="/favoris-spectacles-finistere" className="relative group px-2 py-1">
              <span className="relative z-10">Mes Favoris</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/a-propos-finistere-en-scene" className="relative group px-2 py-1">
              <span className="relative z-10">A Propos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact-finistere-en-scene" className="relative group px-2 py-1">
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <button 
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden" id="mobile-menu">
            <div className="flex flex-col space-y-2">
              <Link to="/favoris-spectacles-finistere" className="relative group px-2 py-1" onClick={toggleMenu}>
                <span className="relative z-10">Mes Favoris</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/a-propos-finistere-en-scene" className="relative group px-2 py-1" onClick={toggleMenu}>
                <span className="relative z-10">A Propos</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/contact-finistere-en-scene" className="relative group px-2 py-1" onClick={toggleMenu}>
                <span className="relative z-10">Contact</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
