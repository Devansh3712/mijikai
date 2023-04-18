import express from "express";

import { shorten } from "./routes/shorten.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("", shorten);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
