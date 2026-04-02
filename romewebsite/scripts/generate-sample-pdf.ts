import { generateTicketPDF } from '../src/lib/ticketGenerator';
import fs from 'fs';

async function generateSamplePDF() {
    const sampleBooking = {
        bookingRef: 'WOR8X2P9M',
        tourTitle: 'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
        date: 'February 20, 2026',
        time: '09:00 AM',
        meetingPoint: 'Via Vespasiano 20, Rome (near Ottaviano Metro Station)',
        duration: '3 hours',
        customerName: 'John Smith',
        guests: 4,
        adults: 2,
        students: 2,
        youths: 0,
        addOns: [
            { name: 'Hotel Pickup Service', price: 45 },
            { name: 'Audio Guide Rental', price: 30 }
        ],
        siteName: 'wondersofrome',
        guideName: 'Maria Rossi',
        guidePhone: '+39 329 929 4414',
        emergencyContact: '+39 329 929 4414 (WhatsApp)'
    };

    try {
        const pdfBuffer = await generateTicketPDF(sampleBooking);
        fs.writeFileSync('sample-booking-wondersofrome.pdf', Buffer.from(pdfBuffer));
        console.log('✅ Sample PDF generated: sample-booking-wondersofrome.pdf');
    } catch (error) {
        console.error('❌ Failed to generate PDF:', error);
    }
}

generateSamplePDF();
