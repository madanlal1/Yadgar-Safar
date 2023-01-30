const express = require("express");
const multer = require('multer');
const bodyParser = require("body-parser");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const { default: mongoose } = require("mongoose");
const UserModel = require('./models/companySchema')
const AgencyModel = require('./models/agencyRegisterSchema');
const fileupload = require("express-fileupload");
const signupSchema = require('./models/signupSchema');
var localStorage = require('localStorage');
const cookie = require('cookie');
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const app = express();
app.use(bodyParser.json());
const agencyRoute = require('./router/agencyRoute');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
// var corsOptions = {
//   origin: "http://localhost:3000",
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// };
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());


//connecting to database
// Madan, Don't delete below line, below link is of onlu=ine MongoDB connection
mongoose.connect('mongodb+srv://safdar:yadgarsafar@project1.3hqbd.mongodb.net/yadgardb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

  // mongodb://127.0.0.1:27017/yadgarsafar
  // 'mongodb+srv://admin:admin@cluster0.2oxj55a.mongodb.net/yadgarsafar?retryWrites=true&w=majority'
  // Madan
  // mongoose.connect('mongodb://localhost:27017/yadgarsafar', {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


// setting path

// for backend
// app.use("/", express.static(path.resolve('public/images')))
// app.use('/', express.static(path.join(__dirname, 'public/images')));
// for render
app.use('/', express.static(path.join(__dirname, './client/build')));
// for render
app.get("*", (_, res) => {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function(err) {
      if(err) {
        res.status(500).send(err);
      }
    }
  )
});

const storage = multer.diskStorage(
  {

    destination: function (req, file, callback) {
      callback(null, "./public/images")
    },
    filename: function (req, file, callback) {
      callback(null, new Date.now() + "_" + file.originalname)
    }
  }
);

const upload = multer({
  storage: storage,
}).single('image');

//middlewares
app.use('/', agencyRoute);
// simple route
app.get("/", async (req, res) => {
  res.json({ message: "Welcome to Yadgar Safar application." });
});




//insert data
// app.post("/insertUser", (req, res)=>{

//   console.log("Image Data: ",req.body?.image)
//   console.log("body Data: ",req.body)
//   const {companyName, packageName, packageCity, packageDescription,
//     packageDuration, packageStartFrom, packageEndAt, included, notIncluded,
//     price, tourCategory, ageRange, dayOne, dayOneDescription,
//     question, answer, image} = req.body;

//    upload(req,res, (error)=>{   



//     if(req.fileValidationError) {
//       res.status(500).send({message:req.fileValidationError});
//     }
//     else {


//       const user = new UserModel({
//         companyName, packageName, packageCity, packageDescription,
//         packageDuration, packageStartFrom, packageEndAt, included, notIncluded,
//         price, tourCategory, ageRange, dayOne, dayOneDescription,
//         question, answer, image
//       });
//       try{  
//         user.save();
//         res.send("Data Inseted");
//         console.log("Data inserted")
//       }catch(err){
//         res.send(err.message);
//       }
//     }
//   });
// });

app.post("/insertUser", async (req, res) => {
  const { name, owner, city, earned } = req.body;

  const user = new UserModel({
    name: name,
    owner: owner,
    city: city,
    earned: earned
  });
  try {
    await user.save();
    res.send("Data Inseted");
  } catch (err) {
    res.send(err.message);
  }

})





// signup user
app.post('/insertData', async (req, res) => {

  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(401).json({ error: "kindly fill all fields!" })
  }
  else {
    await signupSchema.findOne({ email: email }).then(userExist => {
      if (userExist) {
        res.status(401).json({ message: "user already registered" })
      }
      else {
        const user = new signupSchema({ firstname, lastname, email, password });

        user.save().then(() => {

          res.status(200).json({ message: "user registered successfully" })
        }).catch(() => {

          res.status(401).json({ error: "Failed to register!" })
        })

      }
    })

  }
})

