const mongoose=require("mongoose");
const Vacancy=mongoose.Schema({
    Company_email:String,
    Jobber_email:String,
    Date:String,
    Approve:String,
    Job_description:String,
    Time:String,
    Address:String
});
module.exports=mongoose.model("Vacancy_Request",Vacancy);