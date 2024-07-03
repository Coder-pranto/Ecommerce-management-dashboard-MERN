const express = require("express");
const router = express.Router();
const brandController = require("../../Controllers/brandController");
const { imgUpload } = require("../../Middlewares/imageUploadMiddlewares");


router.get("/", brandController.getAllBrand);
router.get("/:id", brandController.getBrand);
router.post("/", imgUpload.single("brand_logo"), brandController.saveBrand);
router.patch(
  "/:id",
  imgUpload.single("brand_logo"),
  brandController.updateBrand
);
router.delete("/:id", brandController.deleteBrand);

module.exports = router;
