const spdy = require("spdy");
const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const { createServer } = require("http");

const readFile = promisify(fs.readFile);

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    if (res.push) {
      ["/one.js", "/two.js", "/cat.jpg"].forEach(async (file) => {
        res.push(file, {}).end(await readFile(`public${file}`));
      });
    }

    res.writeHead(200);
    res.end(await readFile("index.html"));
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = function createServer() {
  spdy
    .createServer(
      {
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.crt"),
      },
      app
    )
    .listen(5001, (err) => {
      if (err) {
        throw new Error(err);
      }
      console.log("HTTP2 server is listening on port 5001");
    });
};
