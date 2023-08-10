import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.MK, { expiresIn: "30d" });
};

export default generateToken;
