import mongoose from "mongoose";
const Schema = mongoose.Schema;

const qrcodeSchema = new Schema({
    image: String,
    code: String,
    link: String,
    single: Number, //  0 -> simple redirect, 1 -> user probile
    printed: {
        type: Boolean,
        default: "false",
    },
});

module.exports = mongoose.model("qrcode", qrcodeSchema);