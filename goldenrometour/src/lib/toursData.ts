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

// Golden Rome Tour — only 2 products
export const tours: TourProduct[] = [
    {
        id: 'vatican-museums-and-sistine-chapel-guided-tour',
        title: 'Complete Guided Tour: Vatican Museums & Sistine Chapel',
        slug: 'vatican-museums-and-sistine-chapel-guided-tour',
        category: 'vatican',
        tourType: 'Guided Tour',
        price: 65,
        duration: '3 Hours',
        groupSize: 'Up to 24 participants',
        description: "Bring history to life with an expert guide on this comprehensive tour of the Vatican Museums and Sistine Chapel. Bypass the crowds with exclusive skip-the-line access and explore the world's largest collection of Renaissance masterpieces, guided by dedicated experts who reveal the secrets behind the art.",
        highlights: [
            'Exclusive Skip-the-Line Entry — save hours of waiting',
            'Expert Storytelling — history, secrets, and context from a professional guide',
            'Michelangelo, Raphael, and Bernini up close',
            "Comprehensive route: Raphael's Rooms, Gallery of Maps, Pinecone Courtyard",
            'Small group — capped for a personal experience'
        ],
        includes: [
            'Guided tour of Vatican Museums',
            'Guided tour of the Sistine Chapel',
            'Fast-track skip-the-line entry',
            'Professional expert tour guide'
        ],
        excludes: [
            "Guided tour inside St. Peter's Basilica",
            'Hotel pick-up and drop-off',
            'Gratuities',
            'Food and beverages'
        ],
        meetingPoint: 'Via Germanico, 40, 00192 Roma, RM, Italy',
        importantInfo: [
            'Availability: Monday – Saturday (closed Sundays)',
            'Arrive 25 minutes before your scheduled start time',
            'Security screening is mandatory at the Vatican',
            'Dress code: shoulders and knees must be covered',
            'Large bags and sharp objects are not allowed',
            'Photography prohibited inside the Sistine Chapel'
        ],
        imageUrl: 'https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1200',
        badge: 'Best Seller',
        rating: 4.8,
        reviews: 2850
    },
    {
        id: 'vatican-museums-sistine-chapel-skip-the-line',
        title: 'Skip-the-Line: Vatican Museums & Sistine Chapel Ticket',
        slug: 'vatican-museums-sistine-chapel-skip-the-line',
        category: 'vatican',
        tourType: 'Skip-the-Line',
        price: 45,
        duration: 'Flexible',
        groupSize: 'Self-Guided',
        description: "Bypass the crowds and maximize your time inside one of the world's most incredible art collections. This fast-track entry ticket lets you skip the notorious Vatican queues, giving you the freedom to explore at your own pace.",
        highlights: [
            'Fast-Track Access — priority entry into Vatican Museums and Sistine Chapel',
            'Independent Exploration — explore at your own pace',
            "Michelangelo's Masterpieces — stand beneath the Sistine Chapel frescoes",
            'Self-Guided Map — navigate with a complimentary Vatican map'
        ],
        includes: [
            'Priority Skip-the-Line Entry Ticket',
            'Instant mobile voucher delivery',
            'Detailed map of the Vatican Museums',
            'All reservation and service fees'
        ],
        excludes: [
            'Hotel pick-up and drop-off',
            'Gratuities',
            'Food and beverages'
        ],
        meetingPoint: 'Via Germanico, 40, 00192 Roma, RM, Italy',
        importantInfo: [
            'Availability: Monday – Saturday (closed Sundays)',
            'Duration: Flexible — spend as long as you like',
            'Security screening is mandatory at the Vatican',
            'Dress code: shoulders and knees must be covered',
            'Photography prohibited inside the Sistine Chapel'
        ],
        imageUrl: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
        badge: 'Popular',
        rating: 4.7,
        reviews: 1850
    },
];
