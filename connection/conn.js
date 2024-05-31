const mongoose=require("mongoose");
// mongodb+srv://vasu:sT3zr470jCxQrKZQ@cluster0.08gbz9e.mongodb.net/?retryWrites=true&w=majority
mongoose.connect("mongodb://localhost:27017/Job_Recruitment_System").catch(error => handleError(error));
//mongodb://localhost:27017
