import { getTours } from '@/lib/tourService';

export const dynamic = 'force-dynamic';

export default async function DebugToursPage() {
  const tours = await getTours();
  return (
    <pre>
      {JSON.stringify(
        tours.map((t: any) => ({ slug: t.slug?.current, price: t.price, image: t.mainImage?.asset?.url })),
        null,
        2
      )}
    </pre>
  );
}
