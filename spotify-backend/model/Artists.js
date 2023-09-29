const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    user:{
        type:mongoose.ObjectId,
        ref:"User",
    },
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
});





module.exports = mongoose.model("Artist", artistSchema);

