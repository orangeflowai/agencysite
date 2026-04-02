
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkInventory() {
    console.log("Checking Inventory Table...");
    const { count, error } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true });

    if (error) console.error("Error:", error);
    console.log(`Total Inventory Slots: ${count}`);

    if (count === 0) {
        console.log("⚠️ No inventory slots found! The calendar will be empty.");
    }
}

checkInventory();
