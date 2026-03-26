import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { error: "GOOGLE_SCRIPT_URL not configured" },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await request.text();
    console.log("[rsvp] POST body received:", body);

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body,
      redirect: "follow",
    });

    const data = await response.text();
    console.log("[rsvp] Google Apps Script response status:", response.status);
    console.log("[rsvp] Google Apps Script response body:", data);

    return new NextResponse(data, {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error forwarding POST to Google Apps Script:", error);
    return NextResponse.json(
      { error: "Failed to reach Google Apps Script" },
      { status: 502, headers: corsHeaders }
    );
  }
}

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { error: "GOOGLE_SCRIPT_URL not configured" },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const response = await fetch(`${scriptUrl}?action=get_attendees`);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error forwarding GET to Google Apps Script:", error);
    return NextResponse.json(
      { error: "Failed to reach Google Apps Script" },
      { status: 502, headers: corsHeaders }
    );
  }
}
