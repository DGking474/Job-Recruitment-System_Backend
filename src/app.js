const express=require("express");
require("../connection/conn");
const cors = require("cors");
const app=express();
const Router=require("../routers/admin/login");
const Company=require("../routers/Company/Company_apis");
const jobber=require("../routers/Job_Seeker/Job_Seeker_apis");
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3001"
}
));
app.use(Router);
app.use(Company);
app.use(jobber);
app.listen(3000);
