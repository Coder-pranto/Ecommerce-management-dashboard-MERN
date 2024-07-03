const SubCategory = require("../Models/subCategory");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

class CategoryController {
  async getAllSubCategories(req, res) {
    try {
      const subcategories = await SubCategory.find().populate("categoryId", {
        name: 1,
        category_image: 1,
      });

      res.json({ status: "success", subcategories });
    } catch (error) {
      console.error("Error getting subcategories:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }
  //----------------------------------------------------------------Create a new Sub category --------------------------------

  async saveSubCategory(req, res) {
    try {
      // Extract data from the request body
      const { name, categoryId } = req.body;

      // Create a new SubCategory instance
      const subCategory = new SubCategory({
        name,
        categoryId,
      });

      if (req.file) {
        subCategory.subCategory_image = req.file.filename;
      }

      // Save the subcategory to the database
      await subCategory.save();

      res.json({ status: "success", message: "Subcategory Added" });
    } catch (error) {
      console.error("Error saving subcategory:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }

  //   //---------------------------------------Update Sub Category----------------------------------------------------
  async updateSubCategory(req, res) {
    try {
      const subCategoryId = req.params.id;

      // Fetch the existing subcategory by its ID
      const subCategory = await SubCategory.findById(subCategoryId);

      if (!subCategory) {
        return res
          .status(404)
          .json({ status: "failed", message: "Subcategory not found" });
      }

      // Unlink (delete) the existing subcategory image file if a new image is provided
      if (req.file) {
        if (subCategory.subCategory_image) {
          const imagePath = path.join("images", subCategory.subCategory_image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(
                "Failed to delete the existing subcategory image:",
                err
              );
            }
          });
        }
      }
      subCategory.name = req.body.name;
      if (req.file) {
        subCategory.subCategory_image = req.file.filename;
      }
      // Save the updated subcategory
      await subCategory.save();

      res.json({ status: "success", message: "Subcategory Updated" });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }
  //   // ---------------------------------------------------------------- Delete Sub category --------------------------------
  async deleteSubCategory(req, res) {
    try {
      const subCategoryId = req.params.id;

      // Fetch the existing subcategory by its ID
      const subCategory = await SubCategory.findById(subCategoryId);

      if (!subCategory) {
        return res
          .status(404)
          .json({ status: "failed", message: "Subcategory not found" });
      }

      // Unlink (delete) the subcategory image file if it exists
      if (subCategory.subCategory_image) {
        const imagePath = path.join("images", subCategory.subCategory_image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete the subcategory image:", err);
          }
        });
      }

      // Delete the subcategory from the database
      await SubCategory.deleteOne({ _id: subCategoryId });

      res.json({ status: "success", message: "Subcategory Deleted" });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }
  async getSubCategory(req, res) {
    try {
      const subCategory = await SubCategory.findOne({
        _id: req.params.id,
      }).populate("categoryId", { name: 1, category_image: 1 });
      if (subCategory) {
        res.send(subCategory);
      } else {
        res.send({ status: "failed", message: "Sub Category Not Found" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }
  async getSubcategoriesByCategoryId(req, res) {
    try {
      const categoryId = req.params.categoryId;

      // Find subcategories that have a matching categoryId
      const subcategories = await SubCategory.find({ categoryId });

      res.json({ status: "success", subcategories });
    } catch (error) {
      console.error("Error getting subcategories by category ID:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }
}

module.exports = new CategoryController();
