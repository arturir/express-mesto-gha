const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require("../controllers/cards");

const validationBodyCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2),
  }),
});
const validationParams = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

router.get("/", getCards);
router.delete("/:cardId", validationParams, deleteCard);
router.post("/", validationBodyCreateCard, createCard);
router.put("/:cardId/likes", validationParams, likeCard);
router.delete("/:cardId/likes", validationParams, dislikeCard);

module.exports = router;
