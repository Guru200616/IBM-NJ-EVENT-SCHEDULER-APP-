import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
});

export default mongoose.model("Event", EventSchema);
