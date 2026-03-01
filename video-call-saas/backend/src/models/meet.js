const mongoose = require("mongoose");


const meetSchema = new mongoose.Schema({

  meetId: {
    type: String,
    required: true,
    unique: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Meet", meetSchema);
// module.exports = Meeting; //this is just for type checking means if i use this in another file then i can use this type checking