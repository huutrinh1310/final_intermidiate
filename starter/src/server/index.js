const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup the express assets path
app.use("/", express.static(path.join(__dirname, "../client")));

// API calls ------------------------------------------------------------------------------------
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/race", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/race.html"));
});

app.get("/progress", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/progress.html"));
});

app.get("/results", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/results.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
