const mongoose=require("mongoose");
const Visit_request=mongoose.Schema({
    Company_email:String,
    Jobber_email:String,
    Date:String,
    Time:String,
    Approve:String
});
module.exports=mongoose.model("Visit_request",Visit_request);