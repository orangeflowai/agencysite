
export const products = [
    {
        title: "Rome City Walking Tour: Pantheon & Historic Squares",
        seoTitle: "Rome City Walking Tour: Pantheon, Trevi Fountain & Piazza Navona | Official Guide",
        seoDescription: "Discover Rome's heart on a 2-hour guided walking tour. Skip-the-line Pantheon entry, Trevi Fountain coin toss, and Piazza Navona. Book now!",
        price: 35,
        duration: "2 hours",
        category: "city",
        tourType: "Walking Tour",
        badge: "Bestseller",
        rating: 4.8,
        reviewCount: 2200,
        highlights: ["Skip-the-line Pantheon entry", "Trevi Fountain Coin Toss", "Piazza Navona & Bernini Fountains", "Small Group Experience"],
        includes: ["Licensed Guide", "Pantheon Entry Ticket", "Headsets (for groups 6+)"],
        excludes: ["Food & Drinks", "Hotel Pickup", "Gratuities"],
        itinerary: [
            { title: "Piazza di Spagna", description: "Meet your guide at the Spanish Steps. Introduction to Rome's history.", duration: "10 min" },
            { title: "Trevi Fountain", description: "Learn the legends of the aqueducts and toss a coin to ensure your return to Rome.", duration: "20 min" },
            { title: "Pantheon", description: "Skip the line and explore the massive dome, oculus, and Raphael's Tomb.", duration: "40 min" },
            { title: "Piazza Navona", description: "Admire Bernini's Fountain of the Four Rivers and the vibrant street life.", duration: "20 min" }
        ],
        meetingPoint: "Piazza di Spagna (Spanish Steps), at the bottom of the steps near the fountain.",
        importantInfo: ["Wear comfortable shoes", "Shoulders and knees must be covered for Pantheon entry"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Discover the heart of Rome on this immersive 2-hour walking tour. Begin in " },
                    { _type: 'span', text: "Piazza di Spagna", marks: ['strong'] },
                    { _type: 'span', text: ", then stroll to the " },
                    { _type: 'span', text: "Trevi Fountain", marks: ['strong'] },
                    { _type: 'span', text: ", the most famous Baroque fountain in the world. Your guide will share legends and stories, from the origins of the coin-tossing tradition to the fascinating artistic symbolism." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Start your journey at the " },
                    { _type: 'span', text: "Pantheon", marks: ['strong'] },
                    { _type: 'span', text: ", the best-preserved building from ancient Rome. With " },
                    { _type: 'span', text: "skip-the-line access", marks: ['strong'] },
                    { _type: 'span', text: ", explore the massive dome and Raphael's tomb." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Continue to Piazza Navona to see Bernini's masterpieces. This tour is the perfect introduction to the Eternal City." }]
            }
        ],
        keywords: ["Rome walking tour", "Pantheon tour", "Trevi Fountain guide", "Piazza Navona"]
    },
    {
        title: "Colosseum Underground & Arena Private Tour",
        seoTitle: "Private Colosseum Underground & Arena Tour | VIP Experience",
        seoDescription: "Exclusive private tour of the Colosseum Underground and Arena Floor. Walk where gladiators fought. Includes Roman Forum & Palatine Hill.",
        price: 100,
        duration: "3.5 hours",
        category: "colosseum",
        tourType: "Private VIP Tour",
        badge: "Exclusive",
        rating: 5.0,
        reviewCount: 450,
        highlights: ["Exclusive Underground Access", "Arena Floor Experience", "Private Guide", "Roman Forum & Palatine Hill"],
        includes: ["Private Licensed Guide", "Colosseum Underground Tickets", "Arena Floor Access", "Forum & Palatine Entry"],
        excludes: ["Food & Drink", "Transport"],
        itinerary: [
            { title: "Colosseum Underground", description: "Descend into the hypogeum where gladiators and animals waited.", duration: "45 min" },
            { title: "Arena Floor", description: "Stand on the reconstructed wooden floor looking up at the tiers.", duration: "30 min" },
            { title: "Roman Forum", description: "Walk through the political heart of Ancient Rome.", duration: "60 min" },
            { title: "Palatine Hill", description: "See the Imperial Palaces and panoramic views.", duration: "45 min" }
        ],
        meetingPoint: "Colosseum Metro Station, ground level exit.",
        importantInfo: ["ID required for entry", "Security check mandatory", "Not wheelchair accessible"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Step behind the scenes of Rome's most famous amphitheater on this " },
                    { _type: 'span', text: "exclusive private tour", marks: ['strong'] },
                    { _type: 'span', text: ". Explore the " },
                    { _type: 'span', text: "Underground Chambers", marks: ['strong'] },
                    { _type: 'span', text: ", where gladiators prepared for battle." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Walk onto the " },
                    { _type: 'span', text: "Arena Floor", marks: ['strong'] },
                    { _type: 'span', text: " and imagine the roar of 50,000 spectators. Your private guide will reveal the secrets of the games, the elevators, and the trapdoors." }
                ]
            }
        ],
        keywords: ["Colosseum underground", "Private Colosseum tour", "Arena floor tickets"]
    },
    {
        title: "Castel Sant’Angelo Guided Tour",
        seoTitle: "Castel Sant’Angelo Tour: Emperors, Popes & Rooftop Views",
        seoDescription: "Explore Castel Sant'Angelo with a licensed guide. Visit Papal apartments, secret passages, and enjoy panoramic rooftop views.",
        price: 55,
        duration: "2 hours",
        category: "city",
        tourType: "Guided Tour",
        badge: "Must See",
        rating: 4.7,
        reviewCount: 890,
        highlights: ["Skip-the-line Entry", "Papal Apartments", "Rooftop Panoramic View", "Hadrian's Mausoleum"],
        includes: ["Entrance Ticket", "Licensed Guide", "Small Group"],
        excludes: ["Hotel Pickup", "Food"],
        itinerary: [
            { title: "Mausoleum of Hadrian", description: "Walk the ancient spiral ramp.", duration: "20 min" },
            { title: "Papal Apartments", description: "See the frescoed rooms used by Popes.", duration: "40 min" },
            { title: "Rooftop Terrace", description: "Enjoy the best view of St. Peter's Basilica.", duration: "30 min" }
        ],
        meetingPoint: "Main entrance of Castel Sant'Angelo.",
        importantInfo: ["Some stairs involved"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Discover Rome's most dramatic fortress. Originally " },
                    { _type: 'span', text: "Emperor Hadrian's Mausoleum", marks: ['strong'] },
                    { _type: 'span', text: ", it became a fortress, a prison, and a papal residence." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Visit the " },
                    { _type: 'span', text: "Passetto di Borgo", marks: ['strong'] },
                    { _type: 'span', text: ", the secret corridor used by Popes to flee from the Vatican. End with a stunning view from the terrace." }
                ]
            }
        ],
        keywords: ["Castel Sant'Angelo tour", "Rome fortress", "Hadrian's tomb"]
    },
    {
        title: "Vatican Gardens & Museums Guided Tour – VIP Religious Experience",
        seoTitle: "Vatican Gardens & Museums VIP Tour | Official Guide",
        seoDescription: "Exclusive access to the Vatican Gardens followed by the Museums and Sistine Chapel. A peaceful, VIP religious experience.",
        price: 115,
        duration: "4 hours",
        category: "vatican",
        tourType: "VIP Tour",
        badge: "VIP",
        rating: 5.0,
        reviewCount: 150,
        highlights: ["Exclusive Garden Access", "Sistine Chapel", "No Crowds", "Raphael Rooms"],
        includes: ["Vatican Gardens Entry", "Museum Tickets", "Expert Guide"],
        excludes: ["Lunch", "Transport"],
        itinerary: [
            { title: "Vatican Gardens", description: "Walk through the lush private gardens of the Pope.", duration: "1.5 hours" },
            { title: "Vatican Museums", description: "Skip the line to the Gallery of Maps and Tapestries.", duration: "1.5 hours" },
            { title: "Sistine Chapel", description: "Quiet reflection under Michelangelo's ceiling.", duration: "30 min" }
        ],
        meetingPoint: "Vatican Museums Entrance (Viale Vaticano).",
        importantInfo: ["Strict dress code: Shoulders and knees covered", "Airport-style security"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Discover the hidden heart of Vatican City with this exclusive VIP experience. Walk through the private Vatican Gardens, a lush sanctuary usually closed to the public." }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "After the gardens, enjoy skip-the-line access to the Vatican Museums and the Sistine Chapel, exploring masterpieces of art and faith in peace." }]
            }
        ],
        keywords: ["Vatican Gardens tour", "VIP Vatican", "Sistine Chapel tickets"]
    },
    {
        title: "Classic Rome Hop-On/Hop-Off + Colosseum Arena Experience",
        seoTitle: "Rome Hop-On Hop-Off Bus + Colosseum Arena Tour",
        seoDescription: "24h Big Bus ticket plus exclusive Colosseum Arena Floor tour. The flexible way to see Rome.",
        price: 85,
        duration: "24 hours + 1.5 hour tour",
        category: "special",
        tourType: "Bus Combo",
        badge: "Best Value",
        rating: 4.5,
        reviewCount: 3200,
        highlights: ["24h Bus Pass", "Colosseum Arena Floor", "Flexible Sightseeing", "Free Walking Tours"],
        includes: ["Big Bus Ticket", "Colosseum Guide", "Arena Entry"],
        excludes: ["Hotel Pickup"],
        itinerary: [
            { title: "Big Bus Tour", description: "Hop on and off at 8 stops around Rome.", duration: "Flexible" },
            { title: "Colosseum Arena", description: "Scheduled guided tour of the Arena Floor.", duration: "1.5 hours" }
        ],
        meetingPoint: "Bus: Any stop. Colosseum Tour: Stern Entrance.",
        importantInfo: ["Colosseum time is fixed", "Bus ticket valid for 24h"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Combine the freedom of a Hop-On/Hop-Off bus with the exclusivity of the Colosseum Arena Floor." }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Ride the open-top bus to see the Vatican, Spanish Steps, and Piazza Venezia, then meet your guide for a VIP entry into the Colosseum." }]
            }
        ],
        keywords: ["Rome bus tour", "Colosseum arena combo", "Hop on hop off Rome"]
    },
    {
        title: "Colosseum Arena & Roman Forum Tour",
        seoTitle: "Colosseum Arena Floor & Roman Forum Guided Tour",
        seoDescription: "Step onto the Arena Floor where gladiators fought. Includes guided tour of the Roman Forum and Palatine Hill.",
        price: 85,
        duration: "3 hours",
        category: "colosseum",
        tourType: "Guided Tour",
        badge: "Popular",
        rating: 4.8,
        reviewCount: 1800,
        highlights: ["Arena Floor", "Gladiator's Gate", "Roman Forum", "Palatine Hill"],
        includes: ["Arena Tickets", "Licensed Guide", "Headsets"],
        excludes: ["Food"],
        itinerary: [
            { title: "Arena Floor", description: "Enter through the Gladiator's Gate.", duration: "45 min" },
            { title: "Colosseum Tiers", description: "Explore the first and second levels.", duration: "45 min" },
            { title: "Roman Forum", description: "Guided walk through ancient temples.", duration: "1 hour" }
        ],
        meetingPoint: "Colosseum Stern Entrance.",
        importantInfo: ["Wear comfortable shoes", "No large bags"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Experience the Colosseum from the perspective of a gladiator. Walk onto the reconstructed Arena Floor and look up at the massive seating tiers." }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Continue to the Roman Forum and Palatine Hill to see where Rome's Emperors lived and ruled." }]
            }
        ],
        keywords: ["Colosseum arena floor", "Roman Forum guide", "Gladiator tour"]
    },
    {
        title: "Discover Rome Ticket + Colosseum Arena & Roman Forum Tour",
        seoTitle: "Discover Rome: Bus Pass + Colosseum Arena & Forum",
        seoDescription: "The ultimate 1-day pack: 24h Bus, Colosseum Arena Tour, and Roman Forum guide.",
        price: 115,
        duration: "Full Day",
        category: "special",
        tourType: "Combo",
        badge: "All-In-One",
        rating: 4.6,
        reviewCount: 950,
        highlights: ["Bus Tour", "Colosseum Arena", "Forum Guide", "Self-Guided Walks"],
        includes: ["Bus Ticket", "Arena Ticket", "Guide"],
        excludes: ["Lunch"],
        itinerary: [
            { title: "Bus Tour", description: "See the city at your own pace.", duration: "Day" },
            { title: "Colosseum Tour", description: "Guided Arena experience.", duration: "3 hours" }
        ],
        meetingPoint: "Various",
        importantInfo: ["Ideal for first-time visitors"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "See it all in one day. Use the Big Bus to get around, then join our expert guide for the highlight of your trip: The Colosseum Arena." }]
            }
        ],
        keywords: ["Rome one day tour", "Colosseum bus combo"]
    },
    {
        title: "Pantheon Guided Tour",
        seoTitle: "Pantheon Guided Tour: Skip-the-Line | Official",
        seoDescription: "Skip the line at the Pantheon. expert guide explains the Oculus, Raphael's Tomb, and Roman engineering.",
        price: 40,
        duration: "1 hour",
        category: "city",
        tourType: "Walking Tour",
        badge: "Essential",
        rating: 4.8,
        reviewCount: 1500,
        highlights: ["Skip-the-line", "Oculus", "Raphael's Tomb"],
        includes: ["Entry Ticket", "Guide"],
        excludes: [],
        itinerary: [
            { title: "Pantheon Entrance", description: "Skip the long lines.", duration: "10 min" },
            { title: "Interior Tour", description: "Dome, Oculus, and Royal Tombs.", duration: "40 min" }
        ],
        meetingPoint: "Piazza della Rotonda, by the fountain.",
        importantInfo: ["Dress code applies"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "The Pantheon is the best-preserved building from Ancient Rome. Don't just look at it—understand it with an expert guide." }]
            }
        ],
        keywords: ["Pantheon tickets", "Pantheon tour"]
    },
    {
        title: "Vatican & Castel Sant’Angelo Combo Tour",
        seoTitle: "Vatican Museums & Castel Sant'Angelo Combo Tour",
        seoDescription: "Visit the Vatican Museums, Sistine Chapel, and Castel Sant'Angelo in one epic tour.",
        price: 130,
        duration: "5 hours",
        category: "vatican",
        tourType: "Combo",
        badge: "History Buff",
        rating: 4.8,
        reviewCount: 220,
        highlights: ["Sistine Chapel", "St. Peter's Basilica", "Castel Sant'Angelo", "Passetto"],
        includes: ["All Tickets", "Guide"],
        excludes: ["Lunch"],
        itinerary: [
            { title: "Vatican Museums", description: "Raphael Rooms & Sistine Chapel", duration: "2.5 hours" },
            { title: "Castel Sant'Angelo", description: "Fortress and Popes' residence", duration: "2 hours" }
        ],
        meetingPoint: "Vatican Museums Entrance.",
        importantInfo: ["Walking involved"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Follow the path of the Popes. From the artistic splendors of the Vatican to their fortified refuge at Castel Sant'Angelo." }]
            }
        ],
        keywords: ["Vatican Castel combo", "Angels and Demons tour"]
    },
    {
        title: "Big Bus Hop-On/Hop-Off + Pantheon",
        seoTitle: "Rome Bus Tour & Pantheon Skip-the-Line",
        seoDescription: "24h Bus Pass + Guided Pantheon Tour. Detailed audio guide and expert human guide.",
        price: 75,
        duration: "24 hours + 1 hour",
        category: "special",
        tourType: "Bus Combo",
        badge: "Smart Choice",
        rating: 4.5,
        reviewCount: 500,
        highlights: ["Bus Tour", "Pantheon Entry", "Raphael's Tomb"],
        includes: ["Bus Ticket", "Pantheon Ticket", "Guide"],
        excludes: [],
        itinerary: [
            { title: "Bus Loop", description: "See the city.", duration: "Flexible" },
            { title: "Pantheon", description: "Guided interior visit.", duration: "1 hour" }
        ],
        meetingPoint: "Various",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Explore Rome at your own pace with the bus, then dive deep into history at the Pantheon." }]
            }
        ],
        keywords: ["Pantheon bus combo"]
    },
    {
        title: "Palatine Hill Private Sunrise Tour",
        seoTitle: "Palatine Hill Sunrise Tour | Exclusive Early Access",
        seoDescription: "Watch the sunrise over Rome from the Palatine Hill. Private tour, no crowds, pure magic.",
        price: 250,
        duration: "2 hours",
        category: "colosseum",
        tourType: "Private",
        badge: "Romance",
        rating: 5.0,
        reviewCount: 45,
        highlights: ["Sunrise View", "Empty Ruins", "Imperial Palaces"],
        includes: ["Private Guide", "Early Access Ticket"],
        excludes: [],
        itinerary: [
            { title: "Palatine Hill", description: "Enter as the gates open.", duration: "15 min" },
            { title: "Sunrise Viewpoint", description: "Best photo op in Rome.", duration: "30 min" },
            { title: "Imperial Palaces", description: "Explore the House of Augustus.", duration: "1 hour" }
        ],
        meetingPoint: "Colosseum Entrance.",
        importantInfo: ["Early start required"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Experience the birth of Rome in the golden light of dawn. A strictly private, magical experience away from the heat and crowds." }]
            }
        ],
        keywords: ["Rome sunrise tour", "Palatine Hill private"]
    },
    {
        title: "Appian Way & Catacombs Tour",
        seoTitle: "Appian Way & Catacombs Guided Tour",
        seoDescription: "Journey to the ancient Appian Way. Visit the Christian Catacombs and Roman Aqueducts.",
        price: 65,
        duration: "3 hours",
        category: "hidden-gems",
        tourType: "Bus/Walk",
        badge: "Adventure",
        rating: 4.7,
        reviewCount: 600,
        highlights: ["Catacombs", "Aqueducts", "Ancient Road"],
        includes: ["Transport", "Guide", "Entry Tickets"],
        excludes: [],
        itinerary: [
            { title: "Bus Ride", description: "Drive past Circus Maximus and Caracalla Baths.", duration: "30 min" },
            { title: "Catacombs", description: "Underground burial chambers.", duration: "1 hour" },
            { title: "Appian Way", description: "Walk on the original stones.", duration: "45 min" }
        ],
        meetingPoint: "Piazza Venezia (check ticket).",
        importantInfo: ["Not for claustrophobic"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Go beyond the city walls. Discover the engineering of the Aqueducts and the spiritual depth of the Catacombs." }]
            }
        ],
        keywords: ["Catacombs Rome", "Appian Way"]
    },
    {
        title: "Hidden Churches of Rome Walking Tour",
        seoTitle: "Hidden Churches of Rome | Caravaggio & Relics",
        seoDescription: "Off-the-beaten-path tour of Rome's secret churches. See Caravaggio masterpieces and ancient relics.",
        price: 50,
        duration: "2.5 hours",
        category: "hidden-gems",
        tourType: "Art & Culture",
        badge: "Art",
        rating: 4.9,
        reviewCount: 180,
        highlights: ["Caravaggio Paintings", "Hidden Cloisters", "Ancient Mosaics"],
        includes: ["Guide", "Headsets"],
        excludes: [],
        itinerary: [
            { title: "San Luigi dei Francesi", description: "See Caravaggio's St. Matthew cycle.", duration: "30 min" },
            { title: "Santa Maria della Pace", description: "Raphael's Sibyls.", duration: "30 min" },
            { title: "San Clemente", description: "Optional underground visit.", duration: "45 min" }
        ],
        meetingPoint: "Piazza Navona.",
        importantInfo: ["Dress code"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Rome has 900 churches. We take you to the ones tourists miss, but art lovers cherish." }]
            }
        ],
        keywords: ["Rome hidden gems", "Caravaggio tour"]
    },
    {
        title: "Domus Aurea (Nero’s Golden House) Tour",
        seoTitle: "Domus Aurea Tour: Nero's Golden House & VR",
        seoDescription: "Descend into Nero's buried palace. See ancient frescoes and a VR reconstruction of the Golden House.",
        price: 45,
        duration: "1.5 hours",
        category: "hidden-gems",
        tourType: "Archaeology",
        badge: "Staff Pick",
        rating: 4.7,
        reviewCount: 320,
        highlights: ["Underground Palace", "VR Experience", "Nero's Octagonal Room"],
        includes: ["Entry with VR", "Guide", "Helmet"],
        excludes: [],
        itinerary: [
            { title: "Entry", description: "Put on safety helmets.", duration: "15 min" },
            { title: "Guided Walk", description: "Explore the frescoed corridors.", duration: "45 min" },
            { title: "VR Experience", description: "See the palace as it was in 64 AD.", duration: "15 min" }
        ],
        meetingPoint: "Colle Oppio Park.",
        importantInfo: ["Cool temperature underground"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Emperor Nero's megalomaniacal palace was buried for centuries. Now, you can walk through it." }]
            }
        ],
        keywords: ["Domus Aurea tickets", "Nero's palace"]
    },
    {
        title: "St. Peter’s Basilica Dome Climb",
        seoTitle: "St. Peter's Dome Climb | Top of Rome View",
        seoDescription: "Climb Michelangelo's dome for the best view of the Vatican and Rome. Guided or self-guided options.",
        price: 35,
        duration: "1.5 hours",
        category: "vatican",
        tourType: "Adventure",
        badge: "Best View",
        rating: 4.8,
        reviewCount: 850,
        highlights: ["Dome Climb", "Panoramic View", "Inside the Dome"],
        includes: ["Dome Ticket", "Guide"],
        excludes: ["Lift to the very top (stairs only for last part)"],
        itinerary: [
            { title: "Basilica Entry", description: "Security check.", duration: "20 min" },
            { title: "The Climb", description: "Steps to the lantern.", duration: "30 min" },
            { title: "The View", description: "360-degree panorama.", duration: "30 min" }
        ],
        meetingPoint: "St. Peter's Square.",
        importantInfo: ["320 steps to climb manually", "Not for vertigo sufferers"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "The literal high point of your trip. Look down on the Altar, then look out over the entire city." }]
            }
        ],
        keywords: ["St Peter's dome", "Vatican view"]
    },
    {
        title: "Rome in a Day – Private Tour",
        seoTitle: "Rome in a Day Private Tour | Vatican & Colosseum",
        seoDescription: "The ultimate VIP experience. Private tour of Colosseum, Forum, Trevi Fountain, Pantheon, and Vatican in one day.",
        price: 450,
        duration: "7 hours",
        category: "special",
        tourType: "Private Full Day",
        badge: "Luxury",
        rating: 5.0,
        reviewCount: 80,
        highlights: ["Colosseum", "Vatican Museums", "City Center", "Private Guide"],
        includes: ["All Tickets", "Private Guide", "Walking Tour"],
        excludes: ["Lunch", "Transport between sites (walking/taxi)"],
        itinerary: [
            { title: "Morning: Ancient Rome", description: "Colosseum & Forum.", duration: "3 hours" },
            { title: "Lunch", description: "Break for authentic food.", duration: "1 hour" },
            { title: "Afternoon: Vatican", description: "Museums & Sistine Chapel.", duration: "3 hours" }
        ],
        meetingPoint: "Hotel Pickup (if central) or Colosseum.",
        importantInfo: ["Intensive walking"],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Maximize your time. If you only have one day in Rome, this is how you do it in style." }]
            }
        ],
        keywords: ["Private Rome tour", "Luxury travel Rome"]
    },
    {
        title: "Vatican City Tours - Open Bus Giardini",
        seoTitle: "Vatican Gardens Open Bus Tour + Museums",
        seoDescription: "Eco-friendly bus tour of the exclusive Vatican Gardens, plus Museum entry.",
        price: 95,
        duration: "3 hours",
        category: "vatican",
        tourType: "Bus Tour",
        badge: "Relaxing",
        rating: 4.7,
        reviewCount: 320,
        highlights: ["Gardens by Bus", "Audio Guide", "Museum Entry"],
        includes: ["Bus Ticket", "Museum Ticket"],
        excludes: [],
        itinerary: [
            { title: "Gardens Bus", description: "45 min ride.", duration: "45 min" },
            { title: "Museums", description: "Self-guided.", duration: "Flexible" }
        ],
        meetingPoint: "Vatican Museums.",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "See the Pope's backyard without walking. A perfect option for a relaxing start to your Vatican visit." }]
            }
        ],
        keywords: ["Vatican bus tour"]
    },
    {
        title: "Pantheon Private Tour",
        seoTitle: "Private Pantheon Tour | Official Guide",
        seoDescription: "Private guided tour of the Pantheon. Deepen your understanding of this ancient marvel.",
        price: 120,
        duration: "1 hour",
        category: "city",
        tourType: "Private",
        badge: "Exclusive",
        rating: 4.9,
        reviewCount: 80,
        highlights: ["Private Guide", "In-depth History"],
        includes: ["Private Guide", "Entry"],
        excludes: [],
        itinerary: [{ title: "Pantheon", description: "Detailed tour.", duration: "1 hour" }],
        meetingPoint: "Rotonda.",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Personalized attention and deep historical context for the architecture lover." }]
            }
        ],
        keywords: ["Private tour Rome"]
    },
    {
        title: "Castel Sant’Angelo – Private Tour",
        seoTitle: "Private Castel Sant'Angelo Tour",
        seoDescription: "Explore the Castle with a private guide. Tailored pace and focus.",
        price: 150,
        duration: "2 hours",
        category: "city",
        tourType: "Private",
        badge: "Exclusive",
        rating: 4.8,
        reviewCount: 40,
        highlights: ["Private Guide", "Rooftop", "Passetto"],
        includes: ["Private Guide", "Entry"],
        excludes: [],
        itinerary: [{ title: "Castle Tour", description: "Full exploration.", duration: "2 hours" }],
        meetingPoint: "Castle Entrance.",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "A private journey through the history of Rome's fortress." }]
            }
        ],
        keywords: []
    },
    {
        title: "Santa Maria Maggiore Underground experience guided tour",
        seoTitle: "Santa Maria Maggiore Underground Tour",
        seoDescription: "Explore the excavations beneath the Basilica. See the ancient Roman calendar.",
        price: 30,
        duration: "1 hour",
        category: "hidden-gems",
        tourType: "Guided Tour",
        badge: "Unique",
        rating: 4.6,
        reviewCount: 120,
        highlights: ["Underground ruins", "Mosaics", "Basilica"],
        includes: ["Guide", "Entry"],
        excludes: [],
        itinerary: [{ title: "Underground", description: "Excavations.", duration: "45 min" }],
        meetingPoint: "Basilica Entrance.",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "A rare glimpse into the layers of history beneath a major basilica." }]
            }
        ],
        keywords: ["Underground Rome"]
    },
    {
        title: "Golf Cart Tours",
        seoTitle: "Rome Golf Cart Tour | Highlights & Hidden Gems",
        seoDescription: "Zip around Rome in a golf cart. Fun, fast, and effortless sightseeing.",
        price: 150,
        duration: "3 hours",
        category: "special",
        tourType: "Golf Cart",
        badge: "Fun",
        rating: 4.9,
        reviewCount: 550,
        highlights: ["Save your feet", "See more", "Driver/Guide"],
        includes: ["Cart", "Driver"],
        excludes: ["Entry tickets"],
        itinerary: [
            { title: "City Center", description: "Pantheon, Trevi, Spanish Steps.", duration: "1 hour" },
            { title: "Aventine", description: "Keyhole & Orange Garden.", duration: "30 min" },
            { title: "Colosseum View", description: "Photo stop.", duration: "15 min" }
        ],
        meetingPoint: "Hotel Pickup.",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "The smartest way to see the city. Cover three days of walking in three hours of riding." }]
            }
        ],
        keywords: ["Rome golf cart"]
    },
    {
        title: "Stadium of Domitian Underground Experience",
        seoTitle: "Stadium of Domitian Underground Tour | Piazza Navona",
        seoDescription: "See the ruins of the ancient athletic stadium beneath Piazza Navona.",
        price: 15,
        duration: "45 min",
        category: "hidden-gems",
        tourType: "Self-Guided",
        badge: "Quick",
        rating: 4.5,
        reviewCount: 410,
        highlights: ["Underground Ruins", "Sports History"],
        includes: ["Audio Guide", "Entry"],
        excludes: [],
        itinerary: [{ title: "Ruins", description: "Self-guided walk.", duration: "45 min" }],
        meetingPoint: "Piazza Navona (North).",
        importantInfo: [],
        description: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Discover the sporting history of Rome beneath its most famous baroque square." }]
            }
        ],
        keywords: ["Piazza Navona underground"]
    }
];
