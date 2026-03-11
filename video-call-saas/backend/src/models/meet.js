import { Schema, model } from "mongoose";


const meetSchema = new Schema({

  meetId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    default: "Untitled Meeting"
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  scheduledAt: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default model("Meet", meetSchema);
// module.exports = Meeting; //this is just for type checking means if i use this in another file then i can use this type checking