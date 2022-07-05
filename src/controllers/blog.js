const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog_model");
const path = require("path");
const fs = require("fs");

exports.getAllBlog = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalData;

  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return BlogPost.find()
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

exports.getBlogByID = (req, res, next) => {
  const id = req.params.id;
  BlogPost.findById(id)
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

exports.createBlog = (req, res, next) => {
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

  const PostingBlog = new BlogPost({
    title: req.body.title,
    body: req.body.body,
    image: image,
    author: { uid: 1, name: "Andito" },
  });

  PostingBlog.save()
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Success create new blog",
        data: result,
      });
    })
    .catch((err) => {
      console.log("Error [create new blog] => ", err);
      next(err);
    });
};

exports.updateBlog = (req, res, next) => {
  const { id } = req.params;
  const { title, image, body } = req.body;
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

  BlogPost.findById(id)
    .then((post) => {
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }

      post.title = title;
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
  BlogPost.findById(id)
    .then((post) => {
      // validasi inputan
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }
      console.log("post", post);
      // hapus image
      removeImage(post.image);
      // hapus dari database
      return BlogPost.findByIdAndRemove(id);
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
