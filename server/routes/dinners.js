import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This helps convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

const router = express.Router();

// GET: Fetch all dinners
router.get("/", async (req, res) => {
	try {
		const dinners = await db.collection("dinners").find().toArray();
		res.json(dinners);
	} catch (err) {
		res.status(500).json({ message: "Error fetching dinners", error: err });
	}
});

// POST: Add a new dinner
router.post("/", async (req, res) => {
	const { name, ingredients } = req.body;

	// Validate input
	if (!name || !ingredients || !Array.isArray(ingredients)) {
		return res.status(400).json({ message: "Invalid input" });
	}

	try {
		const newDinner = { name, ingredients };
		await db.collection("dinners").insertOne(newDinner);
		res.status(201).json({ message: "Dinner added successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error adding dinner", error: err });
	}
});

// DELETE a dinner by ID
router.delete("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const result = await db.collection("dinners").deleteOne(query);

		if (!result) {
			return res.status(404).json({ message: "Dinner not found" });
		}

		res.status(200).json({ message: "Dinner deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error deleting dinner" });
	}
});

export default router;
