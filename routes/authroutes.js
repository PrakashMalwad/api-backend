const express = require("express");
const { registerUser, loginUser, protectedRoute } = require("../controllers/authcontroller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", protectedRoute);

module.exports = router;
