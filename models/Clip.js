/* ================================================================
   models/Clip.js
   Mongoose schema for a single clip document in MongoDB.
   ================================================================ */

const mongoose = require("mongoose");

const clipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    civilization: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["pvp", "diplomacy", "build", "chaos"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    uploaderUsername: {
      type: String,
      required: true,
      trim: true,
    },

    uploaderDiscordId: {
      type: String,
      default: null,
    },

    uploaderAvatar: {
      type: String,
      default: null,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    duration: {
      type: String,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

clipSchema.index({ approved: 1, createdAt: -1 });

module.exports = mongoose.model("Clip", clipSchema);