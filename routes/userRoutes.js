const {
  Register,
  Login,
  getUser,
  updateUser,
  getAllUsers,
  updateUserStatus,
} = require("../controller/userController");
const { verifyAdmin } = require("../utils/Verify");

const router = require("express").Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/user/:id", getUser);
router.get("/users/:id", getAllUsers);
router.put("/user/:id", updateUser);
router.put("/status/:uid/:id", verifyAdmin, updateUserStatus);

module.exports = router;
