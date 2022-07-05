const { validationResult } = require("express-validator");
const CategoryPost = require("../models/category_model");
const path = require("path");
const fs = require("fs");

exports.getAllCategory = (req, res, next) => {
  CategoryPost.find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return CategoryPost.find();
    })
    .then((result) => {
      res.status(200).json({
        message: "Success get all data",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCategoryByID = (req, res, next) => {
  const id = req.params.id;
  CategoryPost.findById(id)
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

exports.createCategory = (req, res, next) => {
  const errors = validationResult(req);

  //validation
  if (!errors.isEmpty()) {
    const err = new Error("Invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const PostingCategory = new CategoryPost({
    name: req.body.name,
    author: { uid: 1, name: "Andito" },
  });

  PostingCategory.save()
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Success create new category",
        data: result,
      });
    })
    .catch((err) => {
      console.log("Error [create new category] => ", err);
      next(err);
    });
};

exports.updateCategory = (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const errors = validationResult(req);

  // valadasi
  if (!errors.isEmpty()) {
    const err = new Error("Invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  CategoryPost.findById(id)
    .then((post) => {
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }

      post.name = name;

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
  CategoryPost.findById(id)
    .then((post) => {
      // validasi inputan
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }

      // hapus dari database
      return CategoryPost.findByIdAndRemove(id);
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
