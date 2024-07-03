require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { checkJwt } = require("./Middlewares/authMiddlewares");
const Routes = require("./Routes/v1/index");
const app = express();
const port = process.env.PORT || 4545;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));


app.use("/api/v1/images", express.static("images"));

// Connect Database
const { mongoConnect } = require("./Util/Database");
mongoConnect(
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  })
);

// All Routes Export
app.use("/api/v1", Routes);


//Initial Route
app.get("/api/v1", (req, res) => {
  res.send("Server is running");
});


// Default Get API
app.get("/", checkJwt, (req, res) => {
  res.send("Hello From Node Mongo eCommerce Server");
});
