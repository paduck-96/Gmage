import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  socialKakao: { type: Boolean, default: false },
  nickname: { type: String },
  image_url: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
