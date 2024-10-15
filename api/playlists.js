const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// TODO: routes!

// GET /playlists - Retrieve all playlists
router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

// POST /playlists - Create a new playlist
router.post("/", async (req, res, next) => {
  const { name, description, ownerId, trackIds } = req.body; 
  try {
    
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        owner: { connect: { id: ownerId } }, // Link to owner
        tracks: { connect: trackIds.map((id) => ({ id })) }, // Link tracks
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});

// GET /playlists/:id - Retrieve a specific playlist by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    // We can throw an error instead of checking for a null restaurant
    const playlist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +id },
      include: { tracks: true }, // Include tracks in the response
    });
    res.json(playlist);
  } catch (e) {
    next(e); //sending error to the next part of the code
  }
});
