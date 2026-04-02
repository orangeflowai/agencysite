import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface TicketData {
    bookingRef: string;
    tourTitle: string;
    date: string;
    time: string;
    meetingPoint: string;
    duration: string;
    customerName: string;
    guests: number;
    adults: number;
    students: number;
    youths: number;
    addOns?: Array<{ name: string; price: number }>;
    qrCode?: string;
    siteName: string;
    siteLogo?: string;
    guideName?: string;
    guidePhone?: string;
    emergencyContact?: string;
}

export async function generateTicketPDF(data: TicketData): Promise<Uint8Array> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // Colors - Sky blue theme for ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}
    const primaryColor = process.env.NEXT_PUBLIC_BRAND_COLOR || '#059669';
    const secondaryColor = '#6b7280';

    // Header Background
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Site Name
    doc.setTextColor('#ffffff');
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(process.env.NEXT_PUBLIC_SITE_NAME || 'Your Agency', margin, 30);

    // Booking Reference
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING REFERENCE', margin, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.bookingRef, margin, 50);

    y = 70;

    // QR Code
    const qrData = JSON.stringify({
        ref: data.bookingRef,
        tour: data.tourTitle,
        date: data.date,
        guests: data.guests
    });
    
    try {
        const qrDataUrl = await QRCode.toDataURL(qrData, { width: 100 });
        doc.addImage(qrDataUrl, 'PNG', pageWidth - 60, y, 40, 40);
    } catch (e) {
        console.error('QR generation failed:', e);
    }

    // Tour Details
    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.tourTitle, margin, y);
    y += 10;

    doc.setTextColor('#000000');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    // Date & Time
    doc.setFont('helvetica', 'bold');
    doc.text('Date & Time:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.date} at ${data.time}`, margin + 35, y);
    y += 8;

    // Duration
    doc.setFont('helvetica', 'bold');
    doc.text('Duration:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.duration || '3 hours', margin + 35, y);
    y += 8;

    // Meeting Point
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Point:', margin, y);
    doc.setFont('helvetica', 'normal');
    const meetingLines = doc.splitTextToSize(data.meetingPoint || 'Via Vespasiano 20, Rome (near Ottaviano Metro)', contentWidth - 35);
    doc.text(meetingLines, margin + 35, y);
    y += (meetingLines.length * 6) + 8;

    // Divider
    doc.setDrawColor('#e5e7eb');
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Guest Details
    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Guest Details', margin, y);
    y += 8;

    doc.setTextColor('#000000');
    doc.setFontSize(11);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Lead Guest:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.customerName, margin + 35, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Total Guests:', margin, y);
    doc.setFont('helvetica', 'normal');
    const guestBreakdown = [];
    if (data.adults > 0) guestBreakdown.push(`${data.adults} Adults`);
    if (data.students > 0) guestBreakdown.push(`${data.students} Students`);
    if (data.youths > 0) guestBreakdown.push(`${data.youths} Youths`);
    doc.text(`${data.guests} (${guestBreakdown.join(', ')})`, margin + 35, y);
    y += 10;

    // Add-ons
    if (data.addOns && data.addOns.length > 0) {
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Add-ons', margin, y);
        y += 8;

        doc.setTextColor('#000000');
        doc.setFontSize(10);
        data.addOns.forEach(addon => {
            doc.text(`• ${addon.name}`, margin, y);
            y += 5;
        });
        y += 5;
    }

    // Divider
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Important Information
    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Important Information', margin, y);
    y += 8;

    doc.setTextColor('#000000');
    doc.setFontSize(10);
    
    const infoItems = [
        '• Arrive 20 minutes before departure time',
        '• Bring valid ID/Passport for all guests',
        '• Dress code: Shoulders and knees must be covered',
        '• Wear comfortable walking shoes',
        '• Free cancellation up to 24 hours before the tour'
    ];

    infoItems.forEach(item => {
        doc.text(item, margin, y);
        y += 6;
    });

    y += 5;

    // Contact Info
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Need Help?', margin, y);
    y += 8;

    doc.setTextColor('#000000');
    doc.setFontSize(10);
    
    if (data.guideName) {
        doc.setFont('helvetica', 'bold');
        doc.text('Your Guide:', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${data.guideName} (${data.guidePhone})`, margin + 30, y);
        y += 6;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Emergency:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.emergencyContact || '+39 329 929 4414 (WhatsApp)', margin + 30, y);
    y += 6;

    // Footer
    doc.setFillColor('#f3f4f6');
    doc.rect(0, 280, pageWidth, 17, 'F');
    
    doc.setTextColor(secondaryColor);
    doc.setFontSize(9);
    doc.text('This is your official booking voucher. Please present it at the meeting point.', margin, 290);
    doc.text(`Booked via ${process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '') || 'yourdomain.com'}`, margin, 295);

    return new Uint8Array(doc.output('arraybuffer'));
}

// Generate a booking reference
export function generateBookingRef(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `WOR${timestamp.slice(-4)}${random}`;
}
