const prisma = require("../prisma");

const seed = async (numUsers = 5, numPlaylists = 10, numTracks = 20) => {
  // Step 1: Create Users
  const users = Array.from({ length: numUsers }, (_, i) => ({
    //_ is a empty placeholder
    username: `User ${i + 1}`,
  }));
  await prisma.user.createMany({ data: users });

  // Step 2: Create tracks
  const tracks = Array.from({ length: numTracks }, (_, i) => ({
    name: `Track ${i + 1}`,
  }));
  await prisma.track.createMany({ data: tracks });

  // Step 3: Create playlists
  for (let i = 0; i < numPlaylists; i++) {
    // Choose a random user as owner
    const ownerId = Math.floor(Math.random() * numUsers) + 1;

    // Select at least 8 unique random tracks for the playlist
    const trackIds = new Set(); //creates a unique collection of track IDs for each playlist
    //Set: This is a built-in JavaScript object that stores unique values. When you add an item to a Set, it will only be added if it is not already present.
    while (trackIds.size < 8) {
      //This while loop continues until the trackIds Set contains at least 8 unique track IDs.
      trackIds.add(Math.floor(Math.random() * numTracks) + 1);
    }

    // Convert Set to Array for connect
    const catalog = Array.from(trackIds).map((id) => ({ id }));

    await prisma.playlist.create({
      data: {
        name: `Playlist ${i + 1}`,
        description: `Description for playlist ${i + 1}`,
        owner: { connect: { id: ownerId } }, // Establish ownership
        tracks: { connect: catalog }, // Link tracks to the playlist
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
