import asyncHandler from "express-async-handler";
import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../config/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Vui lòng nhập tất cả các trường",
    });
  }
  const userExitst = await userModel.findOne({ email });
  if (userExitst) {
    return res.status.json({
      message: "Tài khoản đã tồn tại",
    });
  }
  const HashedPassword = await bcrypt.hash(password, 7);
  const user = await userModel.create({
    name,
    email,
    password: HashedPassword,
  });
  return res.status(200).json(user);
});

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    //   console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "Tai khoan khong ton tai",
      });
    }
    console.log("////");
    console.log(password);
    console.log(user.password);
    const comparePass = await bcrypt.compare(password, user.password);
    //   console.log(comparePass);
    if (!comparePass) {
      return res.status(400).json({
        message: "Mat khau ko dung",
      });
    }
    const token = await generateToken(user._id);
    return res.status(200).json({
      message: "danh nhap thanh cong",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          //todo $options: "i" giup ko phân biệt chữ hoa chữ thường
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log(req.user._id, "hehehe");
    const users = await userModel
      .find(keyword)
      .find({ _id: { $ne: req.user._id } });
    console.log(users);
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
