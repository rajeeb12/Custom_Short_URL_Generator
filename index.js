const express = require("express");
const app = express();
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const {connectMongoDB} = require("./connect");

app.use(express.json());

connectMongoDB('mongodb+srv://process.env.USERNAME:process.env.PASSWORD@cluster0.sjbw6il.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('connected to mongdb');
});

app.get('/',(req, res)=>{
    res.send("Working fine one 4000 port");
})

app.use('/url', urlRoute);

app.get('/:shortId',async (req, res)=>{
    const shortId = req.params.shortId;
    console.log(shortId);
    const originalAddress = await URL.findOneAndUpdate({shortId},{
        $push:{
            visitHistory : {
                timestamps: Date.now(),
            }
        }
    });
    //res.status(200).json({messge: `found, ${originalAddress}`});
    res.status(200).redirect(originalAddress.redirectUrl);
})

app.listen(4001);