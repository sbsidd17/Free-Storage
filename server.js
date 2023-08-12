const express = require("express");
require("dotenv").config();
const fileRouter = require("./Routes/fileRoutes");
const cors = require("cors")

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors({}))
app.use(express.json());

app.use("/", fileRouter);

app.listen(PORT, (req, res) => {
  console.log(`App is running on Port : ${PORT}`);
});
