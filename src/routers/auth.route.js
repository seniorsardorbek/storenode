const router = require("express").Router();
const { userRegisterJoi, userLoginJoi, userEditJoi } = require("../utils/schemes");
const { regValidator, IsLogged } = require("../utils/validators");
const { register, getUsers, userMe, userDel, aregister, login  , edituserMe} = require("../controller/auth.controller");


const registerValid  = regValidator(userRegisterJoi)
const userEditValid  = regValidator(userEditJoi)
const loginValid  = regValidator(userLoginJoi)
router.post("/users/register", registerValid,  register);
router.post("/users/login", loginValid,  login);
router.post("/users", registerValid,  aregister);
router.get("/users?", IsLogged,  getUsers);
router.get("/users/me",IsLogged ,  userMe);
router.patch("/users/me", [IsLogged , userEditValid], edituserMe);
router.delete("/users/:id",IsLogged ,  userDel);

module.exports = router;

