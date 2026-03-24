import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone_number, user_name } = await req.json();

    if (!phone_number || !user_name) {
      return new Response(
        JSON.stringify({ error: "phone_number and user_name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Phone number arrives pre-formatted from the frontend with the correct dial code.
    // Strip any non-digit/+ characters and ensure it starts with +.
    let formattedPhone = phone_number.trim().replace(/[\s\-().]/g, "");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    const yaziApiKey = Deno.env.get("YAZI_API_KEY");
    if (!yaziApiKey) {
      return new Response(
        JSON.stringify({ error: "YAZI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const yaziResponse = await fetch("https://api.askyazi.com/v1/jobs", {
      method: "POST",
      headers: {
        "x-api-key": yaziApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        configurationId: "3934e9dc-3974-4e62-9f8b-7706ce717014",
        phoneNumber: formattedPhone,
        variables: {
          name: user_name,
        },
      }),
    });

    const yaziData = await yaziResponse.json();

    return new Response(JSON.stringify(yaziData), {
      status: yaziResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
