const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  companyNumber: {
    type: String,
    required: false,
  },
  companyImage: {
    type: String,
    required: false,
  },
  companyOwner: {
    type: String,
    required: false,
  },
  companyDescription: {
    type: String,
    required: false,
  },
  companyCity: {
    type: String,
    required: false,
  },
  companyProvince: {
    type: String,
    required: false,
  },
  companyReviewStars: {
    type: Number,
    required: false,
  },
  numberOfPackages: {
    type: Number,
    required: false,
  },

  packages:[{
    packageName: {
      type: String,
      required: true,
    },
    packageCity: {
      type: String,
      required: true,
    },
    packageProvince: {
      type: String,
      required: true,
    },
    packageDescription: {
      type: String,
      required: true,
    },
    packageDuration: {
      type: String,
      required: true,
    },
    packageStartFrom: {
      type: Date,
      required: true,
    },
    packageEndAt: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    included1: {
      type: String,
      required: true,
    },
    included2: {
      type: String,
      required: false,
    },
    notIncluded1: {
      type: String,
      required: true,
    },
    notIncluded2: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    ageRange: {
      type: String,
      required: true,
    },
    tourCategory: {
      type: String,
      required: true,
    },
    reviewStars: {
      type: Number,
      required: false,
    },
    tourType: {
      type: String,
      required: true,
    },
    tripPlan:[
          {
            tripid: {
              type: String,
              required: false,
            },
            details: {
              type: String,
              required: false,
            },
          }
    ],
  
    question1: {
      type: String,
      required: false,
    },
    question2: {
      type: String,
      required: false,
    },
    question3: {
      type: String,
      required: false,
    },
    answer1: {
      type: String,
      required: false,
    },
    answer2: {
      type: String,
      required: false,
    },
    answer3: {
      type: String,
      required: false,
    },
    
  }],

  
},
  { timestamps: true });

const UserModel = mongoose.model("company", CompanySchema);
// const insertData = async ()=>{
//   const data = await UserModel.create({
//       name:"Boolking.com",
//       owner:"Nazeer Hussain",
//       city:"Lahore",
//       earned:600000
//   });
// }

// insertData();
module.exports = UserModel;