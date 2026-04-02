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
  const brandName   = isWonders ? 'Wonders of Rome' : 'Tickets in Rome';
  const brandDomain = isWonders ? 'wondersofrome.com' : 'ticketsinrome.com';
  const logoUrl     = `https://${brandDomain}/logo.png`;
  const supportPhone  = process.env.NEXT_PUBLIC_SUPPORT_PHONE  || '+39 329 929 4414';
  const providerPhone = process.env.NEXT_PUBLIC_PROVIDER_PHONE || supportPhone;
  const bookingRef  = data.orderId.slice(-8).toUpperCase();

  const meetingPoint = (data.metadata.meetingPoint && data.metadata.meetingPoint !== 'See booking confirmation for details')
    ? data.metadata.meetingPoint
    : (isWonders ? 'Via Tunisi 43, 00192 Roma RM, Italy' : 'Via Germanico 8, 00192 Roma RM, Italy');
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
  
  const staticMapUrl   = `https://maps.googleapis.com/maps/api/staticmap?center=${staticMapQuery}&zoom=15&size=560x160&markers=color:red%7C${staticMapQuery}&key=${process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'}`;

  let addOnsRows = '';
  try {
    const addOns = typeof data.metadata?.addOns === 'string' ? JSON.parse(data.metadata.addOns) : (data.metadata?.addOns || []);
    if (Array.isArray(addOns) && addOns.length > 0) {
      addOnsRows = addOns.map((a: any) =>
        `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">${a.name}</td><td style="padding:8px 0;text-align:right;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;">+€${(a.price||0).toFixed(2)}</td></tr>`
      ).join('');
    }
  } catch {}

  const guestParts = [
    { label: 'Adults', count: parseInt(data.adults||'0') },
    { label: 'Students', count: parseInt(data.students||'0') },
    { label: 'Youths', count: parseInt(data.youths||'0') },
  ].filter(g => g.count > 0)
   .map(g => `<span style="display:inline-block;background:#f3f4f6;border-radius:20px;padding:4px 12px;font-size:13px;color:#374151;margin:2px 4px 2px 0;">${g.count} ${g.label}</span>`)
   .join('');

  const firstName = data.name.split(' ')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="padding:0 0 20px;text-align:center;">
    <img src="${logoUrl}" alt="${brandName}" style="height:36px;width:auto;" />
  </td></tr>
  <tr><td style="background:${brandColor};border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:28px;text-align:center;">&#10003;</div>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">You're all set, ${firstName}!</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.8);">Your booking is confirmed and paid.</p>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:2px dashed #e5e7eb;border-radius:12px;margin:24px 0;">
      <tr><td style="padding:16px 20px;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;">Booking Reference</p>
        <p style="margin:0;font-size:28px;font-weight:900;font-family:'Courier New',monospace;color:#111827;letter-spacing:2px;">#${bookingRef}</p>
        <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Show this at the meeting point</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:14px 20px;background:${brandColor};"><p style="margin:0;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.85);">Tour Details</p></td></tr>
      <tr><td style="padding:20px;">
        <p style="margin:0 0 16px;font-size:18px;font-weight:800;color:#111827;line-height:1.3;">${data.tourTitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;width:110px;font-size:13px;color:#9ca3af;font-weight:600;">&#128197; Date</td><td style="padding:6px 0;font-size:14px;font-weight:700;color:#111827;">${data.date}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;">&#128336; Time</td><td style="padding:6px 0;font-size:14px;font-weight:700;color:#111827;">${data.time}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;">&#128101; Guests</td><td style="padding:6px 0;">${guestParts}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;">
      <tr><td style="padding:14px 16px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:800;color:#92400e;">&#9888;&#65039; Action Required Before Your Tour</p>
        <p style="margin:0;font-size:13px;color:#78350f;line-height:1.5;">This voucher is <strong>NOT your entry ticket</strong>. Exchange it at the meeting point at least <strong>15 minutes before</strong> your start time.</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:14px 20px;background:#f8fafc;border-bottom:1px solid #e5e7eb;"><p style="margin:0;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">&#128205; Meeting Point</p></td></tr>
      <tr><td style="padding:0;"><a href="${googleMapsUrl}" target="_blank" style="display:block;"><img src="${staticMapUrl}" alt="Map" style="width:100%;height:auto;display:block;" /></a></td></tr>
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#111827;">${meetingPoint}</p>
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Look for staff with a <strong>white flag</strong> saying <strong>"${brandName.toUpperCase()}"</strong></p>
        <p style="margin:0 0 14px;font-size:13px;color:#6b7280;">Arrive at least <strong>15 minutes early</strong></p>
        <a href="${googleMapsUrl}" style="display:inline-block;background:${brandColor};color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;">Open in Google Maps &#8594;</a>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#166534;">&#10003; What to Bring</p>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#166534;">&#8226; Passport or ID (mandatory for security)</td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#166534;">&#8226; Comfortable walking shoes</td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#166534;">&#8226; Shoulders &amp; knees covered (Vatican dress code)</td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#166534;">&#8226; Water bottle &amp; sunscreen</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:14px 20px;background:#f8fafc;border-bottom:1px solid #e5e7eb;"><p style="margin:0;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">&#128179; Payment Summary</p></td></tr>
      <tr><td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">${data.tourTitle}</td><td style="padding:8px 0;text-align:right;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">${data.guests} guests</td></tr>
          ${addOnsRows}
          <tr><td style="padding:14px 0 0;font-size:16px;font-weight:800;color:#111827;">Total Paid</td><td style="padding:14px 0 0;text-align:right;font-size:20px;font-weight:900;color:${brandColor};">&#8364;${data.totalAmount.toFixed(2)}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:12px;">
      <tr><td style="padding:14px 20px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#991b1b;">Cancellation Policy</p>
        <p style="margin:0;font-size:13px;color:#991b1b;line-height:1.5;">Free cancellation up to <strong>24 hours</strong> before the activity. No refund within 24 hours.</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;">
      <tr><td style="padding:16px 20px;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#374151;">Need help?</p>
        <p style="margin:0;font-size:13px;color:#6b7280;">Tour questions: <strong>${providerPhone}</strong> &nbsp;|&nbsp; Support: <strong>${supportPhone}</strong></p>
        <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Ref: <strong>#${bookingRef}</strong> &nbsp;&#183;&nbsp; PIN: <strong>${data.pin}</strong></p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2937;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
    <img src="${logoUrl}" alt="${brandName}" style="height:28px;width:auto;opacity:0.7;margin-bottom:12px;" />
    <p style="margin:0;font-size:12px;color:#9ca3af;">&#169; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
    <p style="margin:6px 0 0;font-size:11px;color:#6b7280;">You received this because you booked on ${brandDomain}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Admin notification email (clean operational format) ───────────────────────

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
  const totalCharge  = data.totalAmount;
  const supplierRate = totalCharge * 0.70;
  const netProfit    = totalCharge - supplierRate;
  const bookingRef   = data.orderId.slice(-8).toUpperCase();

  let addOnsDisplay = '';
  try {
    const addOns = typeof data.metadata?.addOns === 'string' ? JSON.parse(data.metadata.addOns) : (data.metadata?.addOns || []);
    if (Array.isArray(addOns) && addOns.length > 0) {
      addOnsDisplay = addOns.map((a: any) => `${a.name} (€${a.total || a.price})`).join(', ');
    }
  } catch {}

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:0;}
  .wrap{max-width:680px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;}
  .header{background:#111827;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;}
  .badge{background:#22c55e;color:#fff;font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;}
  .section{padding:20px 28px;border-bottom:1px solid #f3f4f6;}
  .section:last-child{border-bottom:none;}
  h2{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 12px;}
  table{width:100%;border-collapse:collapse;}
  td{padding:6px 0;font-size:14px;color:#374151;vertical-align:top;}
  td:first-child{color:#9ca3af;width:140px;font-weight:600;}
  .money-table td{padding:8px 12px;border:1px solid #e5e7eb;font-size:14px;}
  .money-table th{padding:8px 12px;background:#f8fafc;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;border:1px solid #e5e7eb;text-align:left;}
  .profit{background:#f0fdf4;font-weight:800;color:#166534;}
  .ref{font-family:'Courier New',monospace;background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div>
      <p style="margin:0;font-size:18px;font-weight:800;color:#fff;">&#128222; New Booking — ${brandName}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">${data.tourTitle}</p>
    </div>
    <span class="badge">CONFIRMED &#10003;</span>
  </div>

  <div class="section">
    <h2>Booking</h2>
    <table>
      <tr><td>Reference</td><td><span class="ref">#${bookingRef}</span></td></tr>
      <tr><td>PIN</td><td><strong style="background:#fef08a;padding:2px 6px;border-radius:4px;">${data.pin}</strong></td></tr>
      <tr><td>Tour</td><td><strong>${data.tourTitle}</strong></td></tr>
      <tr><td>Date &amp; Time</td><td>${data.date} at ${data.time}</td></tr>
      <tr><td>Guests</td><td>${data.guests} total (${data.adults} Adults, ${data.students} Students)</td></tr>
      <tr><td>Site</td><td>${siteId}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Customer</h2>
    <table>
      <tr><td>Name</td><td>${data.name}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${data.email}" style="color:#3b82f6;">${data.email}</a></td></tr>
      <tr><td>Phone</td><td>${data.phone || 'N/A'}</td></tr>
      ${addOnsDisplay ? `<tr><td>Extras</td><td>${addOnsDisplay}</td></tr>` : ''}
      ${data.metadata?.pickupRequired === 'yes' ? `<tr><td>Pickup</td><td>Required at ${data.metadata.hotelName || 'hotel'}</td></tr>` : ''}
    </table>
  </div>

  <div class="section">
    <h2>Financials</h2>
    <table class="money-table">
      <tr><th>Item</th><th>Amount</th><th>Notes</th></tr>
      <tr><td>Total Charged</td><td>€${totalCharge.toFixed(2)}</td><td style="color:#9ca3af;font-size:12px;">Stripe: ${data.orderId.slice(-12)}</td></tr>
      <tr><td>Supplier Rate (70%)</td><td>€${supplierRate.toFixed(2)}</td><td style="color:#9ca3af;font-size:12px;">Payable to supplier</td></tr>
      <tr class="profit"><td>Net Profit</td><td>€${netProfit.toFixed(2)}</td><td style="font-size:12px;">Agency revenue</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Actions</h2>
    <table>
      <tr><td style="color:#22c55e;">&#10003;</td><td>Booking created in Supabase</td></tr>
      <tr><td style="color:#22c55e;">&#10003;</td><td>Confirmation email sent to customer</td></tr>
      <tr><td style="color:#9ca3af;">&#9744;</td><td>Send to supplier manifest</td></tr>
      <tr><td style="color:#9ca3af;">&#9744;</td><td>SMS reminder 24h before (scheduled)</td></tr>
    </table>
  </div>

  <div style="padding:16px 28px;background:#f8fafc;text-align:center;">
    <p style="margin:0;font-size:12px;color:#9ca3af;">Generated ${new Date().toLocaleString()} &nbsp;&#183;&nbsp; ${brandName} Admin System</p>
  </div>
</div>
</body>
</html>`;
}
