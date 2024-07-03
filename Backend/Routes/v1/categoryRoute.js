const express = require("express");
const router = express.Router();
//Middlewares imports
const categoriesController = require("../../Controllers/categoriesController");
const { imgUpload } = require("../../Middlewares/imageUploadMiddlewares");

router.get("/", categoriesController.getAllCategories);
router.get("/:category_id", categoriesController.getCategory);

router.post(
  "/",
  imgUpload.single("category_image"),
  categoriesController.saveCategory
);

router.patch(
  "/:category_id",
  imgUpload.single("category_image"),
  categoriesController.updateCategory
);
router.delete("/:category_id", categoriesController.deleteCategory);

module.exports = router;
