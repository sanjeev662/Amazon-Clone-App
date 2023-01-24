const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middleware/authenticate");


//get products data
router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    return res.status(201).json(productsdata);
  } catch (error) {
    console.log("message" + error.message);
  }
});


//get particular product data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);

    const individual = await Products.findOne({ id: id });
    //console.log(individual + "ind mila hai");

    return res.status(201).json(individual);
  } catch (error) {
    return res.status(400).json(error);
  }
});

//signup user
router.post("/register", async (req, res) => {
  // console.log(req.body);
  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    return res.status(422).json({ error: "fill the all details" });
  }

  try {
    const preuser = await User.findOne({ email: email });

    if (preuser) {
      return res.status(422).json({ error: "This email is already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const finaluser = new User({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });

      // yaha pe hasing algorithm use krenge
      //password hashing process before data saving.

      const storedata = await finaluser.save();
      // console.log(storedata + "user successfully added");
      return res.status(201).json(storedata);
    }
  } catch (error) {
    console.log(
      "error during registration time : " + error.message
    );
    return res.status(422).send(error);
  }
});

// login data
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "fill the details" });
  }

  try {
    const userlogin = await User.findOne({ email: email });
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);

      if (!isMatch) {
        return res.status(400).json({ error: "invalid crediential pass" });
      } else {
        const token = await userlogin.generatAuthtoken();

        //for passing cookies to frontend we install cookie-parser
        //then import them in main aap.js file
        //then use in app
        //now for generating cookies we have to give a random name then token value and expire time

        res.cookie("Amazonweb", token, {
          expires: new Date(Date.now() + 90000000),
          httpOnly: true,
        });
        return res.status(201).json(userlogin);
      }
    } else {
      return res.status(400).json({ error: "user not exist" });
    }
  } catch (error) {
    console.log("error at login time : " + error.message);
    return res.status(400).json({ error: "invalid crediential pass" });
  }
});

// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {
  try {
    const { id } = req.params;

    //got cart detail
    const cart = await Products.findOne({ id: id });

    //got user detail
    const Usercontact = await User.findOne({ _id: req.userID });   

    if (Usercontact) {
      //here we call addcartdata function which we defined into userSchema..
      const cartData = await Usercontact.addcartdata(cart);

      await Usercontact.save();
      res.status(201).json(Usercontact);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/cartdetails",authenicate,async(req,res) =>{
  try{
    const buyuser=await User.findOne({_id:req.userID});
    res.status(201).json(buyuser);
  }
  catch (error){
    console.log("error"+error)
  }
})


// item remove ho rhi hain lekin api delete use krna batter hoga
// remove iteam from the cart

router.delete("/remove/:id", authenicate, async (req, res) => {
  try {
      const { id } = req.params;

      //filter methode return the updated array according to condition..
      //here return array of items of which id not equal to given id
      
      req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
          return cruval.id != id
      });

      req.rootUser.save();
      res.status(201).json(req.rootUser);
      //item removed here

  } catch (error) {
      console.log(error + "jwt provide then remove");
      res.status(400).json(error);
  }
});

// get user is login or not
router.get("/validuser", authenicate, async (req, res) => {
  try {
      const validuserone = await User.findOne({ _id: req.userID });
      //console.log(validuserone + "user hain home k header main");
      res.status(201).json(validuserone);
  } catch (error) {
      console.log(error + "error for valid user");
  }
});

// for userlogout

router.get("/logout", authenicate, async (req, res) => {
  try {
      req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
          return curelem.token !== req.token
      });

      res.clearCookie("Amazonweb", { path: "/" });
      req.rootUser.save();
      res.status(201).json(req.rootUser.tokens);
      console.log("user logout");

  } catch (error) {
      console.log(error + "jwt provide then logout");
  }
});



module.exports = router;
