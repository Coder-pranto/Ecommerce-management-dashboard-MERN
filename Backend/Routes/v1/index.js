const router = require("express").Router();

const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const stockRoute = require("./stockRoute"); 
const bannerRoute = require("./bannerRoute"); 
const userRoute = require("./userRoute");
const customerRoute =require('./customerRoute')
const vendorRoute = require("./vendorRoute");
const orderRoute = require("./orderRoute");
const greetRoute = require("./greetRoute");

router.use("/auth", authRoute);
router.use("/categories", categoryRoute);
router.use("/sub-categories", subCategoryRoute);
router.use("/brand", brandRoute);
router.use("/products", productRoute);
router.use("/product", stockRoute);
router.use("/banner", bannerRoute);
router.use("/user", userRoute);
router.use("/customer", customerRoute);
router.use("/vendor", vendorRoute);
router.use("/orders", orderRoute);
router.use("/greets", greetRoute);



module.exports = router;
