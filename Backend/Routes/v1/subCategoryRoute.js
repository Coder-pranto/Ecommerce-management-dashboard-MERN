const express = require("express");
const router = express.Router();
const subCategoriesController = require("../../Controllers/subCategoryController");
const { imgUpload } = require("../../Middlewares/imageUploadMiddlewares");

router.get("/", subCategoriesController.getAllSubCategories);
router.get("/:id", subCategoriesController.getSubCategory);

router.get(
  "/category/:categoryId",
  subCategoriesController.getSubcategoriesByCategoryId
);

router.post(
  "/",
  imgUpload.single("subCategory_image"),
  subCategoriesController.saveSubCategory
);

router.patch(
  "/:id",
  imgUpload.single("subCategory_image"),
  subCategoriesController.updateSubCategory
);
router.delete("/:id", subCategoriesController.deleteSubCategory);

module.exports = router;
