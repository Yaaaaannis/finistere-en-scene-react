import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Header from './Header';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet';
function ContactPage() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    emailjs.sendForm(
      'service_s6s4e3w', // Remplacez par votre Service ID
      'template_ti43vwf', // Remplacez par votre Template ID
      form.current,
      '3hLSp5hFEdRWHV8YZ' // Remplacez par votre User ID
    )
      .then((result) => {
        console.log(result.text);
        setSubmitMessage('Merci pour votre message ! Nous vous contacterons bientôt.');
        form.current.reset();
      }, (error) => {
        console.log(error.text);
        setSubmitMessage('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Contactez-nous</h1>
        <form ref={form} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="user_name" className="block text-gray-700 font-bold mb-2">Nom</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user_email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>
        {submitMessage && (
          <p className="mt-4 text-center text-green-600">{submitMessage}</p>
        )}
      </div>
      </div>
      <Helmet>
  <title>Contactez Finistère en Scène - Spectacles et Événements Culturels en Finistère</title>
  <meta name="description" content="Contactez Finistère en Scène pour toute question ou information sur les spectacles et événements culturels en Finistère. Nous sommes à votre écoute !" />
  <meta name="keywords" content="contact Finistère en Scène, contacter Finistère en Scène, spectacles Finistère, événements culturels Finistère, questions Finistère en Scène" />
      </Helmet>

    </div>
  );
}

export default ContactPage;
