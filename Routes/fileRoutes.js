const { Router } = require('express');
const { fileUpload } = require('../controller/fileUpload');

const fileRouter = Router();

fileRouter.get("/", (req, res) => {
    res.send("Free Storage Backend");
  });

fileRouter.get('/api/v1/file', (req, res) => {
    res.status(200).type('text/plain').send('upload api working');
});

fileRouter.post("/api/v1/file/upload", fileUpload)

module.exports = fileRouter;
