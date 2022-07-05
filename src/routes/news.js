const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const newsController = require("../controllers/news");

// router.get("/", newsController.getAllNews);
router.get("/", newsController.getNews);
router.get("/:id", newsController.getNewsByID);
router.post(
  "/",
  [
    body("title").isLength({ min: 3 }).withMessage("incorrect value"),
    body("category").isLength({ min: 3 }).withMessage("incorrect value"),
    body("body").isLength({ min: 3 }).withMessage("incorrect value"),
  ],
  newsController.createNews
);
router.put(
  "/:id",
  [
    body("title").isLength({ min: 3 }).withMessage("incorrect value"),
    body("category").isLength({ min: 3 }).withMessage("incorrect value"),
    body("body").isLength({ min: 3 }).withMessage("incorrect value"),
  ],
  newsController.updateNews
);

router.delete("/:id", newsController.deleteData);

module.exports = router;
