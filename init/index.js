const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj,owner: "6690c57afdb941f2a5e37033"}))
  // map fn data array me changes nhi krta balki new array create krta. ...obj is used to have all old properties and adding owner as a new property.
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();