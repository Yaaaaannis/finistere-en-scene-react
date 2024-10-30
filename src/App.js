import React from 'react';
import './App.css';
import Router from './Router';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import FavoritesPage from './components/FavoritesPage';
import ReactGA from 'react-ga4';
import { Suspense } from 'react';
import { useEffect } from 'react';
ReactGA.initialize('G-XXXXXXXXXX'); // Remplacez par votre ID de mesure GA4

function App() {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  return (
    <Router >
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact-finistere-en-scene" element={<ContactPage />} />
          <Route path="/a-propos-finistere-en-scene" element={<AboutPage />} />
          <Route path="/favorites-spectacles-finistere" element={<FavoritesPage />} />
        </Routes>
    </Router>
  );
}

export default App;
