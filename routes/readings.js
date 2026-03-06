const express = require("express");
const router = express.Router();

let readings = [
  { id: 1, date: "2026-03-05", time: "08:00", level: 102 },
  { id: 2, date: "2026-03-05", time: "14:00", level: 180 }
];

router.get("/", (req, res) => {
  res.json(readings);
});

router.post("/", (req, res) => {
  const { date, time, level } = req.body;

  const newReading = {
    id: readings.length + 1,
    date,
    time,
    level
  };

  readings.push(newReading);

  res.status(201).json(newReading);
});

module.exports = router;