import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: String,
    email: String,
    contact: String,
    country: String,
    address: String,
    customInfo: String
});

module.exports = mongoose.model("Account", accountSchema);