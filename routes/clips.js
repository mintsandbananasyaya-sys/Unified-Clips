/* ================================================================
   routes/clips.js
   Handles all /api/clips requests.

   Currently implemented:
     GET  /api/clips          — returns approved clips, newest first
     GET  /api/clips/pending  — returns unapproved clips (staff only, stub)

   Coming next session:
     POST /api/clips          — receive an upload submission
     PATCH /api/clips/:id/approve — staff approves a clip
     POST /api/clips/:id/like     — increment like count
     POST /api/clips/:id/view     — increment view count
   ================================================================ */

const express = require("express");
const router = express.Router();
const Clip = require("../models/Clip");

/* ----------------------------------------------------------------
   GET /api/clips
   Returns all approved clips, newest first.
   Optional query params:
     ?category=pvp|diplomacy|build|chaos   (filter by category)
     ?civ=Oracles                          (filter by civilization)
     ?limit=20                             (default 50, max 100)
   ---------------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const { category, civ, limit } = req.query;

    const query = { approved: true };

    if (category && ["pvp", "diplomacy", "build", "chaos"].includes(category)) {
      query.category = category;
    }

    if (civ) {
      query.civilization = civ;
    }

    const maxLimit = Math.min(parseInt(limit) || 50, 100);

    const clips = await Clip.find(query)
      .sort({ createdAt: -1 })
      .limit(maxLimit)
      .select(
        "title civilization category uploaderUsername uploaderAvatar uploaderDiscordId videoUrl thumbnailUrl duration views likes createdAt"
      )
      .lean();

    return res.json({
      success: true,
      count: clips.length,
      clips,
    });
  } catch (err) {
    console.error("[GET /api/clips]", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load clips.",
    });
  }
});

/* ----------------------------------------------------------------
   GET /api/clips/pending
   Stub for staff review — returns unapproved clips.
   Will be protected by a staff auth middleware once auth is built.
   ---------------------------------------------------------------- */
router.get("/pending", async (req, res) => {
  try {
    const clips = await Clip.find({ approved: false })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: clips.length,
      clips,
    });
  } catch (err) {
    console.error("[GET /api/clips/pending]", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load pending clips.",
    });
  }
});

/* ----------------------------------------------------------------
   POST /api/clips
   Stub — actual upload handling (file storage, form data) comes
   once Discord auth and a file storage service are wired up.
   ---------------------------------------------------------------- */
router.post("/", async (req, res) => {
  return res.status(501).json({
    success: false,
    message: "Upload endpoint not implemented yet. Coming soon.",
  });
});

module.exports = router;