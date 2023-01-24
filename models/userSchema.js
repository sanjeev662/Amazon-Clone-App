const mongoose = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.KEY;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate(value) {
    //     if (!validator.isEmail(value)) {
    //         throw new Error("not valid email address");
    //     }
    // }
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  carts: Array,
});

// password hasing
//this is work as middleware function

//pre function used to call a function before executing mentioned function..
//such as here bcryption done exact before pre methode.

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
  //call next() methode meanes continue to its next work..
});

// generting token
//we used mongose instance methode here

userSchema.methods.generatAuthtoken = async function () {
  try {
    //generation of token
    //here main two values used payload and second
    //secret key of 32 bit which should mentioned in env file
    //expiresIn given time

    let token = jwt.sign({ _id: this._id }, secretKey, {
      expiresIn: "1d",
    });

    //concat is used for concatenation in array ,it is array methode
    this.tokens = this.tokens.concat({ token: token });

    //save methode for storing data in database
    await this.save();

    return token;
  } catch (error) {
    console.log(error);
  }
};

// addto cart data
userSchema.methods.addcartdata = async function (cart) {
  try {
    this.carts = this.carts.concat(cart);
    await this.save();
    return this.carts;
  } catch (error) {
    console.log(error + "error at the time of cart addition");
  }
};

const User = new mongoose.model("USER", userSchema);

module.exports = User;
