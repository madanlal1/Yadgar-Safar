const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var localStorage = require('localStorage');

const signupSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    image: {
        type: String
    },

    interests: [String],

    bookedPackages : [{
          companyName : {
            type : String
          },
          companyEmail : {
            type : String
          },
          packageName: {
            type: String
          },
          packageCity: {
            type: String
          },
          packageDuration: {
            type: String
          },
          packageProvince: {
            type: String
          },
          image: {
            type: String
          },
          price: {
            type: Number
          },
          tourCategory: {
            type: String
          },
          paymentStatus:{
            type: String,
            default: 'Unpaid'
          },
          amountPaid:{
            type: Number
          },
          numberofPeople:{
            type: Number
          },
          numberofChildren:{
            type: Number,
            required: false
          },
          bookingDate:{
            type: Date,
            default: Date.now
          }
          
    }],
    
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

signupSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 5);
    }
    next();

})

signupSchema.methods.generateAuthToken = async function () {
    try {

        let token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token:token})
        await this.save();
        return token;


    } catch (err) {
        console.log(err);
    }
}
module.exports = mongoose.model('users', signupSchema);