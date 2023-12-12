const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/UnauthorizedError");
const regExpUrl = require("../regexp/url");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => "Указан неправильный E-mail",
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (v) => regExpUrl.test(v),
      message: () => "Указан неправильный URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Неправильная почта или пароль");
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError("Неправильная почта или пароль");
          }
          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);
