import Meet from '../models/meet';
import streamService from '../services/streamService';

const { generateStreamToken } = streamService;

const createMeeting = async (req, res) => {
  try {
    const { meetId } = req.body;
    const meeting = await Meet.create({
      meetId,
      host: req.user._id,
    });

    res.json({
      ...meeting._doc,
      message: "Meeting created successfully",
      token: generateStreamToken(req.user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export default createMeeting;