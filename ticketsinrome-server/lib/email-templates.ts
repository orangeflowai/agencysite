// ── Viator/GetYourGuide-style confirmation email ──────────────────────────────

export function generateCustomerEmail(
  siteId: string,
  data: {
    name: string; tourTitle: string; date: string; time: string;
    guests: string; adults: string; students: string; youths: string;
    orderId: string; pin: string; totalAmount: number; metadata: any;
  }
) {
  const isWonders   = siteId === 'wondersofrome';
  const brandColor  = isWonders ? '#1e3a8a' : '#047857';
  const brandLight  = isWonders ? '#dbeafe' : '#d1fae5';
  const brandName   = isWonders ? 'Wonders of Rome' : 'Tickets In Rome';
  const brandDomain = isWonders ? 'wondersofrome.com' : 'ticketsinrome.com';
  const logoUrl     = isWonders 
    ? 'https://wondersofrome.com/logo.png' 
    : 'https://ticketsinrome.com/logo-dark.png';
  const supportPhone  = isWonders ? '+39 351 419 9425' : '+39 351 786 9798';
  const bookingRef  = data.orderId.slice(-8).toUpperCase();

  const meetingPoint = (data.metadata.meetingPoint && data.metadata.meetingPoint !== 'See booking confirmation for details')
    ? data.metadata.meetingPoint
    : (isWonders ? 'Via Tunisi 43, 00192 Roma RM, Italy' : 'Via Germanico 8, 00192 Roma RM, Italy');
  
  const encodedAddress = encodeURIComponent(meetingPoint);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=600x200&markers=color:red%7C${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'}`;

  const guestRows = [
    { label: 'Adults', count: data.adults },
    { label: 'Students', count: data.students },
    { label: 'Youths', count: data.youths },
  ].filter(g => parseInt(g.count || '0') > 0)
    .map(g => `<span style="display:inline-block;margin-right:16px;color:#374151;">${g.label}: <strong>${g.count}</strong></span>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;">
        <tr>
          <td align="center" style="padding:24px 16px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="background:${brandColor};padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">${brandName}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px 16px;text-align:center;">
                  <div style="display:inline-block;background:${brandLight};border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;text-align:center;">&#10003;</div>
                  <h2 style="margin:16px 0 4px;font-size:22px;color:#111827;">Thanks for your order, ${data.name.split(' ')[0]}!</h2>
                  <p style="margin:0;color:#6b7280;font-size:14px;">Your booking is confirmed. Here are the details.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 40px 24px;text-align:center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#f9fafb;border-radius:8px;padding:12px;text-align:center;">
                        <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Booking Reference</span><br>
                        <span style="font-size:24px;font-weight:700;font-family:monospace;color:#111827;">#${bookingRef}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                    <tr>
                      <td style="background:${brandLight};padding:12px 16px;">
                        <strong style="font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:${brandColor};">Activity Details</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px;">
                        <h3 style="margin:0 0 12px;font-size:18px;color:#111827;">${data.tourTitle}</h3>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                          <tr><td style="padding:6px 0;color:#6b7280;width:100px;font-size:14px;">Date</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${data.date}</td></tr>
                          <tr><td style="padding:6px 0;color:#6b7280;width:100px;font-size:14px;">Time</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${data.time}</td></tr>
                          <tr><td style="padding:6px 0;color:#6b7280;width:100px;font-size:14px;">Guests</td><td style="padding:6px 0;font-size:14px;">${guestRows}</td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 40px 24px;text-align:center;">
                  <a href="${googleMapsUrl}" style="display:inline-block;background:${brandColor};color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Open Meeting Point</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generateAdminEmail(
  siteId: string,
  data: {
    name: string; email: string; phone: string;
    tourTitle: string; tourSlug: string;
    date: string; time: string; guests: string;
    adults: string; students: string;
    orderId: string; pin: string; totalAmount: number; metadata: any;
  }
) {
  const brandName = siteId === 'wondersofrome' ? 'Wonders of Rome' : 'Tickets in Rome';
  return `<h1>New Booking: ${data.tourTitle}</h1><p>Customer: ${data.name} (${data.email})</p><p>Total: €${data.totalAmount}</p>`;
}
