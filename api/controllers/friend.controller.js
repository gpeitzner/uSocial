const friendSchema = require("../models/friend");
const userSchema = require("../models/user");
const friend = {};

friend.addFriend = async (req, res) => {
  const { username, friend } = req.body;
  try {
    const newFriend = new friendSchema({
      username: username,
      friend: friend,
    });
    const result = await newFriend.save();
    res.json(result);
  } catch (error) {
    res.json({ error: "something go wrong" });
  }
};

friend.listUnknows = async (req, res) => {
  const username = req.params.id;
  try {
    const currentFriends = await friendSchema.find(
      { username: username },
      { friend: 1, _id: 0 }
    );
    const finalFriends = currentFriends.map((tmp) => tmp.friend);
    const results = await userSchema.find(
      { user: { $not: { $in: [username, ...finalFriends] } } },
      { user: 1, image: 1, _id: 0 }
    );
    res.json(results);
  } catch (error) {
    res.json({ error: "something go wrong" });
  }
};

friend.listKnows = async (req, res) => {
  const username = req.params.id;
  try {
    const currentFriends = await friendSchema.find(
      { username: username },
      { friend: 1, _id: 0 }
    );
    const finalFriends = currentFriends.map((tmp) => tmp.friend);
    const results = await userSchema.find(
      { user: { $in: finalFriends } },
      { user: 1, image: 1, _id: 0 }
    );
    res.json(results);
  } catch (error) {
    res.json({ error: "something go wrong" });
  }
};

module.exports = friend;
