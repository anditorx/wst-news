const { validationResult } = require("express-validator");
const NewsPost = require("../models/news_model");
const path = require("path");
const fs = require("fs");

exports.getAllNews = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalData;

  NewsPost.find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return NewsPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(200).json({
        message: "Success get all data",
        totalData: totalData,
        perPage: parseInt(perPage),
        currentPage: parseInt(currentPage),
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getNews = (req, res, next) => {
  const filters = req.query;
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  let totalData;

  NewsPost.find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return NewsPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      const filteredData = result.filter((user) => {
        let isValid = true;
        for (key in filters) {
          isValid = isValid && user[key] == filters[key];
        }
        return isValid;
      });

      res.status(200).json({
        message: "Success get all data",
        totalData: totalData,
        perPage: parseInt(perPage),
        currentPage: parseInt(currentPage),
        data: filteredData,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getNewsSearch = (req, res, next) => {
  NewsPost.find({
    $or: [
      { body: { $regex: req.params.key } },
      { title: { $regex: req.params.key } },
    ],
  })
    .then((result) => {
      res.status(200).json({
        message: "Success get data",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getNewsByID = (req, res, next) => {
  const id = req.params.id;
  NewsPost.findById(id)
    .then((result) => {
      if (!result) {
        const error = new Error("Data not found");
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        message: "Success get data " + id,
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createNews = (req, res, next) => {
  const errors = validationResult(req);

  //validation
  if (!errors.isEmpty()) {
    const err = new Error("Invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }
  if (!req.file) {
    const err = new Error("Image not uploaded");
    err.errorStatus = 422;
    throw err;
  }

  const image = req.file.path;

  const PostingNews = new NewsPost({
    title: req.body.title,
    category: req.body.category,
    body: req.body.body,
    image: image,
    author: { uid: 1, name: "Andito" },
  });

  PostingNews.save()
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Success create news",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateNews = (req, res, next) => {
  const { id } = req.params;
  const { title, category, image, body } = req.body;
  const errors = validationResult(req);

  // valadasi
  if (!errors.isEmpty()) {
    const err = new Error("Invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  // validasi file
  if (!req.file) {
    const err = new Error("Image not uploaded");
    err.errorStatus = 422;
    throw err;
  }

  NewsPost.findById(id)
    .then((post) => {
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }

      post.title = title;
      post.category = category;
      post.body = body;
      post.image = req.file.path;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Success update data",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteData = (req, res, next) => {
  const { id } = req.params;
  NewsPost.findById(id)
    .then((post) => {
      // validasi inputan
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }
      // hapus image
      removeImage(post.image);
      // hapus dari database
      return NewsPost.findByIdAndRemove(id);
    })
    .then((result) => {
      res.status(200).json({
        message: "Success delete data",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
