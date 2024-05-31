const mongoose=require("mongoose");
const Company_details=mongoose.Schema({
    Company_name:String,
    Address:String,
    Certificate:String,
    PassWord:String,
    Verified:String,
    Email:String,
    Mobile_no:String,
});
module.exports=mongoose.model("Company",Company_details);