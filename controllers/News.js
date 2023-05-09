const News = require("../models/News");

const getSliderNews = async (req, res) => {
  try {
    var sliderNews = await News.find()
      .sort({
        _id: -1,
      })
      .limit(15)
      .then(async (onNewsFound) => {
        console.log("on news found: ", onNewsFound);
        var empty = onNewsFound.length <= 0;
        if (empty) {
          res.json({
            message: "No news found!",
            status: "404",
            sliderNews: [],
          });
        } else {
          res.json({
            message: "News found!",
            status: "200",
            sliderNews: onNewsFound,
          });
        }
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getAllNews = async (req, res) => {
  try {
    var allNews = await News.find()
      .sort({
        _id: -1,
      })
      .then(async (onNewsFound) => {
        console.log("on news found: ", onNewsFound);
        res.json({
          message: "News Found!",
          status: "200",
          allNews: onNewsFound,
        });
      })
      .catch(async (onNewsFoundError) => {
        console.log("on news found error: ", onNewsFoundError);
        res.json({
          message: "Something went wrong while getting posted news!",
          status: "400",
          error: onNewsFoundError,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getTotalNewsCount = async (req, res) => {
  try {
    var data = await News.find()
      .then(async (onNewsFound) => {
        res.json({
          message: "Total count!",
          status: "200",
          postedNewsCount: onNewsFound.length,
        });
      })
      .catch(async (onNewsFoundError) => {
        res.json({
          message: "Total count!",
          status: "200",
          postedNewsCount: 0,
          error: onNewsFoundError,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  getSliderNews,
  getAllNews,
  getTotalNewsCount,
};
