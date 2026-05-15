import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const DISCORD_GUILD_ID = "1369832704102633554";
const ELDER_MEMBER_ROLE_ID = "1369835461551456347";
const OFFICER_ROLE_ID = "1369836381647405067";
const APPLICANT_ROLE_ID = "1501943775021371543";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { provider_token, discord_id, user_id, discord_username, discord_avatar } = body;

    if (!discord_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing discord_id or user_id", is_elder_member: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let isElderMember = false;
    let isOfficer = false;
    let isApplicant = false;
    let method = "none";
    let userRoles: string[] = [];

    // Method 1: Use provider_token (OAuth Bearer token) to check guild membership
    if (provider_token) {
      try {
        const response = await fetch(
          `https://discord.com/api/v10/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
          {
            headers: { Authorization: `Bearer ${provider_token}` },
          }
        );

        if (response.ok) {
          const member = await response.json();
          userRoles = member.roles ?? [];
          isElderMember = userRoles.includes(ELDER_MEMBER_ROLE_ID);
          isOfficer = userRoles.includes(OFFICER_ROLE_ID);
          isApplicant = userRoles.includes(APPLICANT_ROLE_ID);
          method = "provider_token";
        } else {
          const errText = await response.text();
          console.error("Discord API with Bearer token failed:", response.status, errText);
        }
      } catch (err) {
        console.error("Error with provider_token method:", err);
      }
    }

    // Method 2: Use bot token if needed
    if (method === "none") {
      const botToken = Deno.env.get("DISCORD_BOT_TOKEN");
      if (botToken) {
        try {
          const response = await fetch(
            `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discord_id}`,
            {
              headers: { Authorization: `Bot ${botToken}` },
            }
          );

          if (response.ok) {
            const member = await response.json();
            userRoles = member.roles ?? [];
            isElderMember = userRoles.includes(ELDER_MEMBER_ROLE_ID);
            isOfficer = userRoles.includes(OFFICER_ROLE_ID);
            isApplicant = userRoles.includes(APPLICANT_ROLE_ID);
            method = "bot_token";
          } else {
            const errText = await response.text();
            console.error("Discord API with Bot token failed:", response.status, errText);
          }
        } catch (err) {
          console.error("Error with bot_token method:", err);
        }
      }
    }

    // Method 3: Use client credentials
    if (method === "none") {
      const clientId = Deno.env.get("DISCORD_CLIENT_ID");
      const clientSecret = Deno.env.get("DISCORD_CLIENT_SECRET");
      if (clientId && clientSecret) {
        try {
          const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "client_credentials",
              scope: "guilds.members.read",
              client_id: clientId,
              client_secret: clientSecret,
            }),
          });

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            const response = await fetch(
              `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discord_id}`,
              {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
              }
            );

            if (response.ok) {
              const member = await response.json();
              userRoles = member.roles ?? [];
              isElderMember = userRoles.includes(ELDER_MEMBER_ROLE_ID);
              isOfficer = userRoles.includes(OFFICER_ROLE_ID);
              isApplicant = userRoles.includes(APPLICANT_ROLE_ID);
              method = "client_credentials";
            }
          }
        } catch (err) {
          console.error("Error with client_credentials method:", err);
        }
      }
    }

    console.log(`Role check result: isElderMember=${isElderMember}, isOfficer=${isOfficer}, isApplicant=${isApplicant}, method=${method}, discord_id=${discord_id}`);

    // Upsert member into database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const checkResponse = await fetch(
      `${supabaseUrl}/rest/v1/members?discord_id=eq.${discord_id}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const existing = await checkResponse.json();

    if (existing && existing.length > 0) {
      await fetch(
        `${supabaseUrl}/rest/v1/members?discord_id=eq.${discord_id}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            id: user_id,
            discord_username,
            discord_avatar: discord_avatar || null,
            is_elder_member: isElderMember,
            updated_at: new Date().toISOString(),
          }),
        }
      );
    } else {
      await fetch(`${supabaseUrl}/rest/v1/members`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          id: user_id,
          discord_id,
          discord_username,
          discord_avatar: discord_avatar || null,
          is_elder_member: isElderMember,
        }),
      });
    }

    return new Response(
      JSON.stringify({
        is_elder_member: isElderMember,
        is_officer: isOfficer,
        is_applicant: isApplicant,
        method
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: String(err), is_elder_member: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
