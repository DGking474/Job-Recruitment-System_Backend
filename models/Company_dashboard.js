const mongoose=require("mongoose");
const Company_dashboard=mongoose.Schema({
   Email:String,
   logo:String,
   company_images:mongoose.Schema.Types.Mixed,
   description:String,
   opening_time:String,
   closing_time:String,
});
module.exports=mongoose.model("Company_Dashboard",Company_dashboard);