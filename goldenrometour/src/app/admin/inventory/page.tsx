import { getTours } from '@/lib/tourService';
import InventoryCalendar from '@/components/admin/InventoryCalendar';

export default async function InventoryPage() {
  const tours = await getTours();

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Inventory Calendar</h1>
        <p className="text-muted-foreground">Manage availability, time slots, and pricing.</p>
      </div>

      <div className="flex-1 min-h-0">
        <InventoryCalendar tours={tours} />
      </div>
    </div>
  );
}
