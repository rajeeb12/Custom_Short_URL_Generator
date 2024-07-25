const express = require("express");
const {handlegenerateNewShortUrl, handleAnalytics, handleTest} = require("../controller/url"); 
const router = express.Router();

router.post('/generate', handlegenerateNewShortUrl);
router.get('/analytics/:shortId', handleAnalytics);
router.get('/test', handleTest);

module.exports = router;