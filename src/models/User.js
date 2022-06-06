import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  user_id: { type: Number },
  socialKakao: { type: Boolean, default: false },
  nickname: { type: String, required: true, unique: true },
  image_url: { type: String },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
