const UserModel = require("../models/companySchema");
const AgencyModel = require("../models/agencyRegisterSchema");
const signupSchema = require('../models/signupSchema');

//get all tourists
exports.getTourists = async (req, res) => {
  try {
    const result = await signupSchema.find({});
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

exports.getTotalNumberOfPaidOrders = async (req, res) => {
  try {
    const result = await signupSchema.find({});
    let totalNumberOfPaidOrders=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.paymentStatus=="Paid"){
          totalNumberOfPaidOrders=totalNumberOfPaidOrders+1;
        }
      })
    })
    res.json({
      totalNumberOfPaidOrders:totalNumberOfPaidOrders
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

exports.getTotalNumberOfOrdersPending = async (req, res) => {
  const email = req.params.userLocalEmail;
  try {
    const result = await signupSchema.find({email});
    let ordersPending=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.paymentStatus=="Pending" || order.paymentStatus=="Unpaid"){
          ordersPending=ordersPending+1;
        }
      })
    })
    res.json({
      ordersPending:ordersPending
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

// find total number of paid/completed packages of agency
exports.getTotalNumberOfAgencyPaidOrders = async (req, res) => {
  const email = req.params.userLocalEmail;
  try {
    const result = await signupSchema.find({email});
    let totalNumberOfPaidOrders=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.paymentStatus=="Paid"){
          totalNumberOfPaidOrders=totalNumberOfPaidOrders+1;
        }
      })
    })
    res.json({
      totalNumberOfPaidOrders:totalNumberOfPaidOrders
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

// search tourist by email
exports.searchTouristbyEmail = async (req, res) => {
  try {
    const email = req.params.userLocalEmail;
    const agency = await signupSchema.findOne({ email });
    res.json(agency);
  } catch (err) {
    console.log(err, "agencyController.searchAgencybyId error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};


