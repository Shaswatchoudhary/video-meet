import { Schema, model } from "mongoose";


const meetSchema = new Schema({

  meetId: {
    type: String,
    required: true,
    unique: true,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default model("Meet", meetSchema);
// module.exports = Meeting; //this is just for type checking means if i use this in another file then i can use this type checking