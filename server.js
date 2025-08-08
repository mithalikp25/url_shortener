require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('./models/Url');
const { nanoid } = require('nanoid');


const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI).
then(() => console.log('connected to MongoDB atlas')).
catch((err) => console.log(err));


app.post('/shorten', async (req, res) => {
    const originalUrl = req.body.originalUrl;

    if(!originalUrl) {
        return res.status(400).json({message:'Please provide a valid URL!'});
    }

    const shortUrl = nanoid(6);

    const newUrl = new Url({originalUrl, shortUrl});

    await newUrl.save();

    const fullShortUrl = `${req.protocol}://${req.get('host')}/${shortUrl}`;
    res.json({message:`Short URL: ${fullShortUrl}`});
})

app.get("/:shortUrl", async (req, res) => {
    const {shortUrl} = req.params;

    const url = await Url.findOne({shortUrl});
    if(!url) {
        return res.status(404).json({message:'URL not found!'});
    }

    res.redirect(url.originalUrl);
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

