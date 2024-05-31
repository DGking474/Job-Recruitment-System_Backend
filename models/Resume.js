const mongoose=require("mongoose");
const Resume=mongoose.Schema({
    jobber_email:String,
    mobile:String,
    Experince:String,
    cpi:String,
    skill:[String],
    objective:String,
    college:String,
    GraduationYear:String,
    qualification:String,
    title:String,
    Description:String,
    Starting_date:String,
    Field:String,
    Ending_date:String,
    hobbies:String,
    working_location:String
});
module.exports=mongoose.model("Resume_details",Resume);