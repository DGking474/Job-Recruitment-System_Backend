const mongoose=require("mongoose");
const Job_Seeker=mongoose.Schema({
    Name:String,
    Experience:String,
    Email:String,
    Field:String,
    qualification:String,
    resume:String,
    Mobile_no:String,
    Password:String,
    image:String,
    status:String
});
module.exports=mongoose.model("Job_Seeker",Job_Seeker);