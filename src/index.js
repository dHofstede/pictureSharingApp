const express = require("express");
const { expressjwt } = require("express-jwt");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const photoRoute = require("./routes/photoRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  expressjwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/authorize", "/createUser"] })
);

//Endpoints
app.use(authRoute);
app.use(userRoute);
app.use(photoRoute);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