// add/book Package 
app.post('/addpackage', async (req, res) => {

  const { id, companyName, companyEmail, packageName, packageCity, packageDuration, image, 
    packageProvince, price, tourCategory, paymentStatus, amountPaid,numberofPeople } = req.body;


  let bookedPackages = [];

    bookedPackages.push({

      companyName, companyEmail, packageName, packageCity, packageDuration, packageProvince, image, price, tourCategory, paymentStatus, amountPaid, numberofPeople

    });

  await signupSchema.findOneAndUpdate(
    { _id: id },
    {
      $push: { bookedPackages: bookedPackages },
    }
  )
    .then((res2) => {
      res.json({success:'package booked successfully'})
    })
    .catch((err) => console.log("Receieved Errorin Adding Package: ", err));
})




let email1 = null;


app.get('/getData', async (req, res) => {

  const userData = await signupSchema.findOne({ email: email1 });
  // const userData = await signupSchema.find();
  if (email1 != null) {
    res.json(userData);
    // console.log("userData FROM GETDATA: " + userData);
  }
  // res.send(userData);
  else {
    res.send("userData can't found")
  }

})

// middleware api
// const verifyJWT = (req,res,next) => {

//   const token = req.headers["x-access-token"];

//   if(!token) {
//     res.send("token not found!")
//   } else {

//     jwt.verify(token, "MYSECRETKEY", (err, decoded) => {

//       if(err) {
//         res.json({auth: false, message: "you failed to authenticate!"})
//       } else {
//         res.userId = decoded._id;
//         next();

//       }
//     })
//   }
// }

// //authentication api
// app.get("/isUserAuth", verifyJWT, (req,res) => {
//   res.send("You are authenticated Congrats!")
// })
// //signin getAPI
// app.get('/login', (req,res) => {
//   if(req.session.user) {
//     res.send({loggedIn: true, user: req.session.user})
//   } else {
//     res.send({loggedIn: false})
//   }
// })


// signin user
app.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(405).json({ error: "Email or Password missing..." });
    }

    const userLogin = await signupSchema.findOne({ email: email });

    if (userLogin) {

      email1 = email;

      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials!" })
      } else {

        const token = await userLogin.generateAuthToken();

        res.send({
          status: 200,
          token: token

        })
      }

    }
    else {
      res.status(404).json({ error: "invalid credentials!" })
    }

  } catch (err) {
    console.log(err);
  }


})


// edit profile api
app.post('/update/:id', async (req, res) => {

  const { id } = req.params;

  const { firstName, lastName, city, image, country, interests } = req.body;

  await signupSchema.findByIdAndUpdate(id, {
    $set: {
      firstname: firstName,
      lastname: lastName,
      city: city,
      country: country,
      interests: interests,
      image: image
    }
  })
  res.status(200).send({ msg: "Update Done" });

})

// ------------------------------------------------------------------  ( Payment Method )

// const Stripe = require('stripe');

// const stripe = new Stripe(process.env.SECRETKEY || "", null);

// app.post('/donate', async (req, res) => {
//   const { token = {}, amount = 0 } = req.body;

//   if (!Object.keys(token).length || !amount) {
//     res.status(400).json({ success: false });
//   }

//   const { id: customerId } = await stripe.customers.create({
//     email: token.email,
//     source: token.id,
//   }).catch(e => {
//     console.log(e);
//     return null;
//   })

//   if (!customerId) {
//     res.status(500).json({ success: false });
//     return;
//   }

//   const invoiceId = `${token.email}-${Math.random().toString()}-${Date.now().toString()}`;

//   const charge = await stripe.charges.create({
//     amount: amount * 100,
//     currency: "USD",
//     customer: customerId,
//     receipt_email: token.email,
//     description: "Donation",
//   }, { idempotencyKey: invoiceId }).catch(e => {
//     console.log(e);
//     return null;
//   });

//   if (!charge) {
//     res.status(500).json({ success: false });
//     return;
//   };

//   res.status(201).json({ success: true });
// });

app.post("/payment", cors(), async (req, res) => {
	let { amount, id } = req.body;
  console.log("amount: ", amount, "ID: ", id);
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "Yadgar Safar company",
			payment_method: id,
			confirm: true
		})
		console.log("Payment Done", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})



// ------------------------------------------------------------------- ( End Payment Method )

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


  // set port, listen for requests
  // const PORT = process.env.PORT || 27017;              //8080
  // app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}.`);
  // });