require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const connectDB = async () => {
  console.log("bağlandı port");
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected", connect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

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

app.get("/", (req, res) => {
  res.send({ title: "hello" });
});

const UserSchema = new mongoose.Schema({
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


app.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.status(417).json({ message: "Kullanıcı zaten kayıtlı." });
    } else if (err) {
      res.status(500).json(err);
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(500).json(err);
        } else {
          new User({
            email: req.body.email,
            password: hash,
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
    }
  });
});


app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    const password = user.password;
    if (user && password === req.body.password) {
      const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: tokenExpiresIn });
      const refreshtoken = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: refreshTokenExpiresIn });
      res.status(201).json({ message: "Giriş Başarılı", token: token, refreshtoken: refreshtoken, user: user });
    } else if (user && password !== req.body.password) {
      res.status(401).json({ message: "Şifren Yanlış" });
    } else {
      res.status(402).json({ message: "Kullanıcı Bulunamadı" });
    }
  });
});

app.put("/profile/:id", (req, res) => {
  const userId = req.params.id;
  const name = req.params.id;
  const email = req.params.id;
  const userName = req.params.id;
  const password = req.params.id;

  User.findOneAndUpdate(
    { _id: userId },
    { $set: { name: name, email: email, userName: userName, password: password } },
    { returnOriginal: false },
    (err, result) => {
      if (result) {
        return res.status(200).json({ message: "Başarılı" });
      }
      if (err) {
        return res.status(401).json({ message: "Hata" });
      }
    }
  );
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("bağlandı port", PORT);
  });
});
