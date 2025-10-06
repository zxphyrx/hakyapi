import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

let data = JSON.parse(fs.readFileSync("./data.json"));

app.get("/api", (req, res) => {
    res.json(data);
})

app.get("/api/:id", (req, res) => {
    const character = data.find((c) => c.id === Number(req.params.id));

    res.json(character);
})

app.listen(3000, () => {
    console.log("API running on http://localhost:3000")
})
