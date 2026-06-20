type EmailInput = { to: string | string[]; subject: string; html: string; text?: string };

export async function sendEmail(input: EmailInput) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { skipped: true, reason: "RESEND_API_KEY or EMAIL_FROM missing" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, ...input })
  });
  if (!res.ok) throw new Error(`Email failed: ${await res.text()}`);
  return res.json();
}

export function leadEmailHtml(input: { websiteName: string; name: string; email: string; message?: string }) {
  return `<div style="font-family:Inter,Arial,sans-serif;background:#F8F6F0;padding:32px;color:#1a1a1a"><div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:28px;border:1px solid #eee"><p style="color:#9a741c;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">New lead</p><h1 style="font-family:Georgia,serif;font-size:34px;margin:8px 0">${input.websiteName}</h1><p><b>Name:</b> ${input.name}</p><p><b>Email:</b> ${input.email}</p>${input.message ? `<p><b>Message:</b> ${input.message}</p>` : ""}</div></div>`;
}

export function orderEmailHtml(input: { websiteName: string; customerName: string; total: string }) {
  return `<div style="font-family:Inter,Arial,sans-serif;background:#F8F6F0;padding:32px;color:#1a1a1a"><div style="max-width:620px;margin:auto;background:white;border-radius:24px;padding:28px;border:1px solid #eee"><p style="color:#9a741c;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">New order</p><h1 style="font-family:Georgia,serif;font-size:34px;margin:8px 0">${input.websiteName}</h1><p><b>Customer:</b> ${input.customerName}</p><p><b>Total:</b> ${input.total}</p></div></div>`;
}
