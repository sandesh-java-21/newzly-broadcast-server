const mongoose = require("mongoose");
const newsSchema = mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: "",
  },
  image: {
    type: String,
    required: false,
    default: "",
  },
});

var newsModel = mongoose.model("news", newsSchema);

module.exports = newsModel;
