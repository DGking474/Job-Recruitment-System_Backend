const mongoose=require("mongoose");
const Vacancy=mongoose.Schema({
    Company_email:String,
    Experience:String,
    job_decription:String,
    package:String,
    qualification:String,
    number_of_places:String,
    Field:String,
});
module.exports=mongoose.model("Vacancy",Vacancy);