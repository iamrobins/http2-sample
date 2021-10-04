const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.writeHead(200);
  res.end(await readFile("index.html"));
});

module.exports = function createServer() {
  app.listen(5000, () =>
    console.log("HTTP1.1 server is listening on port 5000")
  );
};
