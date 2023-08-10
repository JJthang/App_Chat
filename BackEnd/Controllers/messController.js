import chatModel from "../Models/chatModel.js";
import messModel from "../Models/messModel.js";
import userModel from "../Models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res.status(400).json({
        message: "Invalid data passed into request",
      });
    }
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    var message = await messModel.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    // console.log(message);
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    console.log(message);

    await chatModel.findByIdAndUpdate(chatId, { lastMessage: message });
    return res.status(200).json({
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllMess = async (req, res) => {
  try {
    const message = await messModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name email pic")
      .populate("chat");
    return res.status(200).json({
      data: message,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
