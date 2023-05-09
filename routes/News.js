const express = require("express");

const router = express.Router();

const {
  getSliderNews,
  getAllNews,
  getTotalNewsCount,
} = require("../controllers/News");

router.get("/get-slider-news", getSliderNews);
router.get("/get-all-news", getAllNews);
router.get("/get-total-news-count", getTotalNewsCount);

module.exports = router;
