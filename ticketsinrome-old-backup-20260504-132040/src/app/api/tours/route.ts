import { getTours, getFeaturedTours } from "@/lib/backendAdapter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "6");
    const siteId = searchParams.get("site") || "ticketsinrome";

    let tours;
    if (featured) {
      tours = await getFeaturedTours(siteId, limit);
    } else {
      const allTours = await getTours(siteId);
      tours = allTours.slice(0, limit);
    }

    return Response.json(tours);
  } catch (error) {
    console.error("Error in /api/tours:", error);
    return Response.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
