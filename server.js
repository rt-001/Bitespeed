require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const identifyRoute = require("./routes/identify");

const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

app.use(bodyParser.json());
app.use("/identify", identifyRoute);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend is up at port ${PORT}.`);

  mongoose.set("strictQuery", true);
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully."))
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    });
});
