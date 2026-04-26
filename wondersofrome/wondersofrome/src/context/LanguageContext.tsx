'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export type Language = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ru';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translateTour: (tour: any) => TranslatedTour;
}

// Tour translations interface
export interface TranslatedTour {
    _id: string;
    title: string;
    description?: string;
    highlights?: string[];
    includes?: string[];
    excludes?: string[];
    meetingPoint?: string;
    importantInfo?: string[];
    itinerary?: Array<{ title: string; description: string; duration: string }>;
    faqs?: Array<{ question: string; answer: string }>;
    slug: { current: string };
    mainImage?: any;
    gallery?: any[];
    price: number;
    duration: string;
    category: string;
    badge?: string;
    rating?: number;
    reviewCount?: number;
    groupSize?: string;
    location?: string;
    mapAddress?: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    // Raw translations object
    translations?: Record<string, any>;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation
        'nav.colosseum': 'Colosseum Tours',
        'nav.vatican': 'Vatican Tours',
        'nav.city': 'City Tours',
        'nav.hidden': 'Hidden Gems',
        'nav.about': 'About Us',
        'nav.search_placeholder': 'Search tours...',
        'nav.menu': 'Menu',
        'nav.search': 'Search',

        // Hero
        'hero.title': 'Rome, Curated.',
        'hero.subtitle': 'Experience the Eternal City with expert local guides.',
        'hero.cta': 'Explore Tours',
        'hero.trust': 'Trusted by 50,000+ travelers',

        // Categories
        'cat.colosseum_title': 'Colosseum & Ancient Rome',
        'cat.colosseum_subtitle': 'Walk in the footsteps of Gladiators. Arena, Underground, and Forum.',
        'cat.vatican_title': 'Vatican Museums & St. Peter\'s',
        'cat.vatican_subtitle': 'Skip the line to the Sistine Chapel, Gardens, and the Dome.',
        'cat.city_title': 'Rome City Tours',
        'cat.city_subtitle': 'Explore the Pantheon, Trevi Fountain, Spanish Steps and iconic squares.',
        'cat.hidden_title': 'Italy Hidden Gems',
        'cat.hidden_subtitle': 'Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences.',
        'cat.view_all': 'View All',

        // Footer
        'footer.about': 'Your gateway to the Eternal City. Experience Rome with our expert guides, skip-the-line access, and unforgettable customized journeys.',
        'footer.explore': 'Explore',
        'footer.support': 'Support',
        'footer.contact': 'Contact',
        'footer.colosseum': 'Colosseum Tours',
        'footer.vatican': 'Vatican Museums',
        'footer.city': 'City Tours',
        'footer.hidden': 'Hidden Gems',
        'footer.blog': 'Travel Blog',
        'footer.all_tours': 'All Tours',
        'footer.contact_us': 'Contact Us',
        'footer.faq': 'FAQ',
        'footer.terms': 'Terms & Conditions',
        'footer.privacy': 'Privacy Policy',
        'footer.cancellation': 'Cancellation Policy',
        'footer.disclaimer': 'Disclaimer',
        'footer.partner': 'Become a Partner',
        'footer.address': 'Via Tunisi 43, Rome, Italy',
        'footer.rights': 'All rights reserved.',

        // Contact Page
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Have questions? Our local team is here to help.',
        'contact.form.name': 'First Name',
        'contact.form.email': 'Email Address',
        'contact.form.message': 'Message',
        'contact.form.send': 'Send Message',
        'contact.form.sending': 'Sending...',
        'contact.success': 'Thank you! We will get back to you soon.',
        'contact.error': 'Something went wrong. Please try again.',

        // Tour Page
        'tour.overview': 'Tour Overview',
        'tour.highlights': 'Highlights',
        'tour.itinerary': 'Itinerary',
        'tour.includes': 'What\'s Included',
        'tour.excludes': 'What\'s Not Included',
        'tour.meeting': 'Meeting Point',
        'tour.important': 'Important Information',
        'tour.book_now': 'Book Now',
        'tour.from': 'From',
        'tour.per_person': 'per person',
        'tour.select_date': 'Select Date',
        'tour.guests': 'Guests',
        'tour.duration': 'Duration',
        'tour.group_size': 'Group Size',
        'tour.reviews': 'reviews',
        'tour.not_available': 'Not Available',

