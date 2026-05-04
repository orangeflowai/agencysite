import { PAYLOAD_API_URL, PAYLOAD_API_KEY } from "./constants";

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  duration?: string;
  category?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  site?: string;
  _id?: string;
}

/**
 * Fetch all tours from Payload CMS
 */
export async function getTours(siteId: string = "ticketsinrome"): Promise<Tour[]> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/tours?site=${siteId}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${PAYLOAD_API_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch tours: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return (data.docs || []).map((tour: any) => ({
      id: tour.id || tour._id,
      _id: tour._id || tour.id,
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      price: tour.price || 0,
      duration: tour.duration,
      category: tour.category,
      mainImage: tour.mainImage,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      featured: tour.featured,
      site: tour.site,
    }));
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

/**
 * Fetch featured tours for homepage
 */
export async function getFeaturedTours(
  siteId: string = "ticketsinrome",
  limit: number = 6
): Promise<Tour[]> {
  try {
    const tours = await getTours(siteId);
    return tours.filter(t => t.featured).slice(0, limit);
  } catch (error) {
    console.error("Error fetching featured tours:", error);
    return [];
  }
}

/**
 * Fetch single tour by slug
 */
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/tours?slug=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${PAYLOAD_API_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch tour: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const tour = data.docs?.[0];
    
    if (!tour) return null;

    return {
      id: tour.id || tour._id,
      _id: tour._id || tour.id,
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      price: tour.price || 0,
      duration: tour.duration,
      category: tour.category,
      mainImage: tour.mainImage,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      featured: tour.featured,
      site: tour.site,
    };
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
    return null;
  }
}

/**
 * Fetch tour by ID
 */
export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/tours/${id}`,
      {
        headers: {
          Authorization: `Bearer ${PAYLOAD_API_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch tour: ${response.statusText}`);
      return null;
    }

    const tour = await response.json();
    
    return {
      id: tour.id || tour._id,
      _id: tour._id || tour.id,
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      price: tour.price || 0,
      duration: tour.duration,
      category: tour.category,
      mainImage: tour.mainImage,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      featured: tour.featured,
      site: tour.site,
    };
  } catch (error) {
    console.error("Error fetching tour by ID:", error);
    return null;
  }
}

/**
 * Search tours by keyword
 */
export async function searchTours(
  query: string,
  siteId: string = "ticketsinrome"
): Promise<Tour[]> {
  try {
    const tours = await getTours(siteId);
    const lowerQuery = query.toLowerCase();
    
    return tours.filter(
      tour =>
        tour.title.toLowerCase().includes(lowerQuery) ||
        tour.description?.toLowerCase().includes(lowerQuery) ||
        tour.category?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Error searching tours:", error);
    return [];
  }
}
