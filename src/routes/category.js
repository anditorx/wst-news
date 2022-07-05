const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoryController = require("../controllers/category");

router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryByID);
router.post(
  "/",
  [body("name").isLength({ min: 3 }).withMessage("incorrect value")],
  categoryController.createCategory
);
router.put(
  "/:id",
  [body("name").isLength({ min: 3 }).withMessage("incorrect value")],
  categoryController.updateCategory
);

router.delete("/:id", categoryController.deleteData);

module.exports = router;
