export type TourProduct = {
    id: string;
    title: string;
    slug: string;
    category: 'colosseum' | 'vatican' | 'city' | 'hidden-gems';
    tourType: string;
    price: number;
    duration: string;
    description: string;
    highlights: string[];
    includes: string[];
    excludes?: string[];
    imageUrl: string;
    badge?: string;
    rating: number;
    reviews: number;
    meetingPoint?: string;
    importantInfo?: string[];
    groupSize?: string;
};

// Working Unsplash image URLs for Rome tours
export const tours: TourProduct[] = [
    // --- ONLY 2 VATICAN TOURS FOR GOLDENROMETOUR ---
    {
        id: 'vatican-museums-and-sistine-chapel-guided-tour',
        title: 'Vatican Museums & Sistine Chapel Guided Tour',
        slug: 'vatican-museums-and-sistine-chapel-guided-tour',
        category: 'vatican',
        tourType: 'Guided Tour',
        price: 65,
        duration: '2 Hours',
        groupSize: 'Max 20 People',
        description: "Skip the long entrance lines and step directly into the extraordinary world of the Vatican Museums, one of the most important cultural institutions on Earth. Home to an immense collection built by popes over centuries, the museums stretch across more than 7 kilometers of galleries filled with masterpieces spanning classical antiquity, the Renaissance, and beyond.\n\nAccompanied by your expert guide, navigate this vast complex with ease while discovering the stories, symbolism, and secrets behind the art. Stroll through the peaceful Pinecone Courtyard, then continue into some of the museums' most spectacular halls. In the Gallery of Maps, admire vibrant 16th-century cartographic frescoes depicting Italy in astonishing detail. In the Gallery of Tapestries, witness intricate woven masterpieces that appear almost lifelike, while the Gallery of Candelabra dazzles with classical sculptures and richly decorated ceilings. Along the way, your guide will reveal the powerful popes, brilliant artists, and historical events that shaped these treasures.\n\nThe journey culminates in the awe-inspiring Sistine Chapel, one of the most celebrated artistic achievements in human history. Stand beneath Michelangelo's legendary ceiling frescoes, including the iconic Creation of Adam, and behold the dramatic Last Judgment on the altar wall. Your guide will prepare you beforehand with essential context, explaining the incredible techniques, physical demands, and years of labor required to paint these monumental works high above the chapel floor.\n\nStill used today for papal conclaves, the Sistine Chapel is not only an artistic masterpiece but also a place of profound religious significance. This guided tour offers the perfect balance of insight and efficiency, allowing you to experience the highlights of the Vatican's unparalleled collections while gaining a deeper understanding of the art, history, and faith that define this remarkable place.",
        highlights: [
            'Guided visit to the Vatican Museums with an expert licensed guide',
            'Explore world-famous galleries, including the Gallery of Maps and Gallery of Tapestries',
            'Marvel at Michelangelo\'s frescoes inside the Sistine Chapel',
            'Learn the stories behind masterpieces of Renaissance art',
            'Professional licensed Vatican guide',
            'Navigate the vast complex efficiently without getting lost',
            'Ideal for first-time visitors and art lovers alike'
        ],
        includes: [
            'Skip-the-line Vatican Museums tickets',
            'Professional licensed guide',
            'Headsets for groups',
            'Sistine Chapel access',
            'Assistance at the meeting point',
            'Guided tour of the Vatican Museums'
        ],
        excludes: [
            'Hotel pickup/drop-off',
            'Food and drinks',
            'St. Peter\'s Basilica guided visit',
            'Gratuities'
        ],
        meetingPoint: 'Via Tunisi 43, located just a short walk from the entrance to the Vatican Museums. The nearest metro stop is Cipro metro station (Line A), approximately a 5-minute walk away. We recommend arriving at least 15 minutes before your scheduled time for check-in.',
        importantInfo: [
            'Valid photo ID may be required for entry',
            'A strict dress code applies: shoulders and knees must be covered',
            'Security screening is mandatory for all visitors',
            'Student discounts require valid student ID',
            'Please arrive at least 15 minutes before the scheduled start time',
            'Photography is prohibited inside the Sistine Chapel',
            'Large bags, suitcases, and sharp objects are not permitted',
            'The itinerary may vary due to Vatican regulations or crowd control'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&q=90',
        badge: 'Best Seller',
        rating: 4.8,
        reviews: 2850
    },
    {
        id: 'vatican-museums-sistine-chapel-skip-the-line',
        title: 'Vatican Museums & Sistine Chapel Skip-the-Line Tickets',
        slug: 'vatican-museums-sistine-chapel-skip-the-line',
        category: 'vatican',
        tourType: 'Skip-the-Line',
        price: 45,
        duration: '3 Hours',
        groupSize: 'Self-Guided',
        description: "Skip the long lines at the entrance to one of the world's busiest cultural attractions with priority access to the Vatican Museums and Sistine Chapel. Step inside a vast complex of galleries, corridors, and courtyards housing one of the most important art collections on Earth, spanning over two millennia of human creativity.\n\nWander at your own pace through magnificent halls adorned with frescoes, tapestries, sculptures, and maps. Admire priceless works by legendary masters such as Raphael, Michelangelo, and Leonardo da Vinci, tracing the evolution of art from classical antiquity through the Renaissance and into the modern era. In the Raphael Rooms, marvel at the stunning frescoes of the Stanze, where art, philosophy, and papal history intertwine in breathtaking detail.\n\nContinue through iconic galleries such as the Gallery of Maps, the Gallery of Tapestries, and the Gallery of Candelabra, each richly decorated with intricate ceilings and masterpieces from the papal collections. Visit the peaceful Belvedere Courtyard and the Octagonal Courtyard to see celebrated ancient sculptures, including the dramatic Laocoön Group, one of the greatest surviving works of classical antiquity.\n\nTravel further back in time in the Egyptian and Etruscan Museums, where artifacts reveal the mysteries of ancient civilizations, or explore the Ethnological Museum to discover cultures from across the globe. The museums also house an impressive collection of modern religious art, featuring works by artists such as Van Gogh, Matisse, and Moore.\n\nYour visit culminates in the Sistine Chapel, where you will stand beneath Michelangelo's legendary ceiling frescoes, including The Creation of Adam, and the powerful Last Judgment on the altar wall. This sacred space, still used for papal conclaves, offers a moment of awe as art, faith, and history converge in one of the most celebrated interiors in the world.\n\nIdeal for independent travelers, this skip-the-line ticket allows you to experience the Vatican's artistic treasures at your own rhythm while avoiding long waits, making the most of your time inside this extraordinary cultural and spiritual landmark.",
        highlights: [
            'Fast-track entry to the Vatican Museums',
            'Explore world-famous galleries, including the Raphael Rooms, Gallery of Maps, and more',
            'Marvel at Michelangelo\'s frescoes in the Sistine Chapel',
            'Ideal for independent travelers or those short on time',
            'See masterpieces at your own pace without waiting in long lines'
        ],
        includes: [
            'Skip-the-line entry ticket to Vatican Museums and Sistine Chapel',
            'Access to the museums\' permanent collection',
            'Booking and handling fee',
            'Host at the meeting point (IN OUR OFFICE)',
            'Vatican Museums reservation fee',
            'Guest relations assistance to enter the Museums',
            'Instant Confirmation'
        ],
        excludes: [
            'Guided tour or live commentary',
            'Hotel pickup and Drop-off',
            'Foods and drinks',
            'Audio Guided tour (if option selected)',
            'Gratuities'
        ],
        meetingPoint: 'Via Tunisi 43, located just a short walk from the entrance to the Vatican Museums. The nearest metro stop is Cipro metro station (Line A), approximately a 5-minute walk away. We recommend arriving at least 15-20 minutes before your scheduled time for check-in.',
        importantInfo: [
            'Security screening is mandatory at the Vatican',
            'Valid photo ID may be required',
            'Dress code: shoulders and knees must be covered',
            'Large bags, suitcases, and sharp objects are not allowed',
            'Entry to the Sistine Chapel prohibits photography',
            'Please arrive at least 15 minutes before your scheduled entry time',
            'Activity operates rain or shine'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=90',
        badge: 'Popular',
        rating: 4.7,
        reviews: 1850
    },
];
