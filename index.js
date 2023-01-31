const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const app = express();

app.use(cors());

app.use(express.json());


/* const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userName: String,
  confirm: Boolean,
  created_date: String,
});
const User = mongoose.model("User", UserSchema);
const secretKey = "deneme";
const tokenExpiresIn = "1h";
const refreshTokenExpiresIn = "24h";

const middleware = (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      return res.status(402).json({ message: "Invalid token" });
    }
  }
};
 */
app.get("/",(req,res)=>{
  res.status(200).json("Hello world :)")
})
/* 
app.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.status(417).json({ message: "Kullanıcı zaten kayıtlı." });
    } else if (err) {
      res.status(500).json(err);
    } else {
      new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        userName: req.body.userName,
        confirm: req.body.confirm,
        created_date: req.body.created_date,
      }).save();
      res.status(201).json({
        user: User,
        message: "Kayıt başarılı.",
      });
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    const password = user.password;
    if (user && password === req.body.password) {
      const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: tokenExpiresIn });
      const refreshtoken = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: refreshTokenExpiresIn });
      res.status(201).json({ message: "Giriş Başarılı", token: token, refreshtoken: refreshtoken });
    } else if (user && password !== req.body.password) {
      res.status(401).json({ message: "Şifren Yanlış" });
    } else {
      res.status(402).json({ message: "Kullanıcı Bulunamadı" });
    }
  });
});

app.get("/user", middleware, (req, res) => {
  User.find({}).then(function (users) {
    res.status(201).json(users);
  });
});

app.post("/user/:id", middleware, (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.findOne({ _id: "id" }).then((err, user) => {
    if (user) {
      res.status(200).json({ user });
      console.log(user);
      console.log(_id);
    } else if (err) {
      res.status(500).json({ message: "Hatalı İşlem." });
    } else {
      res.status(400).json({ message: "Kullanıcı Bulunamadı." });
    }
  });
});

app.post("/refreshtoken", async (req, res) => {
  const refreshTokenControl = req.body.refreshToken;
  try {
    const valideTokenControl = await jwt.verify(refreshTokenControl, secretKey);
    if (valideTokenControl) {
      const token = jwt.sign({ id: refreshTokenControl.id }, secretKey, { expiresIn: tokenExpiresIn });
      return res.status(201).json(token);
    }
  } catch (error) {
    return res.status(401).json("tokenın süresi bitti");
  }
}); */

app.listen(4000, () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://localhost:27017/register", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    })
    .then(() => console.log("okey"))
    .catch(() => console.log("no"));
});
