require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

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

app.post("/api/suggestions", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query required" });
  }

  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search`,
      {
        params: {
        api_key: process.env.API_KEY,
        query,
        pageSize: 5,
      }
      }
    );

    const foods = response.data.foods;

    if (!foods) return res.json([]);

    const suggestions = foods.map(food => food.description);

    res.json(suggestions);

  } catch (error) {
    console.error("Suggestion error:", error.message);
    res.status(500).json({ message: "Suggestion failed" });
  }
});
app.post("/api/nutrition", async (req, res) => {
  const { food } = req.body;

  if (!food) {
    return res.status(400).json({ message: "Food required" });
  }

  try {
    const response = await axios.post(
      `https://api.nal.usda.gov/fdc/v1/foods/search`,
      {
         params: {
        api_key: process.env.API_KEY,
        query:food,
        pageSize: 1,
         }
      }
    );

    const foods = response.data.foods;
    if (!foods || foods.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    const nutrients = foods[0].foodNutrients;

    const getNutrient = (name) => {
      const nutrient = nutrients.find(n =>
        n.nutrientName?.toLowerCase().includes(name.toLowerCase())
      );
      return nutrient?.value || 0;
    };

    res.json({
      carbs: getNutrient("Carbohydrate"),
      sugars: getNutrient("Sugars"),
      protein: getNutrient("Protein"),
    });

  } catch (error) {
    console.error("Nutrition error:", error.message);
    res.status(500).json({ message: "Nutrition lookup failed" });
  }
});
app.get("/", (req, res) => {
  res.send("Health Is Wealth API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});