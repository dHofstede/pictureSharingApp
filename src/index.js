const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
require("dotenv").config();

app.use(express.json());
app.use(authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
