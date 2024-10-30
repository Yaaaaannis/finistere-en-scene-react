import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import FavoritesPage from './components/FavoritesPage';
function Router() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact-finistere-en-scene" element={<ContactPage />} />
          <Route path="/a-propos-finistere-en-scene" element={<AboutPage />} />
          <Route path="/favoris-spectacles-finistere" element={<FavoritesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Router;

