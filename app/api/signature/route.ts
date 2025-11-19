export const dynamic = "force-dynamic";

import { connectMongo } from "@/lib/mongoose";
import { Member } from "@/models/member";

function absUrl(path: string, reqUrl: string) {
  return new URL(path, reqUrl).href;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = String(url.searchParams.get("email") ?? "")
    .trim()
    .toLowerCase();
  const token = request.headers.get("x-sig-auth") ?? "";

  if (
    !process.env.SIGNATURE_API_SECRET ||
    token !== process.env.SIGNATURE_API_SECRET
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!email) {
    return new Response("Email is required", { status: 400 });
  }

  await connectMongo();
  const doc = await Member.findOne({ email }).lean();

  if (!doc) {
    return new Response("", { status: 404 });
  }
  if (!doc.signatureEnabled) {
    return new Response("", { status: 200 });
  }

  const fullName = `${doc.firstName} ${doc.lastName}`.trim();
  const designation = doc.designation;
  const phoneNumber = doc.phoneNumber;

  const simtechLogo = absUrl("/img/simtech-logo.png", request.url);
  const isoLogo = absUrl("/img/iso-logo.png", request.url);

  const html = `
<!-- SimTech Signature -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; color: #222;">
  <tr>
    <td style="padding: 8px 0;">
      <img src="${simtechLogo}" alt="SimTech" style="display:inline-block; vertical-align:middle; height:48px;" />
      <span style="display:inline-block; vertical-align:middle; margin-left:12px; font-size:16px; font-weight:bold;">${fullName}</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 2px 0; font-size:13px; color:#555;">${designation}</td>
  </tr>
  <tr>
    <td style="padding: 2px 0; font-size:13px; color:#555;">Phone: <a href="tel:${phoneNumber}" style="color:#0a66c2; text-decoration:none;">${phoneNumber}</a></td>
  </tr>
  <tr>
    <td style="padding-top:10px;">
      <img src="${isoLogo}" alt="ISO Certified" style="display:inline-block; height:24px; vertical-align:middle;" />
    </td>
  </tr>
</table>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*", // Add this for Outlook add-ins
      "Access-Control-Allow-Headers": "x-sig-auth, Content-Type",
    },
  });
}
