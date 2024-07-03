const Brand = require("../Models/brand");
const fs = require("fs");

class BrandController {
  async getAllBrand(req, res) {
    try {
      res.status(200).send(await Brand.find({}));
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async getBrand(req, res) {
    try {
      const alreadyBrand = await Brand.findOne({ _id: req.params.id });
      res.status(200).send(alreadyBrand);
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async saveBrand(req, res) {
    try {
      if (req.file) {
        const alreadyBrand = await Brand.findOne({
          name: req.body.name,
        });
        if (alreadyBrand) {

          try {
            fs.unlinkSync(req?.file?.destination + "/" + req?.file?.filename);
          } catch (err) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
          }
          return res.send({ status: "failed", message: "Brand Already Added" });
        }
        const brand = new Brand({
          name: req.body.name,
          address: req.body.address,
          contact_no: req.body.contact_no,
          brand_logo: req?.file?.destination + "/" + req?.file?.filename,
        });
        const result = brand.save();
        return res.send({ status: "success", message: "Brand Added", data: result });
      } else {
        return res.send({ status: "failed", message: "Image Not Uploaded" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async updateBrand(req, res) {
    try {
      const brandId = req.params.id;

      const existingBrand = await Brand.findById(brandId);

      if (!existingBrand) {
        return res
          .status(404)
          .json({ status: "failed", message: "Brand not found" });
      }

      if (req.file) {
        // If an image is provided, update the brand logo and unlink the existing logo if it exists
        if (existingBrand.brand_logo) {
          // Unlink (delete) the existing brand logo file
          fs.unlinkSync(existingBrand.brand_logo);
        }

        // Update the brand logo with the new image
        existingBrand.brand_logo =
          req.file.destination + "/" + req.file.filename;
      }

      if (req.body.name) {
        existingBrand.name = req.body.name;
      }

      if (req.body.address) {
        existingBrand.address = req.body.address;
      }

      if (req.body.contact_no) {
        existingBrand.contact_no = req.body.contact_no;
      }

      await existingBrand.save();

      res.json({ status: "success", message: "Brand Updated" });
    } catch (error) {
      console.error("Error updating brand:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }

  async deleteBrand(req, res) {
    try {
      const brandId = req.params.id;

      // Fetch the existing brand by its ID
      const brand = await Brand.findById(brandId);

      if (!brand) {
        return res
          .status(404)
          .json({ status: "failed", message: "Brand not found" });
      }

      // Unlink (delete) the brand logo file if it exists
      if (brand.brand_logo) {
        fs.unlinkSync(brand.brand_logo);
      }

      // Delete the brand from the database
      await Brand.deleteOne({ _id: brandId });

      res.json({ status: "success", message: "Brand Deleted" });
    } catch (error) {
      console.error("Error deleting brand:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Something Went Wrong" });
    }
  }
}

module.exports = new BrandController();
