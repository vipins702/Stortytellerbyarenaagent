export async function verifyVercelDomain(hostname: string) {
  if (!process.env.VERCEL_API_TOKEN || !process.env.VERCEL_PROJECT_ID) {
    return {
      configured: false,
      verified: false,
      message: "Add VERCEL_API_TOKEN and VERCEL_PROJECT_ID to enable live Vercel domain verification."
    };
  }

  const headers = { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`, "Content-Type": "application/json" };
  const projectId = process.env.VERCEL_PROJECT_ID;

  await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: hostname })
  }).catch(() => null);

  const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains/${hostname}`, { headers, cache: "no-store" });
  if (!res.ok) {
    return { configured: true, verified: false, message: "Domain is not verified yet. Confirm DNS records and try again." };
  }
  const data = await res.json();
  return {
    configured: true,
    verified: Boolean(data.verified || data.apexName || data.name),
    message: data.verified ? "Domain verified." : "Domain added. DNS verification may still be pending.",
    raw: data
  };
}
