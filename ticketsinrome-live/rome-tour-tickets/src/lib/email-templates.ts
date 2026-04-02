export function generateCustomerEmail(
  siteId: string,
  data: {
    name: string;
    tourTitle: string;
    date: string;
    time: string;
    guests: string;
    adults: string;
    students: string;
    youths: string;
    orderId: string;
    pin: string;
    totalAmount: number;
    metadata: any;
  }
) {
  const isWonders = siteId === 'wondersofrome';
  const brandColor = isWonders ? '#1e3a8a' : '#047857';
  const brandLight = isWonders ? '#dbeafe' : '#d1fae5';
  const brandName = isWonders ? 'Wonders of Rome' : 'Tickets in Rome';
  const brandDomain = isWonders ? 'wondersofrome.com' : 'ticketsinrome.com';
  const logoUrl = isWonders 
    ? 'https://wondersofrome.com/logo.png' 
    : 'https://ticketsinrome.com/logo.png';
  const supportPhone = '+39 329 929 4414';
  const providerPhone = '+39 06 445 0734';
  const bookingRef = data.orderId.slice(-8).toUpperCase();
  
  // Extract meeting point and create map URL
  const meetingPoint = data.metadata.meetingPoint || 'Via Germanico 8, 00192 Roma RM, Italy';
  const encodedAddress = encodeURIComponent(meetingPoint);
  
  const googleMapsUrl = data.metadata.mapAddress?.startsWith('http') 
    ? data.metadata.mapAddress 
    : data.metadata.location?.startsWith('http') 
        ? data.metadata.location 
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((data.metadata.mapAddress || data.metadata.location || meetingPoint?.split(/(?:\n|\. )/)[0] || '') + ' Rome')}`;
        
  const staticMapQuery = encodeURIComponent(
      (data.metadata.mapAddress && !data.metadata.mapAddress.startsWith('http')) ? data.metadata.mapAddress + ' Rome'
      : (data.metadata.location && !data.metadata.location.startsWith('http')) ? data.metadata.location + ' Rome'
      : (meetingPoint?.split(/(?:\n|\. )/)[0] || meetingPoint) + ' Rome'
  );
  
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${staticMapQuery}&zoom=15&size=600x200&markers=color:red%7C${staticMapQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

  // Parse add-ons
  let addOnsHtml = '';
  try {
    if (data.metadata?.addOns) {
      const addOns = typeof data.metadata.addOns === 'string'
        ? JSON.parse(data.metadata.addOns)
        : data.metadata.addOns;
      if (Array.isArray(addOns) && addOns.length > 0) {
        addOnsHtml = addOns.map((a: any) =>
          `<tr><td style="padding:6px 0;color:#374151;border-bottom:1px solid #f3f4f6;">${a.name}</td><td style="padding:6px 0;text-align:right;color:#374151;border-bottom:1px solid #f3f4f6;">€${(a.price || 0).toFixed(2)}</td></tr>`
        ).join('');
      }
    }
  } catch (e) {
    console.error('Failed to parse addOns:', e);
  }

  // Guest breakdown
  const guestRows = [
    { label: 'Adults', count: data.adults },
    { label: 'Students', count: data.students },
    { label: 'Youths', count: data.youths },
  ].filter(g => parseInt(g.count) > 0)
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

              <!-- Header with Logo -->
              <tr>
                <td style="background:${brandColor};padding:32px 40px;text-align:center;">
                  <img src="${logoUrl}" alt="${brandName}" style="max-width:180px;height:auto;margin-bottom:12px;" />
                  <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">${brandName}</h1>
                </td>
              </tr>

              <!-- Confirmation Badge -->
              <tr>
                <td style="padding:32px 40px 16px;text-align:center;">
                  <div style="display:inline-block;background:${brandLight};border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;text-align:center;">&#10003;</div>
                  <h2 style="margin:16px 0 4px;font-size:22px;color:#111827;">Thanks for your order, ${data.name.split(' ')[0]}!</h2>
                  <p style="margin:0;color:#6b7280;font-size:14px;">Your booking is confirmed. Here are the details.</p>
                </td>
              </tr>

              <!-- Booking Reference -->
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

              <!-- Activity Details -->
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
                          <tr>
                            <td style="padding:6px 0;color:#6b7280;width:100px;vertical-align:top;font-size:14px;">Date</td>
                            <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${data.date}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;color:#6b7280;width:100px;vertical-align:top;font-size:14px;">Time</td>
                            <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${data.time}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;color:#6b7280;width:100px;vertical-align:top;font-size:14px;">Guests</td>
                            <td style="padding:6px 0;font-size:14px;">${guestRows}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;color:#6b7280;width:100px;vertical-align:top;font-size:14px;">Language</td>
                            <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">English</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Action Required -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 8px 8px 0;">
                    <tr>
                      <td style="padding:16px;">
                        <strong style="color:#c2410c;font-size:14px;">Important: Collect Physical Tickets</strong>
                        <p style="margin:8px 0 0;color:#9a3412;font-size:13px;line-height:1.5;">
                          This voucher is <strong>NOT your ticket</strong>. Exchange it at the meeting point below at least <strong>15 minutes before</strong> your start time.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Meeting Point with Map -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                    <tr>
                      <td style="background:#f0fdf4;padding:12px 16px;">
                        <strong style="font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#047857;">Meeting Point</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0;">
                        <a href="${googleMapsUrl}" target="_blank" style="display:block;">
                          <img src="${staticMapUrl}" alt="Meeting Point Map" style="width:100%;height:auto;display:block;border:none;" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px;">
                        <p style="margin:0 0 8px;color:#111827;font-weight:600;font-size:14px;">${meetingPoint}</p>
                        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Look for staff holding a <strong>WHITE FLAG</strong> saying "ENJOY ROME"</p>
                        <p style="margin:0 0 12px;color:#6b7280;font-size:13px;">Arrive at least <strong>15 minutes</strong> before start time</p>
                        <a href="${googleMapsUrl}" style="display:inline-block;background:${brandColor};color:white;padding:8px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Open in Google Maps</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- What to Bring -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;">
                    <tr>
                      <td style="padding:16px;">
                        <strong style="font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#374151;">What to Bring</strong>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                          <tr><td style="padding:4px 0;color:#374151;font-size:13px;">&#10003; Passport or ID (mandatory for security)</td></tr>
                          <tr><td style="padding:4px 0;color:#374151;font-size:13px;">&#10003; Headphones (for audio guide)</td></tr>
                          <tr><td style="padding:4px 0;color:#374151;font-size:13px;">&#10003; Comfortable walking shoes</td></tr>
                          <tr><td style="padding:4px 0;color:#374151;font-size:13px;">&#10003; Shoulders &amp; knees covered (dress code)</td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Payment Receipt -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                    <tr>
                      <td style="background:#f9fafb;padding:12px 16px;">
                        <strong style="font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#374151;">Payment Receipt</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:6px 0;color:#374151;border-bottom:1px solid #f3f4f6;">${data.tourTitle}</td>
                            <td style="padding:6px 0;text-align:right;color:#374151;border-bottom:1px solid #f3f4f6;">${data.guests} guests</td>
                          </tr>
                          ${addOnsHtml}
                          <tr>
                            <td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#111827;">Total Paid</td>
                            <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:18px;color:${brandColor};">&#8364;${data.totalAmount.toFixed(2)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Cancellation Policy -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:8px;">
                    <tr>
                      <td style="padding:16px;">
                        <strong style="font-size:13px;color:#991b1b;">Cancellation Policy</strong>
                        <p style="margin:6px 0 0;color:#991b1b;font-size:13px;line-height:1.5;">
                          Free cancellation up to <strong>24 hours</strong> before the activity. No refund for cancellations within 24 hours.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;">
                    <tr>
                      <td style="padding:16px;text-align:center;">
                        <strong style="font-size:13px;color:#374151;">Need Help?</strong>
                        <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
                          Tour questions: <strong>${providerPhone}</strong><br>
                          Payment support: <strong>${supportPhone}</strong><br>
                          Reference: <strong>#${bookingRef}</strong> | PIN: <strong>${data.pin}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f3f4f6;padding:24px 40px;text-align:center;">
                  <img src="${logoUrl}" alt="${brandName}" style="max-width:120px;height:auto;margin-bottom:12px;opacity:0.7;" />
                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    &copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.
                  </p>
                  <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">
                    You received this email because you made a booking on ${brandDomain}
                  </p>
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
    name: string;
    email: string;
    phone: string;
    tourTitle: string;
    tourSlug: string;
    date: string;
    time: string;
    guests: string;
    adults: string;
    students: string;
    orderId: string;
    pin: string;
    totalAmount: number;
    metadata: any;
  }
) {
  // Financials Calculation
  const totalCharge = data.totalAmount;
  const supplierRate = totalCharge * 0.70;
  const netProfit = totalCharge - supplierRate;

  // Parse add-ons
  let addOnsDisplay = '';
  try {
    if (data.metadata?.addOns) {
      const addOns = typeof data.metadata.addOns === 'string'
        ? JSON.parse(data.metadata.addOns)
        : data.metadata.addOns;
      if (Array.isArray(addOns) && addOns.length > 0) {
        addOnsDisplay = addOns.map((a: any) => `${a.name} (€${a.total || a.price})`).join(', ');
      }
    }
  } catch (e) {
    addOnsDisplay = data.metadata?.addOns || '';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: monospace; color: #333; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
        h2 { border-bottom: 2px solid #333; padding-bottom: 5px; }
        .section { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .tag { display: inline-block; padding: 2px 5px; font-size: 11px; font-weight: bold; border-radius: 3px; }
        .tag-green { background: #dcfce7; color: #166534; }
        .tag-red { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- A. Booking Overview -->
        <div class="section">
          <h2>A. Booking Overview</h2>
          <p><strong>Status:</strong> <span class="tag tag-green">[CONFIRMED - PAID]</span></p>
          <p><strong>Booking Ref:</strong> ${data.orderId}</p>
          <p><strong>Internal PIN:</strong> <span style="background: #ffeb3b; padding: 0 5px;">${data.pin}</span> (Verify if customer calls)</p>
        </div>

        <!-- B. Supplier Manifest -->
        <div class="section">
          <h2>B. Supplier Manifest Data</h2>
          <p><strong>Product:</strong> ${data.tourTitle} (Slug: ${data.tourSlug})</p>
          <p><strong>Supplier:</strong> Tours About (Default)</p>
          <p><strong>Site Origin:</strong> ${siteId}</p>
          <p><strong>Voucher Status:</strong> <span class="tag tag-green">Sent to Customer ✅</span></p>
        </div>

        <!-- C. Customer Details -->
        <div class="section">
          <h2>C. Customer Details</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Contact:</strong> ${data.email} | ${data.phone}</p>
          <p><strong>Pax:</strong> ${data.guests} Total (${data.adults} Adults, ${data.students} Students)</p>
          ${addOnsDisplay ? `<p><strong>Extras:</strong> ${addOnsDisplay}</p>` : ''}
          ${data.metadata?.pickupRequired === 'yes' ? `<p><strong>Pickup:</strong> Required at ${data.metadata.hotelName}</p>` : ''}
          ${data.metadata?.luggageDeposit === 'yes' ? `<p><strong>Luggage Storage:</strong> Yes</p>` : ''}
        </div>

        <!-- D. Financials -->
        <div class="section">
          <h2>D. Financials</h2>
          <table class="table">
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
            <tr>
              <td>Total Charge</td>
              <td>€${totalCharge.toFixed(2)}</td>
              <td>Stripe ID: ${data.orderId}</td>
            </tr>
            <tr>
              <td>Supplier Net Rate</td>
              <td>€${supplierRate.toFixed(2)}</td>
              <td>Est. Payable to Supplier</td>
            </tr>
            <tr style="background: #ecfdf5; font-weight: bold;">
              <td>Net Profit</td>
              <td>€${netProfit.toFixed(2)}</td>
              <td>Agency Revenue</td>
            </tr>
          </table>
        </div>

        <!-- E. Operational Timeline -->
        <div class="section">
          <h2>E. Operational Timeline</h2>
          <p>[x] Booking Created (${new Date().toLocaleString()})</p>
          <p>[x] Confirmation Email Sent</p>
          <p>[ ] Action: Send SMS reminder 24h before (Scheduled)</p>
          <p>[ ] Action: Post-trip review request</p>
        </div>

      </div>
    </body>
    </html>
  `;
}
