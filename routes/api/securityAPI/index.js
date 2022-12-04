const express = require('express');
let router = express.Router();

router.get('/security', async (req, res) => {
    console.log(process.env.APP_API_KEY);
  return res.status(200).json(process.env.APP_API_KEY);
});


module.exports = router;
