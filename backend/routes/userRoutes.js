express = require("express");
const protect = require("../middleware/authMiddleware");

router = express.Router();
const {
  userReg,
  userLogin,
  crntUser,
  viewFavourites,
  
  addFavourites,
  removeFavourites,
  check
} = require("../controlers/userControlers");

router.post("/reg", userReg);

router.post("/login", userLogin);
router.get("/crnt-user", crntUser);
router.get("/getFavourites",viewFavourites);

router.post("/addFavourites",addFavourites);
router.post("/removeFavourites",removeFavourites);
router.get("/check",check);

module.exports = router;
