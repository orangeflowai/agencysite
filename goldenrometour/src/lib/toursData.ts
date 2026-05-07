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
    imageUrl: string;
    badge?: string;
    rating: number;
    reviews: number;
};

// Working Unsplash image URLs for Rome tours
export const tours: TourProduct[] = [
    // --- ONLY 2 VATICAN TOURS FOR GOLDENROMETOUR ---
    {
        id: 'vatican-museum-sistine-chapel-skip-line-tickets',
        title: 'Vatican Museum and Sistine Chapel Skip The Line Tickets',
        slug: 'vatican-museum-sistine-chapel-skip-line-tickets',
        category: 'vatican',
        tourType: 'Skip-the-Line',
        price: 45,
        duration: '3 hours',
        description: "Experience the Vatican Museums and Sistine Chapel without the wait. This skip-the-line ticket grants you priority access to one of the world's most visited attractions, allowing you to bypass the notoriously long queues and maximize your time exploring the incredible art and history within.",
        highlights: [
            'Skip the long entrance queues with priority access',
            'Explore the Vatican Museums at your own pace',
            'Admire Michelangelo\'s Sistine Chapel ceiling',
            'See masterpieces by Raphael, Caravaggio, and more',
            'Access to the Gallery of Maps and Raphael Rooms',
            'Flexible entry time within your selected slot'
        ],
        includes: [
            'Skip-the-line entrance ticket to Vatican Museums',
            'Access to Sistine Chapel',
            'Access to all permanent collections',
            'Security fast-track',
            'Digital confirmation voucher'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&q=90',
        badge: 'Best Seller',
        rating: 4.9,
        reviews: 216
    },
    {
        id: 'vip-vatican-museum-sistine-chapel-st-basilica',
        title: 'VIP Vatican Museum, Sistine Chapel Tour & Access to St. Basilica',
        slug: 'vip-vatican-museum-sistine-chapel-st-basilica',
        category: 'vatican',
        tourType: 'VIP Guided Tour',
        price: 89,
        duration: '4 hours',
        description: "Elevate your Vatican experience with this exclusive VIP tour that combines skip-the-line access, expert guidance, and privileged entry to St. Peter's Basilica. Led by a professional art historian, this small-group tour (maximum 15 guests) ensures an intimate and enriching experience.",
        highlights: [
            'VIP skip-the-line access to Vatican Museums',
            'Expert art historian guide throughout the tour',
            'Small group experience (maximum 15 people)',
            'In-depth exploration of the Sistine Chapel',
            'Direct access to St. Peter\'s Basilica (no separate queue)',
            'See Michelangelo\'s Pietà and Bernini\'s Baldachin',
            'Exclusive insights into Vatican art and history',
            'Premium headset system for clear audio'
        ],
        includes: [
            'Professional art historian guide',
            'Skip-the-line entrance to Vatican Museums',
            'Access to Sistine Chapel with guided commentary',
            'Direct access to St. Peter\'s Basilica',
            'Premium headset for clear audio',
            'Small group experience (max 15 guests)',
            'All entrance fees and taxes'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=90',
        badge: 'VIP Experience',
        rating: 4.6,
        reviews: 115
    },
];
