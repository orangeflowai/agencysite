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
        title: 'Complete Guided Tour: Vatican Museums & Sistine Chapel',
        slug: 'vatican-museums-and-sistine-chapel-guided-tour',
        category: 'vatican',
        tourType: 'Guided Tour',
        price: 65,
        duration: '3 Hours',
        groupSize: 'Up to 24 participants',
        description: "Bring history to life with an expert guide on this comprehensive tour of the Vatican Museums and the Sistine Chapel. Bypass the legendary crowds with exclusive skip-the-line access and dive deep into the world's largest collection of outstanding Renaissance masterpieces, guided by dedicated experts who reveal the secrets behind the art.",
        highlights: [
            'Exclusive Skip-the-Line Entry: Save hours of waiting with fast-track access into the Vatican Museums and Sistine Chapel',
            'Expert Storytelling: Learn the history, secrets, and context of the Vatican\'s treasures from a professional guide',
            'Iconic Masterpieces: Witness the genius of Michelangelo, Raphael, and Bernini up close',
            'Comprehensive Route: Explore highlights like Raphael\'s Rooms, the Gallery of the Maps, and Bramante\'s Pinecone Courtyard',
            'Small Group Experience: Enjoy a more personal and comfortable sightseeing experience with a capped group size'
        ],
        includes: [
            'Guided tour of the Vatican Museums',
            'Guided tour of the Sistine Chapel',
            'Fast-track, skip-the-line entry to all included sites',
            'Professional expert tour guide'
        ],
        excludes: [
            'Guided tour inside St. Peter\'s Basilica',
            'Hotel pick-up and drop-off',
            'Gratuities',
            'Food and beverages'
        ],
        meetingPoint: 'Via Germanico, 40, 00192 Roma, RM, Italy',
        importantInfo: [
            'Availability: Monday – Saturday (Closed on Sundays)',
            'Duration: 3 Hours',
            'Starting Time: Flexible (Choose a time that works best for your schedule)',
            'Arrival Time: Please arrive 25 minutes prior to your scheduled start time',
            'Group Size: Up to 24 participants',
            'Guide: Professional, expert tour guide',
            'Security screening is mandatory at the Vatican',
            'Valid photo ID may be required',
            'Dress code: shoulders and knees must be covered',
            'Large bags, suitcases, and sharp objects are not allowed',
            'Entry to the Sistine Chapel prohibits photography'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&q=90',
        badge: 'Best Seller',
        rating: 4.8,
        reviews: 2850
    },
    {
        id: 'vatican-museums-sistine-chapel-skip-the-line',
        title: 'Premium Skip-the-Line: Vatican Museums & Sistine Chapel Ticket',
        slug: 'vatican-museums-sistine-chapel-skip-the-line',
        category: 'vatican',
        tourType: 'Skip-the-Line',
        price: 45,
        duration: 'Flexible',
        groupSize: 'Self-Guided',
        description: "Bypass the crowds and maximize your time inside one of the world's most incredible art collections. This fast-track entry ticket lets you skip the notorious Vatican queues, giving you the freedom to explore the Vatican Museums and the awe-inspiring Sistine Chapel at your own pace.\n\nHave you ever dreamed of gazing at Michelangelo's masterpieces in the Sistine Chapel without the exhaustion of an hours-long wait? Our premium skip-the-line tickets offer the ultimate solution.\n\nInstead of wasting your day standing outside the walls of Vatican City, this fast-track ticket allows you to breeze past the queues and step right into history. Once inside, you are your own host. Take your time wandering through the endless galleries, discovering centuries of iconic art, and soaking in the breathtaking beauty of the Sistine Chapel. You've saved the waiting time—now you can invest it in experiencing the treasures of the Pope's state exactly the way you want to.",
        highlights: [
            'Fast-Track Access: Breeze past the long lines with priority entry into the Vatican Museums and Sistine Chapel',
            'Independent Exploration: Be your own guide and explore the vast collections for as long as you wish, completely at your own pace',
            'Michelangelo\'s Masterpieces: Stand beneath the world-famous, breathtaking frescoes of the Sistine Chapel',
            'Self-Guided Map: Easily navigate the massive museum complex and locate key artworks with a complimentary Vatican map'
        ],
        includes: [
            'Priority Skip-the-Line Entry Ticket',
            'Instant ticket delivery with a convenient Mobile Voucher',
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
            'Availability: Monday – Saturday (Closed on Sundays)',
            'Duration: Flexible (Spend as much time as you like inside)',
            'Starting Time: Flexible (Begin your visit at whatever time is most convenient for you)',
            'Security screening is mandatory at the Vatican',
            'Valid photo ID may be required',
            'Dress code: shoulders and knees must be covered',
            'Large bags, suitcases, and sharp objects are not allowed',
            'Entry to the Sistine Chapel prohibits photography'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=90',
        badge: 'Popular',
        rating: 4.7,
        reviews: 1850
    },
];
