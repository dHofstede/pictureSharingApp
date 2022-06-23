const express = require("express");
// const formData = require("express-form-data");
// const os = require("os");
const { expressjwt } = require("express-jwt");
const upload = require("./utils/uploadMiddleWare");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const test = require("./routes/test");
const photoRoute = require("./routes/photoRoute");
require("dotenv").config();

const app = express();

// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true,
// };

// app.use(formData.parse(options));

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
app.use(test);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
