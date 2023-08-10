import chatModel from "../Models/chatModel.js";
import userModel from "../Models/userModel.js";

//todo req.user._id được lưu ở bên authMiddlwere

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        message: "Người dùng ko gửi yêu cầu",
      });
    }
    var isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          //todo kiểm tra xem trường "users" có chứa "req.user._id" không
          //todo Nếu "req.user._id" tồn tại trong mảng "users", điều kiện này sẽ trả về true.
          { users: { $elemMatch: { $eq: req.userId } } },
          //todo nhưng kiểm tra xem "req.userId" có tồn tại trong mảng "users" hay không.
        ],
      })
      .populate("users", "-password")
      .populate("lastMessage");
    isChat = await userModel.populate(isChat, {
      path: "lastMessage.sender",
      select: "name email pic",
    });
    if (isChat.length > 0) {
      res.json(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createChat = await chatModel.create(chatData);
        const FullChat = await chatModel
          .findOne({ _id: createChat._id })
          .populate("users", "-password");
        res.status(200).json(FullChat);
      } catch (error) {
        return res.status(400).json(error.message);
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const fetchChat = (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage")
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "lastMessage.sender",
          select: "name email pic",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({
        message: "Vui lòng nhập tất cả các trường",
      });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(400).json({
        message:
          "Cần có hơn 2 người dùng để tạo thành một cuộc trò chuyện nhóm",
      });
    }
    users.push(req.user);
    try {
      const groupChat = await chatModel.create({
        chatName: req.body.name,
        users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
      const fullGroupChat = await chatModel
        .findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json({
        message: "Tạo chat thành công",
        fullGroupChat,
      });
    } catch (error) {}
  } catch (error) {}
};

export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updateChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName: chatName,
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updateChat) {
      return res.status(400).json({
        message: "không tìm thất chat",
      });
    } else {
      res.status(200).json(updateChat);
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const addGroup = async (req, res) => {
  try {
    const { chatId, idUser } = req.body;
    const added = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $push: {
            users: idUser,
          },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({
        message: "người dùng không tồn tại",
      });
    }
    return res.status(200).json(added);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const removegroup = async (req, res) => {
  try {
    const { idChat, idUser } = req.body;
    const remove = await chatModel
      .findByIdAndUpdate(
        idChat,
        {
          $pull: { users: idUser },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!remove) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }
    return res.status(200).json(remove);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
