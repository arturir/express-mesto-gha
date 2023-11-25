const User = require("../models/user");

module.exports.getUsers = (req, res, next) => {
  console.log(req.user);
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => { res.err = err; next(); });
};
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => { res.err = err; next(); });
};
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => { res.err = err; next(); });
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => { res.err = err; next(); });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => { res.err = err; next(); });
};
