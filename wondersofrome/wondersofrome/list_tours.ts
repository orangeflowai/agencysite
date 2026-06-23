import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { getTours } from './src/lib/sanityService';

async function check() {
    const tours = await getTours('wondersofrome');
    console.log(tours.map(t => t.slug.current).slice(0, 10));
}
check();
