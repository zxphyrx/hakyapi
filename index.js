import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

let data = JSON.parse(fs.readFileSync("./data.json"));

app.get("/api", (req, res) => {
    res.json(data);
})

app.get("/api/search", (req, res) => {
    let result = new Set([]);

        for(let key of Object.keys(req.query)) {
            result.add(data.filter((c) => {
                return  c[key] == req.query[key];
            }))
        }

    res.json(...result)
})

app.listen(3000, () => {
    console.log("API running on http://localhost:3000")
})
