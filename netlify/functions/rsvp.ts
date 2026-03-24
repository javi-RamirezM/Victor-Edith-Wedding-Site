import { Handler } from "@netlify/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "GOOGLE_SCRIPT_URL not configured" }),
    };
  }

  if (event.httpMethod === "POST") {
    try {
      // Google Apps Script redirects POST requests. We must follow the redirect
      // keeping the POST method and body, otherwise Node fetch converts it to GET
      // and the body (with all form fields) is lost.
      console.log("[rsvp] POST body received:", event.body);
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: event.body || "",
        redirect: "follow",
      });
      const data = await response.text();
      console.log("[rsvp] Google Apps Script response status:", response.status);
      console.log("[rsvp] Google Apps Script response body:", data);
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: data,
      };
    } catch (error) {
      console.error("Error forwarding POST to Google Apps Script:", error);
      return {
        statusCode: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to reach Google Apps Script" }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    try {
      const response = await fetch(`${scriptUrl}?action=get_attendees`);
      const data = await response.text();
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: data,
      };
    } catch (error) {
      console.error("Error forwarding GET to Google Apps Script:", error);
      return {
        statusCode: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to reach Google Apps Script" }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};

export { handler };
