import mongoose from "mongoose";
const Schema = mongoose.Schema;

const qrcodeSchema = new Schema({
    image: String,
    code: String,
    link: String,
});

module.exports = mongoose.model("qrcode", qrcodeSchema);