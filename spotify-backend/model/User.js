const mongoose =require("mongoose")
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    ratings: [
        {
            type:mongoose.ObjectId,
            ref:"Song",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
