require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/books");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  console.log("bağlandı port");

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected", conn.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send({ title: "books" });
});

app.get("/add-note", async (req, res) => {
  try {
    await Book.insertMany([
      {
        title: "kitap 1",
        required: "body 1",
      },
      {
        title: "kitap 2",
        required: "body 2",
      },
    ]);
    res.send("add notes");
  } catch (error) {
    console.log(error, "errr");
  }
});

app.get("/books", async (req, res) => {
  const book = await Book.find();
  if (book) {
    res.json(book);
  } else {
    res.send("falan filan");
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("bağlandı port");
  });
});
