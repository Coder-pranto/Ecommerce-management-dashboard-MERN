const router = require("express").Router();
const stockController = require("../../Controllers/stockController");

router.get("/get-stock", stockController.getStock);
router.post("/add-stock", stockController.addStock);
router.delete("/delete-stock", stockController.deleteStock);

module.exports = router;
