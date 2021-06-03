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
  facebookFlag: {
    type: Boolean,
    default: true,
  },
  linkedin: String,
  linkedinFlag:  {
    type: Boolean,
    default: true,
  },
  twitter: String,
  twitterFlag:  {
    type: Boolean,
    default: true,
  },
  instagram: String,
  instagramFlag:  {
    type: Boolean,
    default: true,
  },
  spotify: String,
  spotifyFlag:  {
    type: Boolean,
    default: true,
  },
  pinterest: String,
  pinterestFlag:  {
    type: Boolean,
    default: true,
  },
  skype: String,
  skypeFlag:  {
    type: Boolean,
    default: true,
  },
  whatsapp: String,
  whatsappFlag:  {
    type: Boolean,
    default: true,
  },
  youtube: String,
  youtubeFlag:  {
    type: Boolean,
    default: true,
  },
  safari: String,
  safariFlag:  {
    type: Boolean,
    default: true,
  },
  doc: String,
  docFlag:  {
    type: Boolean,
    default: true,
  },
  paypal: String,
  paypalFlag:  {
    type: Boolean,
    default: true,
  },
  shop: String,
  shopFlag:  {
    type: Boolean,
    default: true,
  },
  mailbox: String,
  mailboxFlag:  {
    type: Boolean,
    default: true,
  },
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