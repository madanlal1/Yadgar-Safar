const mongoose = require('mongoose');
const AgencyRegisterSchema = new mongoose.Schema({
    companyname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  const AgencyModel = mongoose.model("agency", AgencyRegisterSchema);
//   const insertData = async ()=>{
//     const data = await AgencyModel.create({
//         firstname:"Yadgar",
//         lastname:"Safar",
//         email:"info.yadgarsafar@gmail.com",
//         password:"1122"
//     });
//   }

//   insertData();
  module.exports = AgencyModel;