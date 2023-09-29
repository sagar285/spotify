const express = require("express");

const app = express();
const port = 5000;
require("./connection");

app.use(express.json());
const Artist = require("./model/Artists");
const User = require("./model/User");
const Song = require("./model/Song");
const multer =require("multer")


app.use("/uploads",express.static("./uploads"))

const config = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads")
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
})

const isimage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }
    else{
        callback(new Error("only images allowed"));
    }
}

const upload = multer({
    storage:config,
    fileFilter:isimage
})










app.post("/registeruser",async(req,res)=>{
    const {name,email}=req.body;
    if(!name || !email){
        return res.status(400).send({message:"pls enter all field"});
    }
    try {
        
        const isalreadyuser = await User.findOne({email})
        if(isalreadyuser){
            return res.status(400).send({message:"this user already in batabase"});
        }
        else{
           const newuser = new User({name,email});
           const saveuser =await newuser.save();
           req.user=saveuser;
           return res.status(200).send({message:"user register succesfuuuly",saveuser}); 
        }

    } catch (error) {
        return res.status(200).send({message:"error in backend",error});
    }
})

// user profile

app.get("/registeruser/:id",async(req,res)=>{
         const {id}=req.params;
    try {
        
      const user = await User.findById({_id:id});
      if(!user){
        return res.status(400).send({message:"this user not in our database"});
      }
      return res.status(200).send({message:"user detail",user});

    } catch (error) {
        return res.status(200).send({message:"error in backend",error});
    }
})

// artist

app.post("/registerartist/:id",async(req,res)=>{
    const {name,dob,bio}=req.body;
    if(!name ||!dob ||!bio){
        console.log(req.params)
     return res.status(400).send({message:"pls enter all field"});
    }
    try {
    
    const isalreadyartist = await Artist.findOne({user:req.params.id})
    if(isalreadyartist){
        return res.status(400).send({message:"this user email already add with another artist"});
    }
    const newartist = new Artist({user:req.params.id,name,bio,dob});
    const saveartist = await newartist.save();
    return res.status(200).send({message:"artist register succesfully",saveartist});
} catch (error) {
    return res.status(200).send({message:"error in backend",error});     
}
})


app.get("/allartist",async(req,res)=>{
    const artists = await Artist.find({}).populate("user");
    if(!artists){
        return res.status(400).send({message:"no artist in this website"});
    }
    return res.status(200).send({artists});
})

app.post("/addsong/:id",upload.single("photo"),async(req,res)=>{
    console.log(req.file)
    const {id}=req.params;
    const cover=req.file.filename;
    const {name,dateOfRelease}=req.body;
    const isartist = await Artist.findById({_id:id});
    if(!isartist){
          return res.status(400).send({message:"pls become artist then add new song"});
    }
    console.log(name,dateOfRelease,cover,id);
    if(!name || !dateOfRelease ||!cover || !id){
        return res.status(400).send({message:"pls choose all field"});
    }
    else{
        const newsong = new Song({name,dateOfRelease,cover,artists:id})
        const savesong = await newsong.save();
        return res.status(200).send({savesong});
    }

})


app.get("/allsong",async(req,res)=>{
    try {

        const songs = await Song.find({}).populate("artists");
        if(!songs){
            return res.status(400).send({message:"no songs found in database"});
        }
        return res.status(200).send({songs});
        
    } catch (error) {
    return res.status(200).send({message:"error in backend",error});     
        
    }
})









app.listen(port, () => {
    console.log(`connection Succesful at ${port}`);
});
