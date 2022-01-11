const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

//connection to database
mongoose.connect("mongodb://localhost:27017/healthcare",{
  useUnifiedTopology:true
}).then((result)=> console.log("Connected to database"))
.catch((err) => console.log(err));

// .then((ans)=>{
//   console.log("Connnected Successfully")
// }).catch((!err)=>{
//   console.log("Error in the connection")
// })

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.set('view engine', 'ejs')

const PatientDetails_schema = {
  patient_id: {
    type: Number,
    require: true
  },
  name:{
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  dob: {
    type: Date,
    require: true
  }
}

const Report_schema = {
  patient_id: {
    type: Number,
    require: true
  },
  Symptoms:String,
  doctorId: String,
  dateOfPresciption: {
    type:Date,
    default:Date.now
  }
}

const Doctor_schema = {
  Doctor_id: {
    type: Number,
    require: true
  },
  HospitalName:{
    type: String,
    require: true
  },
  Batch: {
    type: Date,
    require: true
  },
  yearOfPractice: {
    type: Number,
    default: 0
  }
}

const patientDetail_model = mongoose.model("PatientDetails", PatientDetails_schema);
const report_model = mongoose.model("Report", Report_schema);
const doctor_model = mongoose.model("Doctor", Doctor_schema);

//
// try{
//   patientDetail_model.create(
//         {
//           "patient_id":001,
//          "name": "Ravi",
//          "email":"ravi@gmail.com",
//          "dob":new Date("2012-10-14")
//        });
// }catch(e){
//   console.log(e);
// }
//
// try
// {
//  report_model.create(
//        {
//         "patient_id":001,
//         "Symptoms": "Mild-fever with cough leads to haiza",
//         "doctorId":"0786"
//       });
// }catch(e){
//   console.log(e);
// }
// try{
//   doctor_model.create(
//     {
//       "Doctor_id":0786,
//       "HosptalName": "Saptagiri",
//       "Batch:":new Date("2014-12-10"),
//       "yearOfPractice": 4
//     }
//   )
// }catch(e){
//   console.log(e);
// }
// try{
//   patientDetail_model.find(function(err,result){
//     console.log(result)
//   })
// }
// catch(e){
//   console.log(e);
// }

app.route('/patients')

  .get(function(req, res) {
    console.log("get Request");
    patientDetail_model.find(function(err, foundPatient) {
      if (!err) {
        res.send(foundPatient);
        console.log("Result sent")
        // console.log(foundPatient);

      } else {
        console.log("error in getting the data from database")
      }
    })
    // res.send("wow you reached");
  })

  .post(function(req, res) {
    console.log(req.body);

      // console.log(req.body.patient_id);
      // console.log(req.body.name);
      // console.log(req.body.email);
      // console.log(req.body.dob);

    const obj = new patientDetail_model({
      patient_id: req.body.patient_id,
      name:req.body.name,
      email:req.body.email,
      dob:req.body.dob
    })

    // obj.save(function(err) {
    //   if (err) {
    //     res.send("Error in posting");
    //   } else {
    //     res.send("The article has been published")
    //   }
    // });
  })

  .delete(function(req, res) {
    patientDetail_model.deleteMany(function(err) {
      if (err) {
        res.send("cant delete articles")
      } else {
        res.send("deleted successfully all articles")
      }
    })
  });

  app.route('/patients/:patient_id')

  .get(function(req,res){
    console.log("get request for patient by id")
    patientDetail_model.findOne({patient_id:Number(req.params.patient_id.slice(1))},function(err,foundPatient){
      if(foundPatient){
        res.send(foundPatient);
      }
      else
      {
        res.send("No patient found with specified id")
        console.log("no Patients found");
    }
    })
  })

  .put(function(req,res){

    console.log(req.params.patient_id.slice(1));
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.dob);

    patientDetail_model.updateOne({patient_id:req.params.patient_id.slice(1)},
      {name:req.body.name},
      {overwrite:true},
    function(err){
      if(!err){res.send("successfully updated")}
      else{res.send("Can't make the update")
    console.log(err)}
    })})

    // .patch(function(req,res){
    //   patientDetail_model.update(
    //     {title:req.params.articleTitle},
    //     {$set:req.body},
    //     function(err){
    //       if(!err){res.send("successfully updated")}
    //       else{res.send("Can't make the update")}
    //     })
    // })

    .delete(function(req,res){
      patientDetail_model.deleteOne({patient_id:req.params.patient_id},function(err){
        if(!err){res.send("deleted successfully")}
        else{res.send("deletion can't be done")}
      })
    })




app.listen(3000, function() {
  console.log("server started on port 3000")
})
