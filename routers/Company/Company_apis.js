
const express = require("express");
var nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const jwt_secret = "ahcdhd";
const Company = require("../../models/Company");
const Vacancy = require("../../models/Vacancy");
const job_seeker = require("../../models/Job_Seeker");
const Company_dashboard = require("../../models/Company_dashboard");
const Router = express.Router();

Router.post("/Company_register", async (req, res) => {
  const email = req.body.Email;
  const existence = await Company.findOne({ Email: { $regex: new RegExp(email, 'i') } });
  console.log(existence);
  try {


    if (existence) {
      // User exists
      return res.json({ error: "User already Exist" });
    } else {
      // User does not exist
      let Company_details = new Company({
        Company_name: req.body.Company_name,
        Address: req.body.Address,
        Certificate: req.body.Certificate,
        PassWord: req.body.PassWord,
        Verified: req.body.Verified,
        Email: req.body.Email,
        Mobile_no: req.body.Mobile_no
      });
      let result = await Company_details.save();
      // res.send(result);
      if (result) {
        res.json({ data: "confirm" });
      }
    }

    // }
  } catch (error) {
    console.error("Error during findOne:", error);

  }


});
Router.get("/company_data", async (req, res) => {
  const Data = await Company.find({ Verified: "false" });
  res.json({ Data });
});
Router.get("/verified_company_data", async (req, res) => {
  const Data = await Company.find({ Verified: "true" });
  res.json({ Data });
});
Router.post("/company_details", async (req, res) => {
  console.log(req.body.email);
  const Data = await Company.findOne({ Email: req.body.email });
  res.json({ Data });
});



Router.put("/approve", async (req, res) => {
  var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {

      user: 'vasuvachhani2004@gmail.com',
      pass: 'dhzorigccsltbpnq'

    }

  });
  var mailOptions = {

    from: 'vasuvachhani2004@gmail.com',
    to: req.body.Email,
    subject: 'Job Recruitment System',
    text: 'Verification Status\nCongratulations,You are Verified by admin,now you can logging to the System.\n Thank You...'

  };
  try {

    let result = await Company.updateOne(
      { Email: req.body.Email },
      { $set: { Verified: true } }
    )
    if (result) {
      transporter.sendMail(mailOptions, function (error, info) {

        if (error) {

          console.log(error);

        } else {

          console.log('Email sent: ' + info.response);

        }

      });
    }
    res.send(result);

  }
  catch (error) {
    res.send(error);
  }
});

Router.delete("/remove", async (req, res) => {
  console.log(req.body.Email);
  var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {

      user: 'vasuvachhani2004@gmail.com',
      pass: 'dhzorigccsltbpnq'

    }

  });
  var mailOptions2 = {

    from: 'vasuvachhani2004@gmail.com',
    to: req.body.Email,
    subject: 'Job Recruitment System',
    text: 'Verification Status\nSorry,You are Not Verified by admin,Please Register With Valid Data in System.\n Thank You...'

  };
  try {
    let result = await Company.deleteOne({ Email: req.body.Email })
    if (result) {
      transporter.sendMail(mailOptions2, function (error, info) {

        if (error) {

          console.log(error);

        } else {

          console.log('Email sent: ' + info.response);

        }

      });
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//Company Login
Router.post("/Company_login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.pass;

  const token = jwt.sign({ email: email }, jwt_secret);
  const data = await Company.findOne({ Email: email, PassWord: password, Verified: true });
  if (data) {
    const token = jwt.sign({ email: email }, jwt_secret);
    if (res.status(201)) {
      return res.json({ status: "ok", data: token, company_details: data })
    }
    else {
      return res.json({ error: "error" });
    }
  }
  else {
    return res.json({ error: "Company is Not Exist!\nIf You are new User,Please Register First and then Logging to the System." })
  }


});
Router.post("/company_dashboard", async (req, res) => {
  console.log(req.body.logo);
  let Company_d = new Company_dashboard({
    Email: req.body.email,
    logo: req.body.logo,
    company_images: req.body.images,
    description: req.body.description,
    opening_time: req.body.opening_time,
    closing_time: req.body.closing_time,
  });
  let result = await Company_d.save();
  // res.send(result);
  if (result) {
    res.json({ data: "confirm" });
  }



});
Router.post("/company_dashboard_data", async (req, res) => {
  const Data = await Company_dashboard.findOne({ Email: req.body.email });
  if (Data) {
    res.json({ data: true, details: Data });
  }
  else {
    res.json({ data: false });
  }
});
Router.post("/add_vacancy", async (req, res) => {
  const Data = await Company.findOne({ Email: req.body.email });
  var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {

      user: 'vasuvachhani2004@gmail.com',
      pass: 'dhzorigccsltbpnq'

    }

  });
  const data = new Vacancy({
    Company_email: req.body.email,
    Experience: req.body.Experience,
    job_decription: req.body.job_description,
    package: req.body.package,
    qualification: req.body.qualification,
    number_of_places: req.body.number_of_places,
    Field: req.body.Field,
  });
  const experience = req.body.Experience;
  const Field = req.body.Field;
  const qualification = req.body.qualification;
  console.log(experience);
  console.log(Field);
  console.log(qualification)
  const vacancy = await data.save();
  if (vacancy) {
    const jobber = await job_seeker.find({ Experience: experience, Field: Field, qualification: qualification, status: "true" });
    var list = await jobber.map((js) => js.Email)
    if (list) {
      res.json({ data: "success" })
      list.map((data) => {
        var mailOptions = {

          from: 'vasuvachhani2004@gmail.com',
          to: data,
          subject: 'Job Recruitment System',
          text: `Vacancy update!\n\nCompany Name: ${Data.Company_name}\nJob Description: ${req.body.job_description}\nNumber of Vacancies: ${req.body.number_of_places}\nPackage: ${req.body.package}\n\nThank you.`
        };

        transporter.sendMail(mailOptions, function(error, info){
  
          if (error) {
          
          console.log(error);
          
          } else {
          
          console.log('Email sent: ' + info.response);
          
          }
          
          });
    
      })
    }
    else {
      res.json({ data: "vacancy added success fully" });
    }

  }
  else {
    res.json({ data: "error" })
  }
});
//vacancies List
Router.get("/vacancies_list", async (req, res) => {
  email = req.query.email;
  var Data = await Vacancy.find({ Company_email: email });
  res.json({ Data });
});

module.exports = Router;