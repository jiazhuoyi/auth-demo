const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
    account: { unique: true, type: String },
    name: String,
    password: String,
    roles: [{ type: Number }],
    salt: String,
    createAt: { type: Number, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  try {
    const _this = this;
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const _password =  await bcrypt.hash(_this.password, salt);
    _this.salt = salt;
    _this.password = _password;
    next();
  } catch (error) {
    return next(error);
  }
})

UserSchema.methods = {
  comparePassword: async function (_password) {
    const match = await bcrypt.compare(_password, this.password);
    return match;
  }
}
module.exports = mongoose.model('user', UserSchema);