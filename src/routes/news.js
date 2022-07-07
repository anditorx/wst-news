const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const newsController = require("../controllers/news");
const NewsPost = require("../models/news_model");

// router.get("/", newsController.getAllNews);
router.get("/", newsController.getNews);
router.get("/:key", newsController.getNewsSearch);
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
