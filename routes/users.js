const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const regExpUrl = require("../regexp/url");

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

const setCurrentUser = function (req, res, next) {
  req.params.userId = req.user._id;
  next();
};
const validationBodyPatchMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
const validationBodyPatchAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).regex(regExpUrl),
  }),
});
const validationParams = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

router.get("/", getUsers);
router.get("/me", setCurrentUser, getUserById);
router.patch("/me", validationBodyPatchMe, setCurrentUser, updateProfile);
router.patch("/me/avatar", validationBodyPatchAvatar, updateAvatar);
router.get("/:userId", validationParams, getUserById);

module.exports = router;
