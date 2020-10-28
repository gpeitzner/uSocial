const friendSchema = require("../models/friend");
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

module.exports = friend;
