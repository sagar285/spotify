const mongoose =require("mongoose")
const songSchema = new mongoose.Schema({
    name: String,
    dateOfRelease: Date,
    cover: String,
    artists:  {
            type:mongoose.ObjectId,
            ref:"Artist",
        },
    
});

module.exports = mongoose.model("Song", songSchema);
