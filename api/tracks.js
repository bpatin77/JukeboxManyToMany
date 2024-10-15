const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// GET /tracks - Retrieve all tracks
router.get("/", async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

// GET /tracks/:id - Retrieve a specific track by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const track = await prisma.track.findUniqueOrThrow({
      where: { id: +id },
      include: { playlists: true }, // Include playlists if needed
    });

    res.json(track);
  } catch (e) {
    next(e);
  }
});
