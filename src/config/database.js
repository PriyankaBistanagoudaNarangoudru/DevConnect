const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://priya-mongo-user:Mongonode26@learnnodejs.znszuvs.mongodb.net/devConnect");
}

module.exports = connectDB;