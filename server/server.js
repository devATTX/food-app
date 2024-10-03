import express from "express";
import cors from "cors";
import dinners from "./routes/dinners.js";

const PORT = process.env.PORT || 5050;
const app = express();

const corsOptions = {
	origin: "https://dinner-list-client.onrender.com", // frontend URI (ReactJS)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/dinners", dinners);

// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
