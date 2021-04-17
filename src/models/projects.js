import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: String,
    description: String,
    technologies: Array,
    github: String,
    url: String,
    images: Array,
});

module.exports = mongoose.model("Project", projectSchema);