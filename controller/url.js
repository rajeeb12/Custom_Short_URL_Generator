const shortid = require("shortid");
const URL = require("../models/url");
const Replicate = require("replicate");
//const nanoid = require('nanoid');
const { v4: uuidv4 } = require("uuid");
const { put } = require("@vercel/blob");
const axios = require("axios");

async function handlegenerateNewShortUrl(req, res) {
  const { url, prompt } = req.body;
  // const body = req.body;
  console.log(url);
  //short url
  if (!url) return res.status(400).json({ error: "url is  required" });
  const shortId = shortid();
  await URL.create({
    shortId: shortId,
    redirectUrl: url,
    visitHistory: [],
  });

  //qr generator
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const output = await replicate.run(
    "zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557",
    {
      input: {
        eta: 0,
        url: url,
        prompt: prompt,
        scheduler: "DDIM",
        guess_mode: false,
        num_outputs: 1,
        guidance_scale: 9,
        negative_prompt:
          "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
        image_resolution: 768,
        num_inference_steps: 20,
        disable_safety_check: false,
        qr_conditioning_scale: 1.3,
      },
    }
  );
  console.log(output[0]);
  const id = uuidv4();

  const data = await downloadAndStorageImage(output[0], `${id}.png`);
  const blobUrl = data[0];
  const downloadUrl = data[1];

  return res.status(200).json({ id: shortId, imageUrl: blobUrl , downloadUrl: downloadUrl});
}

async function handleAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClick: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function downloadAndStorageImage(imageUrl, filename) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // store in vercel blob storage
    const blob = await put(filename, buffer, { access: "public" });
    console.log(blob);
    return [blob.url, blob.downloadUrl];
  } catch (error) {
    console.error("Error downloading or storing image:", error);
    throw error;
  }
}

async function handleTest(res, req){
  res.send("Testing is working");
} 

module.exports = {
  handlegenerateNewShortUrl,
  handleAnalytics,
  handleTest,
};
