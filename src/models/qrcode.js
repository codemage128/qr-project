import mongoose from "mongoose";
const Schema = mongoose.Schema;

const qrcodeSchema = new Schema({
    content: String,
    promocode: String,
    image: Array,
});

module.exports = mongoose.model("qrcode", qrcodeSchema);