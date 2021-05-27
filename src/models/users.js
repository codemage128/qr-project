import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  userslug: String,
  bio: String,
  phone: String,
  roleId: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  email: {
    type: String,
    unique: true
  },
  qrcodes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Qrcode"
    }
  ],
  active: {
    type: Boolean,
    default: false
  },
  token: String,
  profilePicture: {
    type: String,
    default: "https://gravatar.com/avatar/?s=200&d=retro"
  },
  password: String,
  // social media link
  visible: {
    type: Boolean,
    default: true
  },
  facebook: String,
  linkedin: String,
  twitter: String,
  instagram: String,
  spotify: String,
  pinterest: String,
  skype: String,
  whatsapp: String,
  youtube: String,
  safari: String,
  doc: String,
  paypal: String,
  shop: String,
  mailbox: String,

}, { timestamps: true });

userSchema.pre("save", function (next) {
  var user = this;
  var SALT_FACTOR = 12;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);