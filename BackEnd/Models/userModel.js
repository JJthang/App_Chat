import mongoose from "mongoose";

const userSchame = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  pic: {
    type: String,
    default:
      "https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-6/321739562_554378819603569_8247440697142026329_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=NmGkPqrgzsEAX-E3kFJ&_nc_ht=scontent.fhan5-9.fna&oh=00_AfCZNJxNIceqp0yU163AE6cRTprqS4A8oWKPER8ZicAieg&oe=64C8AD89",
  },
});

export default mongoose.model("User", userSchame);