        // Booking
        'booking.select_time': 'Select Time',
        'booking.checkout': 'Proceed to Checkout',
        'booking.total': 'Total',
        'booking.processing': 'Processing...',
        'booking.addons_title': 'Enhance Your Experience',
        'booking.addons_subtitle': 'Optional add-ons to make your tour even better',

        // Common
        'common.loading': 'Loading...',
        'common.read_more': 'Read More',
        'common.learn_more': 'Learn More',
        'common.next': 'Next',
        'common.prev': 'Previous',
        'common.close': 'Close',
        'common.open': 'Open',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.translated_by_google': 'Translated by Google',
    },
    it: {
        // Navigation
        'nav.colosseum': 'Tour del Colosseo',
        'nav.vatican': 'Tour del Vaticano',
        'nav.city': 'Tour della Città',
        'nav.hidden': 'Gemme Nascoste',
        'nav.about': 'Chi Siamo',
        'nav.search_placeholder': 'Cerca tour...',
        'nav.menu': 'Menu',
        'nav.search': 'Cerca',

        // Hero
        'hero.title': 'Roma, Curata.',
        'hero.subtitle': 'Vivi la Città Eterna con guide locali esperte.',
        'hero.cta': 'Esplora i Tour',
        'hero.trust': 'Scelto da oltre 50.000 viaggiatori',

        // Categories
        'cat.colosseum_title': 'Colosseo e Roma Antica',
        'cat.colosseum_subtitle': 'Cammina sulle orme dei gladiatori. Arena, Sotterranei e Foro.',
        'cat.vatican_title': 'Musei Vaticani e San Pietro',
        'cat.vatican_subtitle': 'Salta la fila per la Cappella Sistina, i Giardini e la Cupola.',
        'cat.city_title': 'Tour di Roma',
        'cat.city_subtitle': 'Esplora il Pantheon, Fontana di Trevi, Piazza di Spagna e le piazze iconiche.',
        'cat.hidden_title': 'Gioielli Nascosti d\'Italia',
        'cat.hidden_subtitle': 'Catacombe, tour in Golf Cart, gite fuori porta, tour enogastronomici.',
        'cat.view_all': 'Vedi Tutti',

        // Footer
        'footer.about': 'La tua porta d\'accesso alla Città Eterna. Vivi Roma con le nostre guide esperte, accesso salta-fila e viaggi indimenticabili.',
        'footer.explore': 'Esplora',
        'footer.support': 'Supporto',
        'footer.contact': 'Contatti',
        'footer.colosseum': 'Tour del Colosseo',
        'footer.vatican': 'Musei Vaticani',
        'footer.city': 'Tour della Città',
        'footer.hidden': 'Gemme Nascoste',
        'footer.blog': 'Blog di Viaggio',
        'footer.all_tours': 'Tutti i Tour',
        'footer.contact_us': 'Contattaci',
        'footer.faq': 'FAQ',
        'footer.terms': 'Termini e Condizioni',
        'footer.privacy': 'Privacy Policy',
        'footer.cancellation': 'Politica di Cancellazione',
        'footer.disclaimer': 'Disclaimer',
        'footer.partner': 'Diventa Partner',
        'footer.address': 'Via Tunisi 43, Roma, Italia',
        'footer.rights': 'Tutti i diritti riservati.',

        // Contact Page
        'contact.title': 'Contattaci',
        'contact.subtitle': 'Hai domande? Il nostro team locale è qui per aiutarti.',
        'contact.form.name': 'Nome',
        'contact.form.email': 'Indirizzo Email',
        'contact.form.message': 'Messaggio',
        'contact.form.send': 'Invia Messaggio',
        'contact.form.sending': 'Invio in corso...',
        'contact.success': 'Grazie! Ti risponderemo presto.',
        'contact.error': 'Qualcosa è andato storto. Riprova.',

        // Tour Page
        'tour.overview': 'Panoramica del Tour',
        'tour.highlights': 'Highlights',
        'tour.itinerary': 'Itinerario',
        'tour.includes': 'Cosa è Incluso',
        'tour.excludes': 'Cosa non è Incluso',
        'tour.meeting': 'Punto di Incontro',
        'tour.important': 'Informazioni Importanti',
        'tour.book_now': 'Prenota Ora',
        'tour.from': 'Da',
        'tour.per_person': 'a persona',
        'tour.select_date': 'Seleziona Data',
        'tour.guests': 'Ospiti',
        'tour.duration': 'Durata',
        'tour.group_size': 'Dimensione Gruppo',
        'tour.reviews': 'recensioni',
        'tour.not_available': 'Non Disponibile',

        // Booking
        'booking.select_time': 'Seleziona Orario',
        'booking.checkout': 'Procedi al Pagamento',
        'booking.total': 'Totale',
        'booking.processing': 'Elaborazione...',
        'booking.addons_title': 'Migliora la tua Esperienza',
        'booking.addons_subtitle': 'Optional per rendere il tuo tour ancora migliore',

        // Common
        'common.loading': 'Caricamento...',
        'common.read_more': 'Leggi di più',
        'common.learn_more': 'Scopri di più',
        'common.next': 'Successivo',
        'common.prev': 'Precedente',
        'common.close': 'Chiudi',
        'common.open': 'Apri',
        'common.yes': 'Sì',
        'common.no': 'No',
        'common.translated_by_google': 'Tradotto da Google',
    },
    es: {
        // Navigation
        'nav.colosseum': 'Tours del Coliseo',
        'nav.vatican': 'Tours del Vaticano',
        'nav.city': 'Tours por la Ciudad',
        'nav.hidden': 'Joyas Ocultas',
        'nav.about': 'Sobre Nosotros',
        'nav.search_placeholder': 'Buscar tours...',
        'nav.menu': 'Menú',
        'nav.search': 'Buscar',

        // Hero
        'hero.title': 'Roma, Curada.',
        'hero.subtitle': 'Experimenta la Ciudad Eterna con guías locales expertos.',
        'hero.cta': 'Explorar Tours',
        'hero.trust': 'Elegido por más de 50,000 viajeros',

        // Categories
        'cat.colosseum_title': 'Coliseo y Roma Antigua',
        'cat.colosseum_subtitle': 'Camina sobre los pasos de los gladiadores. Arena, Subterráneo y Foro.',
        'cat.vatican_title': 'Museos Vaticanos y San Pedro',
        'cat.vatican_subtitle': 'Salta la fila para la Capilla Sixtina, Jardines y la Cúpula.',
        'cat.city_title': 'Tours por Roma',
        'cat.city_subtitle': 'Explora el Panteón, Fontana di Trevi, Plaza de España y plazas icónicas.',
        'cat.hidden_title': 'Joyas Ocultas de Italia',
        'cat.hidden_subtitle': 'Catacumbas, tours en Golf Cart, excursiones, tours gastronómicos.',
        'cat.view_all': 'Ver Todos',

        // Footer
        'footer.about': 'Tu puerta de entrada a la Ciudad Eterna. Experimenta Roma con nuestros guías expertos.',
        'footer.explore': 'Explorar',
        'footer.support': 'Soporte',
        'footer.contact': 'Contacto',
        'footer.colosseum': 'Tours del Coliseo',
        'footer.vatican': 'Museos Vaticanos',
        'footer.city': 'Tours por la Ciudad',
        'footer.hidden': 'Joyas Ocultas',
        'footer.blog': 'Blog de Viaje',
        'footer.all_tours': 'Todos los Tours',
        'footer.contact_us': 'Contáctanos',
        'footer.faq': 'Preguntas Frecuentes',
        'footer.terms': 'Términos y Condiciones',
        'footer.privacy': 'Política de Privacidad',
        'footer.cancellation': 'Política de Cancelación',
        'footer.disclaimer': 'Aviso Legal',
        'footer.partner': 'Conviértete en Partner',
        'footer.address': 'Via Tunisi 43, Roma, Italia',
        'footer.rights': 'Todos los derechos reservados.',

        // Contact Page
        'contact.title': 'Contáctanos',
        'contact.subtitle': '¿Tienes preguntas? Nuestro equipo local está aquí para ayudarte.',
        'contact.form.name': 'Nombre',
        'contact.form.email': 'Correo Electrónico',
        'contact.form.message': 'Mensaje',
        'contact.form.send': 'Enviar Mensaje',
        'contact.form.sending': 'Enviando...',
        'contact.success': '¡Gracias! Te responderemos pronto.',
        'contact.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',

        // Tour Page
        'tour.overview': 'Descripción del Tour',
        'tour.highlights': 'Puntos Destacados',
        'tour.itinerary': 'Itinerario',
        'tour.includes': 'Qué está Incluido',
        'tour.excludes': 'Qué no está Incluido',
        'tour.meeting': 'Punto de Encuentro',
        'tour.important': 'Información Importante',
        'tour.book_now': 'Reservar Ahora',
        'tour.from': 'Desde',
        'tour.per_person': 'por persona',
        'tour.select_date': 'Seleccionar Fecha',
        'tour.guests': 'Huéspedes',
        'tour.duration': 'Duración',
        'tour.group_size': 'Tamaño del Grupo',
        'tour.reviews': 'reseñas',
        'tour.not_available': 'No Disponible',

        // Booking
        'booking.select_time': 'Seleccionar Hora',
        'booking.checkout': 'Proceder al Pago',
        'booking.total': 'Total',
        'booking.processing': 'Procesando...',
        'booking.addons_title': 'Mejora tu Experiencia',
        'booking.addons_subtitle': 'Complementos opcionales para mejorar tu tour',

        // Common
        'common.loading': 'Cargando...',
        'common.read_more': 'Leer más',
        'common.learn_more': 'Más información',
        'common.next': 'Siguiente',
        'common.prev': 'Anterior',
        'common.close': 'Cerrar',
        'common.open': 'Abrir',
        'common.yes': 'Sí',
        'common.no': 'No',
        'common.translated_by_google': 'Traducido por Google',
    },
    fr: {
        // Navigation
        'nav.colosseum': 'Visites du Colisée',
        'nav.vatican': 'Visites du Vatican',
        'nav.city': 'Visites de la Ville',
        'nav.hidden': 'Trésors Cachés',
        'nav.about': 'À Propos',
        'nav.search_placeholder': 'Rechercher...',
        'nav.menu': 'Menu',
        'nav.search': 'Rechercher',

        // Hero
        'hero.title': 'Rome, Soignée.',
        'hero.subtitle': 'Découvrez la Ville Éternelle avec des guides locaux experts.',
        'hero.cta': 'Explorer les Visites',
        'hero.trust': 'Choisi par plus de 50 000 voyageurs',

        // Categories
        'cat.colosseum_title': 'Colisée et Rome Antique',
        'cat.colosseum_subtitle': 'Marchez sur les traces des gladiateurs. Arène, Souterrains et Forum.',
        'cat.vatican_title': 'Musées du Vatican et Saint-Pierre',
        'cat.vatican_subtitle': 'Coupe-file pour la Chapelle Sixtine, les Jardins et le Dôme.',
        'cat.city_title': 'Visites de Rome',
        'cat.city_subtitle': 'Explorez le Panthéon, la Fontaine de Trevi, la Place d\'Espagne.',
        'cat.hidden_title': 'Trésors Cachés d\'Italie',
        'cat.hidden_subtitle': 'Catacombes, tours en Golf Cart, excursions, tours gastronomiques.',
        'cat.view_all': 'Voir Tout',

        // Footer
        'footer.about': 'Votre porte d\'entrée vers la Ville Éternelle. Découvrez Rome avec nos guides experts.',
        'footer.explore': 'Explorer',
        'footer.support': 'Support',
        'footer.contact': 'Contact',
        'footer.colosseum': 'Visites du Colisée',
        'footer.vatican': 'Musées du Vatican',
        'footer.city': 'Visites de la Ville',
        'footer.hidden': 'Trésors Cachés',
        'footer.blog': 'Blog Voyage',
        'footer.all_tours': 'Tous les Tours',
        'footer.contact_us': 'Contactez-nous',
        'footer.faq': 'FAQ',
        'footer.terms': 'Conditions Générales',
        'footer.privacy': 'Politique de Confidentialité',
        'footer.cancellation': 'Politique d\'Annulation',
        'footer.disclaimer': 'Mentions Légales',
        'footer.partner': 'Devenir Partenaire',
        'footer.address': 'Via Tunisi 43, Rome, Italie',
        'footer.rights': 'Tous droits réservés.',

        // Contact Page
        'contact.title': 'Contactez-nous',
        'contact.subtitle': 'Des questions ? Notre équipe locale est là pour vous aider.',
        'contact.form.name': 'Prénom',
        'contact.form.email': 'Adresse E-mail',
        'contact.form.message': 'Message',
        'contact.form.send': 'Envoyer le message',
        'contact.form.sending': 'Envoi en cours...',
        'contact.success': 'Merci ! Nous vous répondrons bientôt.',
        'contact.error': 'Une erreur s\'est produite. Veuillez réessayer.',

        // Tour Page
        'tour.overview': 'Aperçu de la Visite',
        'tour.highlights': 'Points Forts',
        'tour.itinerary': 'Itinéraire',
        'tour.includes': 'Ce qui est Inclus',
        'tour.excludes': 'Ce qui n\'est pas Inclus',
        'tour.meeting': 'Point de Rendez-vous',
        'tour.important': 'Informations Importantes',
        'tour.book_now': 'Réserver Maintenant',
        'tour.from': 'À partir de',
        'tour.per_person': 'par personne',
        'tour.select_date': 'Sélectionner une Date',
        'tour.guests': 'Invités',
        'tour.duration': 'Durée',
        'tour.group_size': 'Taille du Groupe',
        'tour.reviews': 'avis',
        'tour.not_available': 'Non Disponible',

        // Booking
        'booking.select_time': 'Sélectionner l\'Heure',
        'booking.checkout': 'Procéder au Paiement',
        'booking.total': 'Total',
        'booking.processing': 'Traitement...',
        'booking.addons_title': 'Améliorez Votre Expérience',
        'booking.addons_subtitle': 'Options supplémentaires pour améliorer votre visite',

        // Common
        'common.loading': 'Chargement...',
        'common.read_more': 'Lire la suite',
        'common.learn_more': 'En savoir plus',
        'common.next': 'Suivant',
        'common.prev': 'Précédent',
        'common.close': 'Fermer',
        'common.open': 'Ouvrir',
        'common.yes': 'Oui',
        'common.no': 'Non',
        'common.translated_by_google': 'Traduit par Google',
    },
    de: {
        // Navigation
        'nav.colosseum': 'Kolosseum Touren',
        'nav.vatican': 'Vatikan Touren',
        'nav.city': 'Stadttouren',
        'nav.hidden': 'Versteckte Schätze',
        'nav.about': 'Über Uns',
        'nav.search_placeholder': 'Touren suchen...',
        'nav.menu': 'Menü',
        'nav.search': 'Suchen',

        // Hero
        'hero.title': 'Rom, Kuratiert.',
        'hero.subtitle': 'Erleben Sie die Ewige Stadt mit erfahrenen lokalen Guides.',
        'hero.cta': 'Touren Entdecken',
        'hero.trust': 'Von über 50.000 Reisenden gewählt',

        // Categories
        'cat.colosseum_title': 'Kolosseum & Antikes Rom',
        'cat.colosseum_subtitle': 'Gehen Sie auf den Spuren der Gladiatoren. Arena, Untergeschoss und Forum.',
        'cat.vatican_title': 'Vatikanische Museen & St. Peter',
        'cat.vatican_subtitle': 'Skip-the-line für die Sixtinische Kapelle, Gärten und Kuppel.',
        'cat.city_title': 'Rom Stadttouren',
        'cat.city_subtitle': 'Erkunden Sie das Pantheon, Trevi-Brunnen, Spanische Treppe.',
        'cat.hidden_title': 'Versteckte Schätze Italiens',
        'cat.hidden_subtitle': 'Katakomben, Golf Cart Touren, Tagesausflüge, Food Tours.',
        'cat.view_all': 'Alle Ansehen',

        // Footer
        'footer.about': 'Ihr Tor zur Ewigen Stadt. Erleben Sie Rom mit unseren erfahrenen Guides.',
        'footer.explore': 'Entdecken',
        'footer.support': 'Support',
        'footer.contact': 'Kontakt',
        'footer.colosseum': 'Kolosseum Touren',
        'footer.vatican': 'Vatikanische Museen',
        'footer.city': 'Stadttouren',
        'footer.hidden': 'Versteckte Schätze',
        'footer.blog': 'Reiseblog',
        'footer.all_tours': 'Alle Touren',
        'footer.contact_us': 'Kontaktiere Uns',
        'footer.faq': 'FAQ',
        'footer.terms': 'AGB',
        'footer.privacy': 'Datenschutz',
        'footer.cancellation': 'Stornierungsbedingungen',
        'footer.disclaimer': 'Impressum',
        'footer.partner': 'Partner Werden',
        'footer.address': 'Via Tunisi 43, Rom, Italien',
        'footer.rights': 'Alle Rechte vorbehalten.',

        // Contact Page
        'contact.title': 'Kontaktiere Uns',
        'contact.subtitle': 'Haben Sie Fragen? Unser lokales Team hilft Ihnen gerne.',
        'contact.form.name': 'Vorname',
        'contact.form.email': 'E-Mail Adresse',
        'contact.form.message': 'Nachricht',
        'contact.form.send': 'Nachricht Senden',
        'contact.form.sending': 'Wird gesendet...',
        'contact.success': 'Danke! Wir melden uns bald bei Ihnen.',
        'contact.error': 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',

        // Tour Page
        'tour.overview': 'Tour Übersicht',
        'tour.highlights': 'Höhepunkte',
        'tour.itinerary': 'Reiseroute',
        'tour.includes': 'Inklusive',
        'tour.excludes': 'Nicht Inklusive',
        'tour.meeting': 'Treffpunkt',
        'tour.important': 'Wichtige Informationen',
        'tour.book_now': 'Jetzt Buchen',
        'tour.from': 'Ab',
        'tour.per_person': 'pro Person',
        'tour.select_date': 'Datum Wählen',
        'tour.guests': 'Gäste',
        'tour.duration': 'Dauer',
        'tour.group_size': 'Gruppengröße',
        'tour.reviews': 'Bewertungen',
        'tour.not_available': 'Nicht Verfügbar',

        // Booking
        'booking.select_time': 'Uhrzeit Wählen',
        'booking.checkout': 'Zur Kasse',
        'booking.total': 'Gesamt',
        'booking.processing': 'Wird verarbeitet...',
        'booking.addons_title': 'Verbessern Sie Ihr Erlebnis',
        'booking.addons_subtitle': 'Optionale Zusätze für ein besseres Tour-Erlebnis',

        // Common
        'common.loading': 'Laden...',
        'common.read_more': 'Mehr Lesen',
        'common.learn_more': 'Mehr Erfahren',
        'common.next': 'Weiter',
        'common.prev': 'Zurück',
        'common.close': 'Schließen',
        'common.open': 'Öffnen',
        'common.yes': 'Ja',
        'common.no': 'Nein',
        'common.translated_by_google': 'Übersetzt von Google',
    },
    pt: {
        // Navigation
        'nav.colosseum': 'Passeios no Coliseu',
        'nav.vatican': 'Passeios no Vaticano',
        'nav.city': 'Passeios pela Cidade',
        'nav.hidden': 'Joias Escondidas',
        'nav.about': 'Sobre Nós',
        'nav.search_placeholder': 'Pesquisar tours...',
        'nav.menu': 'Menu',
        'nav.search': 'Pesquisar',

        // Hero
        'hero.title': 'Roma, Curadoria.',
        'hero.subtitle': 'Experimente a Cidade Eterna com guias locais especializados.',
        'hero.cta': 'Explorar Tours',
        'hero.trust': 'Confiado por mais de 50.000 viajantes',

        // Categories
        'cat.colosseum_title': 'Coliseu e Roma Antiga',
        'cat.colosseum_subtitle': 'Caminhe nos passos dos gladiadores. Arena, Subterrâneo e Fórum.',
        'cat.vatican_title': 'Museus do Vaticano e São Pedro',
        'cat.vatican_subtitle': 'Pule a fila para a Capela Sistina, Jardins e a Cúpula.',
        'cat.city_title': 'Passeios por Roma',
        'cat.city_subtitle': 'Explore o Panteão, Fontana di Trevi, Praça da Espanha e praças icônicas.',
        'cat.hidden_title': 'Joias Escondidas da Itália',
        'cat.hidden_subtitle': 'Catacumbas, passeios de Golf Cart, passeios gastronômicos.',
        'cat.view_all': 'Ver Todos',

        // Footer
        'footer.about': 'Sua porta de entrada para a Cidade Eterna. Experimente Roma com nossos guias especialistas, acesso sem filas e viagens personalizadas inesquecíveis.',
        'footer.explore': 'Explorar',
        'footer.support': 'Suporte',
        'footer.contact': 'Contato',
        'footer.colosseum': 'Passeios no Coliseu',
        'footer.vatican': 'Museus do Vaticano',
        'footer.city': 'Passeios pela Cidade',
        'footer.hidden': 'Joias Escondidas',
        'footer.blog': 'Blog de Viagens',
        'footer.all_tours': 'Todos os Tours',
        'footer.contact_us': 'Fale Conosco',
        'footer.faq': 'Perguntas Frequentes',
        'footer.terms': 'Termos e Condições',
        'footer.privacy': 'Política de Privacidade',
        'footer.cancellation': 'Política de Cancelamento',
        'footer.disclaimer': 'Aviso Legal',
        'footer.partner': 'Torne-se um Parceiro',
        'footer.address': 'Via Tunisi 43, Roma, Itália',
        'footer.rights': 'Todos os direitos reservados.',

        // Contact Page
        'contact.title': 'Fale Conosco',
        'contact.subtitle': 'Tem perguntas? Nossa equipe local está aqui para ajudar.',
        'contact.form.name': 'Nome',
        'contact.form.email': 'E-mail',
        'contact.form.message': 'Mensagem',
        'contact.form.send': 'Enviar Mensagem',
        'contact.form.sending': 'Enviando...',
        'contact.success': 'Obrigado! Entraremos em contato em breve.',
        'contact.error': 'Algo deu errado. Por favor, tente novamente.',

        // Tour Page
        'tour.overview': 'Visão Geral do Tour',
        'tour.highlights': 'Destaques',
        'tour.itinerary': 'Itinerário',
        'tour.includes': 'O que está incluído',
        'tour.excludes': 'O que não está incluído',
        'tour.meeting': 'Ponto de Encontro',
        'tour.important': 'Informações Importantes',
        'tour.book_now': 'Reserve Agora',
        'tour.from': 'A partir de',
        'tour.per_person': 'por pessoa',
        'tour.select_date': 'Selecionar Data',
        'tour.guests': 'Hóspedes',
        'tour.duration': 'Duração',
        'tour.group_size': 'Tamanho do Grupo',
        'tour.reviews': 'avaliações',
        'tour.not_available': 'Não Disponível',

        // Booking
        'booking.select_time': 'Selecionar Horário',
        'booking.checkout': 'Finalizar Compra',
        'booking.total': 'Total',
        'booking.processing': 'Processando...',
        'booking.addons_title': 'Melhore sua Experiência',
        'booking.addons_subtitle': 'Adicionais opcionais para tornar seu tour ainda melhor',

        // Common
        'common.loading': 'Carregando...',
        'common.read_more': 'Leia mais',
        'common.learn_more': 'Saiba mais',
        'common.next': 'Próximo',
        'common.prev': 'Anterior',
        'common.close': 'Fechar',
        'common.open': 'Abrir',
        'common.yes': 'Sim',
        'common.no': 'Não',
        'common.translated_by_google': 'Traduzido pelo Google',
    },
    ru: {
        // Navigation
        'nav.colosseum': 'Экскурсии в Колизей',
        'nav.vatican': 'Экскурсии в Ватикан',
        'nav.city': 'Экскурсии по городу',
        'nav.hidden': 'Скрытые жемчужины',
        'nav.about': 'О нас',
        'nav.search_placeholder': 'Поиск туров...',
        'nav.menu': 'Меню',
        'nav.search': 'Поиск',

        // Hero
        'hero.title': 'Рим, курируемый.',
        'hero.subtitle': 'Познакомьтесь с Вечным городом с опытными местными гидами.',
        'hero.cta': 'Исследовать туры',
        'hero.trust': 'Доверяют более 50 000 путешественников',

        // Categories
        'cat.colosseum_title': 'Колизей и Древний Рим',
        'cat.colosseum_subtitle': 'Пройдите по стопам гладиаторов. Арена, Подземелье и Форум.',
        'cat.vatican_title': 'Музеи Ватикана и Собор Св. Петра',
        'cat.vatican_subtitle': 'Проход без очереди в Сикстинскую капеллу, Сады и Купол.',
        'cat.city_title': 'Экскурсии по Риму',
        'cat.city_subtitle': 'Исследуйте Пантеон, фонтан Треви, Испанскую лестницу и знаковые площади.',
        'cat.hidden_title': 'Скрытые жемчужины Италии',
        'cat.hidden_subtitle': 'Катакомбы, туры на гольф-карах, гастрономические туры.',
        'cat.view_all': 'Посмотреть все',

        // Footer
        'footer.about': 'Ваш вход в Вечный город. Познакомьтесь с Римом с нашими экспертными гидами, проходом без очереди и незабываемыми индивидуальными поездками.',
        'footer.explore': 'Исследовать',
        'footer.support': 'Поддержка',
        'footer.contact': 'Контакт',
        'footer.colosseum': 'Экскурсии в Колизей',
        'footer.vatican': 'Музеи Ватикана',
        'footer.city': 'Экскурсии по городу',
        'footer.hidden': 'Скрытые жемчужины',
        'footer.blog': 'Трэвел-блог',
        'footer.all_tours': 'Все туры',
        'footer.contact_us': 'Связаться с нами',
        'footer.faq': 'Часто задаваемые вопросы',
        'footer.terms': 'Условия и положения',
        'footer.privacy': 'Политика конфиденциальности',
        'footer.cancellation': 'Условия отмены',
        'footer.disclaimer': 'Отказ от ответственности',
        'footer.partner': 'Стать партнером',
        'footer.address': 'Via Tunisi 43, Рим, Италия',
        'footer.rights': 'Все права защищены.',

        // Contact Page
        'contact.title': 'Связаться с нами',
        'contact.subtitle': 'Есть вопросы? Наша местная команда готова помочь.',
        'contact.form.name': 'Имя',
        'contact.form.email': 'Электронная почта',
        'contact.form.message': 'Сообщение',
        'contact.form.send': 'Отправить сообщение',
        'contact.form.sending': 'Отправка...',
        'contact.success': 'Спасибо! Мы свяжемся с вами в ближайшее время.',
        'contact.error': 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',

        // Tour Page
        'tour.overview': 'Обзор тура',
        'tour.highlights': 'Основные моменты',
        'tour.itinerary': 'Маршрут',
        'tour.includes': 'Что включено',
        'tour.excludes': 'Что не включено',
        'tour.meeting': 'Место встречи',
        'tour.important': 'Важная информация',
        'tour.book_now': 'Забронировать сейчас',
        'tour.from': 'От',
        'tour.per_person': 'с человека',
        'tour.select_date': 'Выбрать дату',
        'tour.guests': 'Гости',
        'tour.duration': 'Длительность',
        'tour.group_size': 'Размер группы',
        'tour.reviews': 'отзывов',
        'tour.not_available': 'Недоступно',

        // Booking
        'booking.select_time': 'Выбрать время',
        'booking.checkout': 'Оформить заказ',
        'booking.total': 'Итого',
        'booking.processing': 'Обработка...',
        'booking.addons_title': 'Улучшите свой опыт',
        'booking.addons_subtitle': 'Дополнительные услуги, чтобы сделать ваш тур еще лучше',

        // Common
        'common.loading': 'Загрузка...',
        'common.read_more': 'Подробнее',
        'common.learn_more': 'Узнать больше',
        'common.next': 'Далее',
        'common.prev': 'Назад',
        'common.close': 'Закрыть',
        'common.open': 'Открыть',
        'common.yes': 'Да',
        'common.no': 'Нет',
        'common.translated_by_google': 'Переведено Google',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(`{process.env.NEXT_PUBLIC_SITE_ID || 'agency'}-lang`) as Language;
        if (saved && ['en', 'it', 'es', 'fr', 'de', 'pt', 'ru'].includes(saved)) {
            setLanguageState(saved);
        }
        setIsHydrated(true);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(`{process.env.NEXT_PUBLIC_SITE_ID || 'agency'}-lang`, lang);
        document.documentElement.lang = lang;
    }, []);

    // Memoized translation lookup — only recomputes when language changes
    const currentTranslations = useMemo(() => translations[language], [language]);

    const t = useCallback((key: string): string => {
        return currentTranslations?.[key] || translations.en[key] || key;
    }, [currentTranslations]);

    const translateTour = useCallback((tour: any): TranslatedTour => {
        if (!tour) return tour;

        const lang = language;

        if (lang === 'en' || !tour.translations) {
            return tour as TranslatedTour;
        }

        const trans = tour.translations[lang];

        return {
            ...tour,
            title: trans?.title || tour.title,
            description: trans?.description || tour.description,
            highlights: trans?.highlights || tour.highlights || [],
            includes: trans?.includes || tour.includes || [],
            excludes: trans?.excludes || tour.excludes || [],
            meetingPoint: trans?.meetingPoint || tour.meetingPoint,
            importantInfo: trans?.importantInfo || tour.importantInfo || [],
            itinerary: trans?.itinerary || tour.itinerary || [],
            faqs: trans?.faqs || tour.faqs || [],
            seoTitle: trans?.seoTitle || tour.seoTitle,
            seoDescription: trans?.seoDescription || tour.seoDescription,
        };
    }, [language]);

    // Memoize context value so consumers only re-render when language actually changes
    const contextValue = useMemo(() => ({ language, setLanguage, t, translateTour }), [language, t, translateTour]);

    // During hydration, render children with English fallback (avoids full tree unmount)
    if (!isHydrated) {
        return (
            <LanguageContext.Provider value={{ language: 'en', setLanguage: () => {}, t: (k) => translations.en[k] || k, translateTour: (t) => t }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export function useTranslatedTour(tour: any) {
    const { translateTour } = useLanguage();
    return translateTour(tour);
}
