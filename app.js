// const express = require("express");
import express from "express";
import getDate from "./date.js";
import mongoose from "mongoose";

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Yash_Pandey:gXEWmqOijznX72UU@cluster0.lfy8v.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy Food",
});

const item2 = new Item({
  name: "Cook Food",
});

const item3 = new Item({
  name: "Eat Food",
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB.");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { kindOfDay: getDate(), newListItem: foundItems });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;

  const anotherItem = new Item({
    name: itemName,
  });

  anotherItem.save();

  res.redirect("/");
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkboxName;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Item Deleted Successfully!");
      res.redirect("/");
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
