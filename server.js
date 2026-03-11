require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let readings = [];
let meals = [];

app.get("/api/readings", (req, res) => {
  res.status(200).json(readings);
});

app.post("/api/readings", (req, res) => {
  const newReading = {
    id: Date.now().toString(),
    ...req.body,
  };

  readings.push(newReading);
  res.status(201).json(newReading);
});

app.put("/api/readings/:id", (req, res) => {
  const { id } = req.params;
  const index = readings.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Reading not found" });
  }

  readings[index] = { ...readings[index], ...req.body };
  res.json(readings[index]);
});

app.delete("/api/readings/:id", (req, res) => {
  const { id } = req.params;
  const index = readings.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Reading not found" });
  }

  const deleted = readings.splice(index, 1);
  res.json({ message: "Reading deleted", data: deleted[0] });
});


app.get("/api/meals", (req, res) => {
  res.status(200).json(meals);
});

app.post("/api/meals", (req, res) => {
  const newMeal = {
    id: Date.now().toString(),
    ...req.body,
  };

  meals.push(newMeal);
  res.status(201).json(newMeal);
});

app.put("/api/meals/:id", (req, res) => {
  const { id } = req.params;
  const index = meals.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Meal not found" });
  }

  meals[index] = { ...meals[index], ...req.body };
  res.json(meals[index]);
});

app.delete("/api/meals/:id", (req, res) => {
  const { id } = req.params;
  const index = meals.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Meal not found" });
  }

  const deleted = meals.splice(index, 1);
  res.json({ message: "Meal deleted", data: deleted[0] });
});


app.get("/", (req, res) => {
  res.send("Health Is Wealth API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});