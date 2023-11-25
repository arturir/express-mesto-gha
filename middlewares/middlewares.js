module.exports.handleError = (req, res, err) => {
  if (err.message && err.message.indexOf("Cast to ObjectId failed")) {
    res.status(404).send({ message: "переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля" });
  } else if (err.message && err.message.indexOf("user validation failed")) {
    res.status(400).send({ message: "Карточка или пользователь не найден" });
  } else {
    res.status(500).send({ message: "Произошла ошибка" });
  }
};
