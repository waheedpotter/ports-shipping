import nodemailer from 'nodemailer';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface BookingData {
  confirmationNumber: string;
  token?: string | null;
  bookingParty: string;
  bookingPartyEmail: string;
  rotationNumber: string;
  status: string;
  createdAt: Date;
}

interface ContainerData {
  sortOrder: number;
  pol: string;
  pod: string;
  line?: string | null;
  containerNumber: string;
  chk?: string | null;
  iso: string;
  podAgentName?: string | null;
  email?: string | null;
  mub?: string | null;
  imco?: string | null;
  unMo?: string | null;
  temperature?: string | null;
  vgmWeight?: number | null;
  uom: string;
}

interface VoyageRefData {
  voyageRef: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Transporter (lazy singleton)
// ────────────────────────────────────────────────────────────────────────────

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// HTML Builder
// ────────────────────────────────────────────────────────────────────────────

function buildContainerRows(containers: ContainerData[]): string {
  return containers
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(
      (c, i) => `
      <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9f5ef'};">
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.sortOrder || i + 1}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.pol}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.pod}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.line ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;font-weight:600;">${c.containerNumber}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.chk ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.iso}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.podAgentName ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.email ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.mub ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.imco ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.unMo ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.temperature ?? '—'}</td>
        <td style="padding:8px 10px;border:1px solid #ddd;">${c.vgmWeight != null ? `${c.vgmWeight} ${c.uom}` : '—'}</td>
      </tr>`,
    )
    .join('');
}

function buildEmailHtml(
  booking: BookingData,
  containers: ContainerData[],
  voyageRef: VoyageRefData,
): string {
  const formattedDate = new Date(booking.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation – ${booking.confirmationNumber}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">

          <!-- Header -->
          <tr>
            <td style="background:#8B0000;padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color:#C9A84C;font-size:22px;font-weight:700;letter-spacing:1px;">PORTS SHIPPING LLC</div>
                    <div style="color:#ffffff;font-size:12px;margin-top:2px;opacity:.85;">Connecting the World, Port by Port</div>
                  </td>
                  <td align="right">
                    <div style="background:#C9A84C;color:#8B0000;font-size:13px;font-weight:700;padding:6px 14px;border-radius:4px;">BOOKING CONFIRMED</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="background:#C9A84C;padding:14px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#8B0000;font-size:14px;font-weight:700;">Confirmation No:</td>
                  <td align="right" style="color:#8B0000;font-size:20px;font-weight:700;letter-spacing:2px;">${booking.confirmationNumber}</td>
                </tr>
                <tr>
                  <td style="color:#8B0000;font-size:13px;font-weight:700;padding-top:4px;">Booking Token / Ref:</td>
                  <td align="right" style="color:#8B0000;font-size:16px;font-weight:700;letter-spacing:1px;padding-top:4px;font-family:monospace;">${booking.token ?? '—'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 8px 0;color:#333;font-size:15px;">Dear <strong>${booking.bookingParty}</strong>,</p>
              <p style="margin:0 0 24px 0;color:#555;font-size:14px;">Your booking has been successfully confirmed with token <strong>${booking.token ?? '—'}</strong>. Please find the complete details below.</p>

              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td style="background:#8B0000;color:#fff;font-size:12px;font-weight:700;padding:8px 12px;text-transform:uppercase;letter-spacing:.5px;" colspan="4">
                    Booking &amp; Client Details
                  </td>
                </tr>
                <tr style="background:#f9f5ef;">
                  <td style="padding:9px 12px;font-size:12px;color:#888;width:25%;border:1px solid #e5e5e5;">Confirmation #</td>
                  <td style="padding:9px 12px;font-size:13px;color:#8B0000;font-weight:700;border:1px solid #e5e5e5;">${booking.confirmationNumber}</td>
                  <td style="padding:9px 12px;font-size:12px;color:#888;width:25%;border:1px solid #e5e5e5;">Token Number</td>
                  <td style="padding:9px 12px;font-size:13px;color:#8B0000;font-weight:700;font-family:monospace;border:1px solid #e5e5e5;">${booking.token ?? '—'}</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;font-size:12px;color:#888;width:25%;border:1px solid #e5e5e5;">Booking Party (Client)</td>
                  <td style="padding:9px 12px;font-size:13px;color:#222;font-weight:600;border:1px solid #e5e5e5;">${booking.bookingParty}</td>
                  <td style="padding:9px 12px;font-size:12px;color:#888;width:25%;border:1px solid #e5e5e5;">Client Email</td>
                  <td style="padding:9px 12px;font-size:13px;color:#222;border:1px solid #e5e5e5;">${booking.bookingPartyEmail}</td>
                </tr>
                <tr style="background:#f9f5ef;">
                  <td style="padding:9px 12px;font-size:12px;color:#888;border:1px solid #e5e5e5;">Voyage Reference</td>
                  <td style="padding:9px 12px;font-size:13px;color:#222;font-weight:600;border:1px solid #e5e5e5;">${voyageRef.voyageRef}</td>
                  <td style="padding:9px 12px;font-size:12px;color:#888;border:1px solid #e5e5e5;">Rotation Number</td>
                  <td style="padding:9px 12px;font-size:13px;color:#222;border:1px solid #e5e5e5;">${booking.rotationNumber}</td>
                </tr>
                <tr>
                  <td style="padding:9px 12px;font-size:12px;color:#888;border:1px solid #e5e5e5;">Status</td>
                  <td style="padding:9px 12px;font-size:13px;color:#1a7a1a;font-weight:700;border:1px solid #e5e5e5;">${booking.status}</td>
                  <td style="padding:9px 12px;font-size:12px;color:#888;border:1px solid #e5e5e5;">Date &amp; Time</td>
                  <td style="padding:9px 12px;font-size:13px;color:#222;border:1px solid #e5e5e5;">${formattedDate}</td>
                </tr>
              </table>

              <!-- Container Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;">
                <tr>
                  <td style="background:#8B0000;color:#fff;font-size:12px;font-weight:700;padding:8px 10px;text-transform:uppercase;letter-spacing:.5px;" colspan="14">
                    Container Details (${containers.length} container${containers.length !== 1 ? 's' : ''})
                  </td>
                </tr>
                <tr style="background:#f0e8d8;">
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">#</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">POL</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">POD</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">Code Shipping Line</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">Container No</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">CHK</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">ISO</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">POD Agent</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">Email</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">MOB No.</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">IMCO</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">UN MO</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">Temp</th>
                  <th style="padding:7px 10px;border:1px solid #ddd;text-align:left;white-space:nowrap;">VGM Wt</th>
                </tr>
                ${buildContainerRows(containers)}
              </table>

              <!-- Footer Note -->
              <p style="margin:24px 0 0 0;color:#888;font-size:12px;line-height:1.6;">
                This is an automated confirmation email. Please retain this email for your records.<br/>
                For any queries, contact our operations team at <a href="mailto:${process.env.FROM_EMAIL ?? 'ops@portsshipping.com'}" style="color:#8B0000;">${process.env.FROM_EMAIL ?? 'ops@portsshipping.com'}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#222;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:11px;">© ${new Date().getFullYear()} Ports Shipping LLC. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────────

export async function sendBookingConfirmation(
  booking: BookingData,
  containers: ContainerData[],
  voyageRef: VoyageRefData,
): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn(
      '[email] SMTP not configured — skipping booking confirmation email. ' +
        'Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local to enable.',
    );
    return;
  }

  const fromEmail = process.env.FROM_EMAIL ?? 'noreply@portsshipping.com';
  const fromName = process.env.FROM_NAME ?? 'Ports Shipping LLC';
  const adminEmail = process.env.ADMIN_EMAIL;

  const subject = `Booking Confirmed [${booking.confirmationNumber}] - Token: ${booking.token ?? 'N/A'} | Ports Shipping LLC`;
  const htmlBody = buildEmailHtml(booking, containers, voyageRef);

  const recipients: string[] = [booking.bookingPartyEmail];
  if (adminEmail && !recipients.includes(adminEmail)) {
    recipients.push(adminEmail);
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: recipients.join(', '),
      subject,
      html: htmlBody,
    });
    console.log(`[email] Confirmation sent for ${booking.confirmationNumber} → ${recipients.join(', ')}`);
  } catch (err) {
    console.error('[email] Failed to send booking confirmation:', err);
    // Do not rethrow — email failure should not abort the booking
  }
}
