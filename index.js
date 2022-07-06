const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const blogRoutes = require("./src/routes/blog");
const categoryRoutes = require("./src/routes/category");
const newsRoutes = require("./src/routes/news");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Swagger
const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./apidocs.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
// End Swagger

// handling upload image
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images"))); // middleware to access images
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// router
app.use("/v1/api/blog", blogRoutes);
app.use("/v1/api/category", categoryRoutes);
app.use("/v1/api/news", newsRoutes);

// handle error
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// serve
// const PORT = process.env.PORT || 3030;
const PORT = 3030;
mongoose
  .connect(
    "mongodb+srv://andito:rYzyTIVsJSDcqSsd@cluster0.7xk47.mongodb.net/myBlog?retryWrites=true&w=majority"
  )

  .then(() => {
    app.listen(PORT, () => console.log("Connection success"));
  })
  .catch((err) => console.log("Error :=> ", err));
