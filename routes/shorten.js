import express from "express";

import {
    createShortURL,
    getShortURL,
    isValidURL,
    getURLData
} from "../controllers/shorten.js";

const shorten = express.Router();

shorten.post("/", async (req, res) => {
    const { url } = req.body;
    if (!isValidURL(url)) return res.status(400).json({error: "Invalid URL"});
    const result = await createShortURL(url);
    if (!result) return res.status(400).json({error: "Unable to shorten the URL"});
    const fullUrl = req.protocol + '://' + req.get('host');
    res.status(200).json({url: `${fullUrl}/${result}`});
});

shorten.get("/:code", async (req, res) => {
    const code = req.params.code;
    const result = await getShortURL(code);
    if (!result) return res.status(404).json({error: "URL not found"});
    res.redirect(result);
})

shorten.get("/data/:code", async (req, res) => {
    const code = req.params.code;
    const result = await getURLData(code);
    if (!result) return res.status(404).json({error: "URL not found"});
    res.status(200).json(result);
})

export { shorten };
