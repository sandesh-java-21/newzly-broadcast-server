const express = require("express");
const app = express();
const cors = require("cors");

const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = {};

cloudinary.config({
  cloud_name: "dm7vpvqcp",
  api_key: "741937426577852",
  api_secret: "82YbkfiiRG1p-OyVxoCUH9IgF-c",
  secure: true,
});

const mongoose = require("mongoose");

const News = require("./models/News");

const newsRoutes = require("./routes/News");
const e = require("express");

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 50000 })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

const http = require("http").createServer(app);
app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://newzly-zabefest.000webhostapp.com"
  ); // replace with your frontend URL
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(newsRoutes);

app.post("/upload-news", async (req, res) => {
  try {
    var { title, image } = req.body;

    if (!title || title === "" || !image || image === "") {
      res.json({
        message: "Required Fields Are Empty!",
        status: "400",
      });
    } else {
      cloudinary.uploader
        .upload(`data:image/jpeg;base64,${image}`, {
          folder: "news",
        })
        .then(async (onCloudUpload) => {
          console.log("on cloud upload: ", onCloudUpload);

          var imageUrl = onCloudUpload.secure_url;

          var newsObj = new News({
            title: title,
            image: imageUrl,
          });

          var savedNews = await newsObj
            .save()
            .then(async (onSave) => {
              console.log("on save: ", onSave);

              io.emit("new-news", {
                data: {
                  title: onSave.title,
                  image: onSave.image,
                },
              });

              res.json({
                message: "News Published!",
                status: "200",
                publishedNews: onSave,
              });
            })
            .catch(async (onSaveError) => {
              console.log("on save error: ", onSaveError);
              res.json({
                message: "Something went wrong while uploading news to cloud!",
                status: "400",
                error: onSaveError,
              });
            });
        })
        .catch(async (onCloudUploadError) => {
          console.log("on cloud upload error!", onCloudUploadError);
          res.json({
            message: "Something went wrong while uploading news to cloud!",
            status: "400",
            error: onCloudUploadError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
});

app.post("/show-again/:news_id", async (req, res) => {
  try {
    var news_id = req.params.news_id;
    if (!news_id || news_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var news = await News.findById(news_id)
        .then(async (onNewsFound) => {
          console.log("on news found: ", onNewsFound);
          io.emit("new-news", {
            data: {
              title: onNewsFound.title,
              image: onNewsFound.image,
            },
          });
          res.json({
            message: "News Broadcasted Again!",
            status: "200",
          });
        })
        .catch(async (onNewsFoundError) => {
          console.log("on news found error: ", onNewsFoundError);
          res.json({
            message: "No News Found With Provided Id!",
            status: "404",
            error: onNewsFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal Server Error!",
      status: "500",
      error,
    });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);
});

const PORT = 4000;
http.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  await mongoose
    .connect(
      "mongodb+srv://newsy:BN7pG5VjOlCnV3d@newsy-cluster-1.imutdib.mongodb.net/zabefestDB"
    )
    .then((onConnect) => {
      console.log("ZAB-E-FEST Database Connection Established!");
    })
    .catch(async (onError) => {
      console.log("Error Occurred While Connecting To Database!");
    });
});

module.exports = {
  http,
};
