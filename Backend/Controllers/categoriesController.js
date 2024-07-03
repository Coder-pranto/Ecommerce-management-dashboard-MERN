const Category = require("../Models/category");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

class CategoryController {
  async getAllCategories(req, res) {
    try {
      res.status(200).send(await Category.find({}));
    } catch (error) {
      res.status(500).send({ error: "An error occurred" });
    }
  }
  //----------------------------------------------------------------Create a new category --------------------------------

  async saveCategory(req, res) {
    try {
      const alreadyCategory = await Category.findOne({
        name: req.body.name,
      });

      if (!alreadyCategory) {
        if (req.file) {
          const category = new Category({
            name: req.body.name,
            category_image: req.file.filename,
          });

          await category.save();
          res.send({ status: "success", message: "Category Added" });
        } else {
          res.send({
            status: "failed",
            message: "Category image not provided",
          });
        }
      }

      if (alreadyCategory) {
        res.send({ status: "failed", message: "Category Already Existed" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went Wrong" });
    }
  }

  //---------------------------------------Update Category----------------------------------------------------
  async updateCategory(req, res) {
    try {
      const category_id = req.params.category_id;
      const updatedData = {
        name: req.body.name,
      };

      // Check if a new category image is provided
      if (req.file) {
        updatedData.category_image = req.file.filename;

        // If a new image is provided, unlink the existing image (if it exists)
        const existingCategory = await Category.findById(category_id);

        if (existingCategory.category_image) {
          // Unlink (delete) the existing image file from your server
          const existingImagePath = path.join(
            "images",
            existingCategory.category_image
          );
          fs.unlink(existingImagePath, (err) => {
            if (err) {
              console.error("Failed to delete the existing image:", err);
            }
          });
        }
      }

      const result = await Category.findOneAndUpdate(
        {
          _id: category_id,
        },
        {
          $set: updatedData,
          $inc: {
            __v: 1,
          },
        },
        { new: true }
      );

      if (result) {
        res.send({ status: "success", msg: "Category Updated" });
      } else {
        res.send({ status: "failed", msg: "Category Not Found" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went Wrong" });
    }
  }
  // ---------------------------------------------------------------- Delete category --------------------------------
  async deleteCategory(req, res) {
    try {
      const category_id = req.params.category_id;

      // Fetch the category by ID to get the associated image filename
      const category = await Category.findById(category_id);

      if (!category) {
        return res.send({ status: "failed", message: "Category not found" });
      }

      const result = await Category.deleteOne({ _id: category_id });

      if (result.deletedCount > 0) {
        // Check if the category had an associated image
        if (category.category_image) {
          const imagePath = path.join("images", category.category_image);

          // Unlink (delete) the associated image file
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Failed to delete the category image:", err);
            }
          });
        }

        return res.send({
          status: "success",
          message: "Category and associated image deleted",
        });
      } else {
        return res.send({ status: "failed", message: "Category not found" });
      }
    } catch (error) {
      return res.send({ status: "failed", message: "Something Went Wrong" });
    }
  }
  async getCategory(req, res) {
    try {
      const category = await Category.findOne({ _id: req.params.category_id });
      if (category) {
        res.send(category);
      } else {
        res.send({ status: "failed", message: "Category Not Found" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }
}

module.exports = new CategoryController();
