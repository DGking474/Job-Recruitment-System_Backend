const express = require("express");
var nodemailer = require('nodemailer');
const job_seeker = require("../../models/Job_Seeker");
const jwt = require("jsonwebtoken");
const Resume = require("../../models/Resume");
const jwt_secret = "ahcdhd";
const Vacancy_Request = require("../../models/Vacancy_Request");
const Vacancy = require('../../models/Vacancy');
const Visit_request=require("../../models/Visit_Request");
const Router = express.Router();
Router.post("/job_seeker_data", async (req, res) => {
  const email = req.body.email;
  console.log(req.body.image);
  const existence = await job_seeker.findOne({ Email: { $regex: new RegExp(email, 'i') } });
  console.log(existence);
  try {
    if (existence) {
      return res.json({ error: "User already Exist" });
    }
    else {

      let jobber = new job_seeker({

        Name: req.body.name,
        Experience: req.body.experience,
        Email: req.body.email,
        Field: req.body.field,
        image: req.body.image,
        qualification: req.body.qualification,
        resume: req.body.resume,
        Mobile_no: req.body.mobile,
        Password: req.body.password,
        status: req.body.status
      });
      let result = await jobber.save();
      // res.send(result);
      if (result) {
        res.json({ data: "confirm" });
      }
    }
  }
  catch (error) {
    console.error("Error during findOne:", error);
  }

});
Router.post("/jobber_login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.pass;

  const data = await job_seeker.findOne({ Email: email, Password: password });
  if (data) {
    const token = jwt.sign({ email: email }, jwt_secret);
    if (res.status(201)) {
      return res.json({ status: "ok", data: token, jobber_details: data })
    }
    else {
      return res.json({ error: "error" });
    }
  }
  else {
    return res.json({ error: "User is Not Exist!\nIf You are new User,Please Register First and then Logging to the System." })
  }


});
Router.get("/jobber_details", async (req, res) => {
  console.log(req.query.email)
  const data = await job_seeker.findOne({ Email: req.query.email });
  res.send(data);
});
Router.post("/resume_details", async (req, res) => {
  let resume = new Resume({
    jobber_email: req.body.email,
    mobile: req.body.mobile,
    Experience: req.body.Experience,
    cpi: req.body.cpi,
    college: req.body.college,
    GraduationYear: req.body.GraduationYear,
    qualification: req.body.qualification,
    title: req.body.title,
    Description: req.body.Description,
    Starting_date: req.body.Starting_date,
    objective: req.body.objective,
    Field: req.body.Field,
    Ending_date: req.body.Ending_date,
    hobbies: req.body.hobbies,
    skill: req.body.skill,
    working_location: req.body.working_location

  });

  const data = await resume.save();
  if (data) {
    const update = await job_seeker.updateOne({ Email: req.body.email }, {
      $set: { status: "true", resume: "true" }

    });
    console.log(update);
    if (update) {
      res.json({ data: "ok" })

    }
  }
  else {
    res.json({ error: "error" });
  }
});
//get resume data
Router.post("/get_resume_data", async (req, res) => {
  let data = await Resume.findOne({
    jobber_email: req.body.email
  });
  if (data) {
    res.json({ data: data });
  }
  else {
    res.json({ data: "error" });
  }
});
Router.post("/Lists", async (req, res) => {
  console.log(req.body.experience);
  console.log(req.body.Field);
  console.log(req.body.qualification);

  let data = await Vacancy.find({ Experience: req.body.experience, Field: req.body.Field, qualification: req.body.qualification })
  if (data) {
    res.send(data);
  }
  else {
    res.send("not Found")
  }
});

Router.post("/vacancy_request", async (req, res) => {
  let vrequest = new Vacancy_Request({
    Company_email: req.body.c_email,
    Jobber_email: req.body.j_email,
    Date: req.body.date,
    Job_description: req.body.Job_description,
    Approve: req.body.Approve,

  });
  const v = await vrequest.save();
  if (v) {
    res.json({ data: "success" });
  }
  else {
    res.json({ data: "error" });
  }
});
Router.post("/vacancy_request_data", async (req, res) => {
  let data = await Vacancy_Request.findOne({
    Company_email: req.body.c_email, Jobber_email: req.body.j_email, Approve: req.body.Approve,
    Job_description: req.body.Job_description
  });
  if (data) {
    res.json({ data: "success", d: data.Company_email })
  }
  else {
    res.json({ error: "not found" });
  }
});
Router.post("/vacancy_Request_details", async (req, res) => {
  let data = await Vacancy_Request.find({ Company_email: req.body.email, Approve: req.body.Approve });
  if (data) {
    res.json({ data })
  }
  else {
    res.json({ data: "Not Found" })
  }
})
Router.post("/vacancy_Request_details_For_Jobber", async (req, res) => {
  let data = await Vacancy_Request.find({ Jobber_email: req.body.email, Approve: req.body.Approve });
  if (data) {
    res.status(200).json({ data });
  }
  else {
    res.status(404).json({ error: "No data found" });
  }
})
Router.post("/vacancy_Request_detail", async (req, res) => {
  console.log(req.body.Approve)
  let data = await Vacancy_Request.find({ Company_email: req.body.email, Approve: req.body.Approve, Job_description: req.body.job_decription });
  if (data) {
    res.json({ data })
  }
  else {
    res.json({ data: "Not Found" })
  }
})

