const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = await User.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
    // Send without password
    const { password, ...otherDetails } = user.toObject();
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        ...otherDetails,
        token,
      });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// get user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const { password, ...otherDetails } = user._doc;
    res.status(200).json({ ...otherDetails });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Send without password
    const allUsers = users.map((user) => {
      const { password, ...otherDetails } = user.toObject();
      return otherDetails;
    });
    const count = await User.countDocuments();
    res.status(200).json({ users: allUsers, count });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, profileImg } = req.body;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          profileImg,
          password: hash,
        },
        {
          new: true,
        }
      );
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.SECRET,
        { expiresIn: "7d" }
      );
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user);
    } else {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          profileImg,
        },
        {
          new: true,
        }
      );
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
