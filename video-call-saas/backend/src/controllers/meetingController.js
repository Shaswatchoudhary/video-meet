import Meet from '../models/meet.js';
import User from '../models/User.js';
import { generateStreamToken } from '../services/streamService.js';

// Start Instant Meeting
export const createMeeting = async (req, res) => {
  try {
    const { meetId, title } = req.body;
    const meeting = await Meet.create({
      meetId,
      title: title || "Instant Meeting",
      host: req.user._id,
      participants: [req.user._id]
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

// Join Meeting
export const joinMeeting = async (req, res) => {
  try {
    const { meetId } = req.body;
    const meeting = await Meet.findOne({ meetId, isActive: true });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found or inactive" });
    }

    // Add participant if not already in
    if (!meeting.participants.includes(req.user._id)) {
      meeting.participants.push(req.user._id);
      await meeting.save();
    }

    res.json({
      message: "Successfully joined meeting",
      meetId: meeting.meetId,
      title: meeting.title,
      token: generateStreamToken(req.user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule Meeting
export const scheduleMeeting = async (req, res) => {
  try {
    const { meetId, title, scheduledAt } = req.body;
    const meeting = await Meet.create({
      meetId,
      title,
      scheduledAt,
      host: req.user._id,
      isActive: true
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Upcoming Meetings
export const getUpcomingMeetings = async (req, res) => {
  try {
    const meetings = await Meet.find({
      host: req.user._id,
      scheduledAt: { $gte: new Date() }
    }).sort({ scheduledAt: 1 });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Recent Meetings
export const getRecentMeetings = async (req, res) => {
  try {
    const meetings = await Meet.find({
      $or: [
        { host: req.user._id },
        { participants: req.user._id }
      ],
      scheduledAt: { $lt: new Date() }
    }).sort({ scheduledAt: -1 }).limit(10);

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};