Router.post("/vacancy_update", async (req, res) => {
  var abc = req.body.vacancies;
  console.log(req.body.email,
    req.body.jdescription,

    req.body.Experience, req.body.qualification, req.body.vacancies)
  let data = await Vacancy.updateOne({
    Company_email: req.body.email,
    job_decription: req.body.jdescription,

    Experience: req.body.Experience,
    qualification: req.body.qualification
  }, {
    $set: { number_of_places: req.body.vacancies }
  })
  if (data) {
    res.json({ data: "success" })
  }
  else {
    res.json({ data: "error" })
  }
});

Router.post("/Vacancy_Request_Update", async (req, res) => {
  console.log(req.body.cname)
  var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
    
    user: 'vasuvachhani2004@gmail.com',
    pass: 'dhzorigccsltbpnq'
    
    }
    
    });
  var mailOptions = {

    from: 'vasuvachhani2004@gmail.com',
    to: req.body.Jobber_email,
    subject: 'Job Recruitment System',
    text: `Congratulations! You have been shortlisted for an interview.\n\n
    Job Description: ${req.body.description}\n
    Company Name: ${req.body.cname}\n
    Address: ${req.body.Address}\n
    Date: ${req.body.date}\n
    Time: ${req.body.time}\n\n
    Thank you for applying.`
    };
  console.log(req.body.Company_email, req.body.Jobber_email, req.body.Address, req.body.Approve, req.body.description, req.body.date, req.body.time)
  let data =await Vacancy_Request.updateOne({

    Company_email: req.body.Company_email,
    Jobber_email: req.body.Jobber_email,
    Job_description: req.body.description
  }, {
    $set: {
      Date: req.body.date,
      Time: req.body.time,
      Address: req.body.Address,
      Approve: req.body.Approve
    }
  });
  if (data) {
    
      transporter.sendMail(mailOptions, function(error, info){
  
        if (error) {
        
        console.log(error);
        
        } else {
        
        console.log('Email sent: ' + info.response);
        
        }
        
        });
  
    res.json({ data: "success" })
  }
  else {
    res.json({ data: "not updated" })
  }
});
Router.post("/visit_request",async(req,res)=>{
  let vs=new Visit_request({
    Company_email:req.body.cemail,
    Jobber_email:req.body.jemail,
    Date:req.body.Date,
    Time:req.body.Time,
    Approve:req.body.Approve
  });
  const visitrequst=await vs.save();
  if(visitrequst)
  {
    res.json({data:"success"})
  }
  else{
    res.json({data:"error"})
  }
});
Router.post("/visit_request_List",async(req,res)=>{
  let vsd=await Visit_request.find({Company_email:req.body.cemail,Approve:req.body.Approve});
  if(vsd)
  {
    res.json({vsd})
  }
  else{
    res.json({data:"Not Found"})
  }
});
Router.post("/visit_request_update",async(req,res)=>{
  var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
    
    user: 'vasuvachhani2004@gmail.com',
    pass: 'dhzorigccsltbpnq'
    
    }
    
    });
  var mailOptions = {

    from: 'vasuvachhani2004@gmail.com',
    to: req.body.jemail,
    subject: 'Job Recruitment System - Visit Request Approved',
    text: `Dear Applicant,\n\n
    We are pleased to inform you that your visit request has been successfully approved by our company.\n\n
    Company Email: ${req.body.cemail}\n
    Visit Date: ${req.body.date}\n
    Visit Time: ${req.body.time}\n
    Address: ${req.body.caddress}\n\n
    We look forward to your visit. If you have any questions or need further information, please don't hesitate to contact us.\n\n
    Best regards,\n
    ${req.body.cname}`
    };
  let udata=await Visit_request.updateOne({
    Company_email:req.body.cemail,
    Jobber_email:req.body.jemail,
    Approve:req.body.Approve
  },{$set:{Approve:"true"}});
  if(udata)
  {
    transporter.sendMail(mailOptions, function(error, info){
  
      if (error) {
      
      console.log(error);
      
      } else {
      
      console.log('Email sent: ' + info.response);
      
      }
      
      });

    res.json({data:"updated"})
  }
  else{
    res.json({data:"Not Updated"})
  }
});
Router.post("Visit_request_history",async(req,res)=>{

})
Router.post("/visit_request_data",async(req,res)=>{
  console.log(req.body.c_email,req.body.j_email,req.body.Approve)
  let vdata=await Visit_request.findOne({Company_email:req.body.c_email,Jobber_email:req.body.j_email,Approve:req.body.Approve});
  if(vdata)
  {
    console.log(vdata)
    
    res.json({data:"success"})
  }
  else{
    res.json({data:"Not Found"})
  }
});
Router.post("/visit_response_for_user",async(req,res)=>{
  let data=await Visit_request.find({Jobber_email:req.body.jemail,Approve:req.body.Approve});
  if(data)
  {
    res.json({data})
  }
  else{
    res.json({data:"not found"})
  }
})
module.exports = Router;

