const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

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
    avatar: Joi.string().required().min(2).regex(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i),
  }),
});
const validationParams = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

router.get("/", getUsers);
router.get("/me", setCurrentUser, validationParams, getUserById);
router.patch("/me", validationBodyPatchMe, setCurrentUser, updateProfile);
router.patch("/me/avatar", validationBodyPatchAvatar, updateAvatar);
router.get("/:userId", validationParams, getUserById);

module.exports = router;
