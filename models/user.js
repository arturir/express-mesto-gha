const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/UnauthorizedError");

const regexUrl = /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i;

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
    required: true,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    required: true,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (v) => regexUrl.test(v),
      message: () => "Указан неправильный URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        console.log('000');
        throw new UnauthorizedError("Неправильная почта или пароль");
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            console.log('111');
            throw new UnauthorizedError("Неправильная почта или пароль");
          }
          return user;
        });
    })
};

module.exports = mongoose.model("user", userSchema);
