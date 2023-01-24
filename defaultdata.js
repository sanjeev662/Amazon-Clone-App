const productdata = require("./constant/productsdata");
const Products = require("./models/productsSchema");

const DefaultData = async()=>{
    try {
        await Products.deleteMany({});
        //for removing extra data..because if we not use deletemany then there are repeted data added whenever we run /refresh our page.
        const storeData = await Products.insertMany(productdata);
       // console.log(storeData);
    } catch (error) {
        console.log("error" + error.message);
    }
};

module.exports = DefaultData; 