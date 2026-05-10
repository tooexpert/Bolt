import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const DISCORD_GUILD_ID = "1369832704102633554";
const ELDER_APPLICANT_ROLE_ID = "1501943775021371543";

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
    const botToken = Deno.env.get("DISCORD_BOT_TOKEN");
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: "DISCORD_BOT_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch all channels in the guild
    const channelsRes = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/channels`,
      { headers: { Authorization: `Bot ${botToken}` } }
    );

    if (!channelsRes.ok) {
      const errText = await channelsRes.text();
      console.error("Failed to fetch channels:", channelsRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Discord channels" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const channels = await channelsRes.json();

    // Find ticket channels - typically under a ticket category or named with "ticket" or "application"
    // Discord ticket bot channels are usually text channels under a category
    const ticketChannels = channels.filter(
      (ch: any) =>
        ch.type === 0 && // GUILD_TEXT
        (ch.name?.toLowerCase().includes("ticket") ||
          ch.name?.toLowerCase().includes("application") ||
          ch.name?.toLowerCase().includes("apply") ||
          ch.topic?.toLowerCase().includes("ticket") ||
          ch.topic?.toLowerCase().includes("application"))
    );

    let synced = 0;
    let skipped = 0;

    for (const channel of ticketChannels) {
      // Get messages in this channel to find the application content
      const messagesRes = await fetch(
        `https://discord.com/api/v10/channels/${channel.id}/messages?limit=10`,
        { headers: { Authorization: `Bot ${botToken}` } }
      );

      let applicationContent = "";
      let applicantDiscordId = "";
      let applicantUsername = "";
      let applicantAvatar = "";

      if (messagesRes.ok) {
        const messages = await messagesRes.json();
        // Find the first message from the applicant (not the bot)
        for (const msg of messages) {
          // Skip bot messages
          if (msg.author?.bot) continue;

          // Check if the message author has the Elder Applicant role
          const hasApplicantRole = msg.member?.roles?.includes(ELDER_APPLICANT_ROLE_ID);

          if (hasApplicantRole || !msg.author?.bot) {
            applicantDiscordId = msg.author?.id || "";
            applicantUsername = msg.author?.username || "";
            applicantAvatar = msg.author?.avatar
              ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
              : "";

            if (!applicationContent && msg.content) {
              applicationContent = msg.content;
            }

            if (applicantDiscordId) break;
          }
        }

        // If we didn't find a non-bot message, use the first message content
        if (!applicationContent && messages.length > 0) {
          applicationContent = messages[0].content || "";
          if (!applicantDiscordId && messages[0].author) {
            applicantDiscordId = messages[0].author.id || "";
            applicantUsername = messages[0].author.username || "";
            applicantAvatar = messages[0].author?.avatar
              ? `https://cdn.discordapp.com/avatars/${messages[0].author.id}/${messages[0].author.avatar}.png`
              : "";
          }
        }
      }

      if (!applicantDiscordId) {
        skipped++;
        continue;
      }

      // Check if this ticket already exists in our database
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/applications?ticket_channel_id=eq.${channel.id}`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const existing = await checkRes.json();

      if (existing && existing.length > 0) {
        // Update existing record
        await fetch(
          `${supabaseUrl}/rest/v1/applications?ticket_channel_id=eq.${channel.id}`,
          {
            method: "PATCH",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              discord_username: applicantUsername,
              discord_avatar: applicantAvatar || null,
              ticket_channel_name: channel.name,
              application_content: applicationContent || null,
              updated_at: new Date().toISOString(),
            }),
          }
        );
      } else {
        // Insert new record
        await fetch(`${supabaseUrl}/rest/v1/applications`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            discord_id: applicantDiscordId,
            discord_username: applicantUsername,
            discord_avatar: applicantAvatar || null,
            ticket_channel_id: channel.id,
            ticket_channel_name: channel.name,
            application_content: applicationContent || null,
            status: "pending",
          }),
        });
      }

      synced++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced,
        skipped,
        total_channels: channels.length,
        ticket_channels_found: ticketChannels.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Sync applications error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
