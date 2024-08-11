const express = require("express");
const app = express();
require('dotenv').config()
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const { connectMongoDB } = require("./connect");
var cors = require('cors');
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

connectMongoDB(process.env.MONGODB).then(() => {
  console.log("connected to mongodb");
});

app.get("/", (req, res) => {
  res.send("Working fine one 4001 port snaplinker");
});

app.post("/hit", (req, res)=>{
  console.log(req.body);
  console.log("Got a hit");
})

app.use("/api", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  console.log(shortId);
  const originalAddress = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  //res.status(200).json({messge: `found, ${originalAddress}`});
  res.status(200).redirect(originalAddress.redirectUrl);
});



app.listen(process.env.PORT || 4001, (req, res)=>{
  console.log("Working 4001 backend");
});
