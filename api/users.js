const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// TODO: routes!
//Gets Array of all users
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

//Gets specific user, including all owned playlists
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    // We can throw an error instead of checking for a null restaurant
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
      include: { playlists: true },
    });
    res.json(user);
  } catch (e) {
    next(e); //sending error to the next part of the code
  }
});


