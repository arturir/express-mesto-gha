const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

const setCurrentUser = function (req, res, next) {
  req.params.userId = req.user;
  next();
};
const validationBodyPatchMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
});
const validationBodyPatchAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2),
  }),
});
const validationParams = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

router.get("/", getUsers);
router.get("/:userId", validationParams, getUserById);
router.patch("/me", validationBodyPatchMe, setCurrentUser, updateProfile);
router.patch("/me/avatar", validationBodyPatchAvatar, updateAvatar);

module.exports = router;
