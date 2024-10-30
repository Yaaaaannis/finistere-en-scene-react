import React from 'react';
import Header from './Header';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

function AboutPage() {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);



  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">À propos de Finistère en Scène</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
            <p className="text-gray-700 mb-4">
              Finistère en Scène a pour mission de promouvoir et de célébrer la richesse culturelle du Finistère
              en mettant en lumière les spectacles et événements artistiques de la région. Nous nous efforçons
              de créer un pont entre les artistes locaux et leur public, en offrant une plateforme centralisée
              pour découvrir et apprécier les talents de notre belle région.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Les Lieux Compatibles</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li><a href="https://mac-orlan.brest.fr/" target="_blank" rel="noopener noreferrer" className="hover:bg-[#FFFF00] transition-colors">Le Mac Orlan</a></li>
              <li><a href="https://www.brestarena.com/" className="hover:bg-[#FFFF00] transition-colors" target="_blank" rel="noopener noreferrer">Brest Arena</a></li>
              <li><a href="https://lamaisondutheatre.com/" className="hover:bg-[#FFFF00] transition-colors" target="_blank" rel="noopener noreferrer">La Maison du Théâtre</a></li>
              <li><a href="https://www.theatre-du-pays-de-morlaix.fr/" className="hover:bg-[#FFFF00] transition-colors" target="_blank" rel="noopener noreferrer">Le Théâtre de Morlaix</a></li>
              <li><a href="https://lenovomax.bzh/" className="hover:bg-[#FFFF00] transition-colors" target="_blank" rel="noopener noreferrer">Le Novomax</a></li>
              <li><a href="https://www.lequartz.com/" className="hover:bg-[#FFFF00] transition-colors" target="_blank" rel="noopener noreferrer">Le Quartz</a></li>
              <li><a href="https://www.theatre-cornouaille.fr/" className="hover:bg-[#FFFF00] transition-colors" target="_blank" rel="noopener noreferrer">Théâtre de Cornouaille</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">L'avancée du Projet Finistère en Scène</h2>
            <p className="text-gray-700 mb-4">
              Finistère en Scène est un projet en développement. Nous nous efforçons de mettre en lumière les spectacles et événements de la région. Cette tache demande du temps et donc beaucoup d'établissements ne sont pas encore présent sur la plateforme. Cela viendra avec le temps, mais si vous souhaitez nous aider à améliorer le projet n'hésitez pas à nous contacter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contactez-nous</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700">
                  Email : <a href="mailto:contact@finistere-en-scene.fr" className="hover:underline">yannisfebvre@gmail.com</a>
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="https://fr.linkedin.com/in/yannis-febvre-ba312a226" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://x.com/RoadToDevWebb" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
            <Helmet>
          <title>À propos de Finistère en Scène - Plateforme de Spectacles et Événements Culturels en Finistère</title>
          <meta name="description" content="Découvrez la mission et l'équipe derrière Finistère en Scène, la plateforme dédiée à la promotion des spectacles et événements culturels en Finistère. Rejoignez-nous pour explorer la richesse artistique de la région !" />
              <meta name="keywords" content="spectacles, Finistère, culture, théâtre, musique" />
            </Helmet>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
