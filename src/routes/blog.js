const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const blogController = require("../controllers/blog");

router.get("/", blogController.getAllBlog);
router.get("/:id", blogController.getBlogByID);
router.post(
  "/",
  [
    body("title").isLength({ min: 3 }).withMessage("incorrect value"),
    body("body").isLength({ min: 3 }).withMessage("incorrect value"),
  ],
  blogController.createBlog
);
router.put(
  "/:id",
  [
    body("title").isLength({ min: 3 }).withMessage("incorrect value"),
    body("body").isLength({ min: 3 }).withMessage("incorrect value"),
  ],
  blogController.updateBlog
);

router.delete("/:id", blogController.deleteData);

module.exports = router;
