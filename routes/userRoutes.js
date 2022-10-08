const {
  Register,
  Login,
  getUser,
  updateUser,
} = require("../controller/userController");

const router = require("express").Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);

module.exports = router;
