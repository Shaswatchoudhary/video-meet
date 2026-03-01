const Meet = require('../models/meet');

const createMeeting = async (req, res) => {
  const { meetId } = req.body;
  const meeting = await Meet.create({
    meetId,
    host: req.user._id,
  });
  res.json(meeting);
};

module.exports = { createMeeting };