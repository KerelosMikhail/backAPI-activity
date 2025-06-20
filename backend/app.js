const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Product = require("./models/Product");
const uri =
  "mongodb+srv://kerelosmikhail:0M9bR06hdY0Go6NG@cluster0.kza7m8q.mongodb.net/backAPI?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Unable to connect ", error);
  });
//try: npm install mongodb')

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// /api/products    ---> Done
app.get("/api/products", (req, res, next) => {
  Product.find()
    .then((products) => {
      res.status(200).json({ products });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || "Failed to retrieve products",
      });
    });
});

//  /api/products/:id     ---> Done
app.get("/api/products/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ product });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || "Failed to retrieve product",
      });
    });
});

// /api/products    ---> Done
app.post("/api/products", (req, res, next) => {
  const { name, description, price, inStock } = req.body;

  // Basic validation
  if (!name || !description || price == null || inStock == null) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const product = new Product({
    name,
    description,
    price,
    inStock,
  });

  product
    .save()
    .then((savedProduct) => {
      res.status(201).json({
        message: "Product saved successfully!",
        product: savedProduct,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || error,
      });
    });
});

// PUT /api/products/:id  ---> Done
// app.put("/api/products/:id", (req, res, next) => {
//   const product = new Product({
//     _id: req.params.id,
//     name: req.body.name,
//     description: req.body.description,
//     price: req.body.price,
//     inStock: req.body.inStock,
//   });

//   Product.updateOne({ _id: req.params.id }, product)
//     .then(() => {
//       res.status(201).json({
//         message: "Modified!",
//       });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         error: error,
//       });
//     });
// });

app.put("/api/products/:id", (req, res, next) => {
  const { name, description, price, inStock } = req.body;

  // Basic validation
  if (!name || !description || price == null || inStock == null) {
    return res.status(400).json({ error: "All fields are required." });
  }

  Product.updateOne(
    { _id: req.params.id },
    { name, description, price, inStock }
  )
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message || error });
    });
});

// DELETE /api/products/:id     ---> Done
// app.delete("/api/products/:id", (req, res, next) => {
//   Product.deleteOne({ _id: req.params.id })
//     .then(() => {
//       res.status(200).json({
//         message: "Deleted!",
//       });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         error: error,
//       });
//     });
// });

app.delete("/api/products/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || error,
      });
    });
});

// Export the app for use in server.js
module.exports = app;
