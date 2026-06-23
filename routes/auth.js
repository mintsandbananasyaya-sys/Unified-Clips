/* ================================================================
   routes/auth.js
   Discord OAuth login — checks the user is in your Discord server
   before allowing a session.
   ================================================================ */

const express = require("express");
const router = express.Router();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_GUILD_ID,
  DISCORD_CALLBACK_URL,
} = process.env;

/* ----------------------------------------------------------------
   GET /auth/discord
   Sends the user to Discord's OAuth consent screen.
   ---------------------------------------------------------------- */
router.get("/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_CALLBACK_URL,
    response_type: "code",
    scope: "identify guilds",
  });

  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
});

/* ----------------------------------------------------------------
   GET /auth/discord/callback
   Discord redirects here with a ?code=... after the user approves.
   ---------------------------------------------------------------- */
router.get("/discord/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect("/?auth=cancelled");
  }

  try {
    // 1. Exchange the code for an access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_CALLBACK_URL,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("[auth] Token exchange failed:", tokenData);
      return res.redirect("/?auth=error");
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch the user's identity
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userRes.json();

    // 3. Fetch the user's guild list, check they're in your server
    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const guildsData = await guildsRes.json();

    const isInGuild =
      Array.isArray(guildsData) &&
      guildsData.some((g) => g.id === DISCORD_GUILD_ID);

    if (!isInGuild) {
      return res.redirect("/?auth=not_in_server");
    }

    // 4. Build the session user object
    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
      : null;

    req.session.user = {
      id: userData.id,
      username: userData.username,
      avatar: avatarUrl,
    };

    return res.redirect("/?auth=success");
  } catch (err) {
    console.error("[auth] Discord callback error:", err);
    return res.redirect("/?auth=error");
  }
});

/* ----------------------------------------------------------------
   GET /auth/me
   Returns the current session's user, or null.
   ---------------------------------------------------------------- */
router.get("/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

/* ----------------------------------------------------------------
   POST /auth/logout
   ---------------------------------------------------------------- */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

module.exports = router;