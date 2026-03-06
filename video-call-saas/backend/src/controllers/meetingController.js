import { create } from '../models/meet';

const createMeeting = async (req, res) => {
  const { meetId } = req.body;
  const meeting = await create({
    meetId,
    host: req.user._id,
  });
  res.json(meeting);
};

export default { createMeeting };