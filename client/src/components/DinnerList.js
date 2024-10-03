import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, List, ListItem, Grid, TextField, Button, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the Delete icon
import axios from "axios";

const DinnerList = () => {
	const [dinners, setDinners] = useState([]);
	const [newDinner, setNewDinner] = useState({ name: "", ingredients: "" });
	const [selectedDinnerIndices, setSelectedDinnerIndices] = useState([]);

	// Fetch dinners from the API when the component loads
	useEffect(() => {
		fetchDinners();
	}, []);

	const fetchDinners = async () => {
		try {
			const response = await axios.get("https://dinner-list-server.onrender.com/api/dinners");
			setDinners(response.data);
		} catch (err) {
			console.error("Error fetching dinners:", err);
		}
	};

	// Handle input changes
	const handleChange = (e) => {
		setNewDinner({ ...newDinner, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newDinner.name && newDinner.ingredients) {
			const ingredientsArray = newDinner.ingredients.split(",").map((item) => item.trim());
			const capitalizedIngredients = capitalizeWords(ingredientsArray);
			const dinnerToAdd = { name: newDinner.name, ingredients: capitalizedIngredients };

			try {
				// Send POST request to add the new dinner
				await axios.post("https://dinner-list-server.onrender.com/api/dinners", dinnerToAdd);
				fetchDinners(); // Fetch updated dinners list after adding
				setNewDinner({ name: "", ingredients: "" }); // Clear the form
			} catch (err) {
				console.error("Error adding dinner:", err);
			}
		}
	};

	const handleCardClick = (index) => {
		setSelectedDinnerIndices(
			(prevIndices) =>
				prevIndices.includes(index)
					? prevIndices.filter((i) => i !== index) // Remove index if already selected
					: [...prevIndices, index] // Add index if not selected
		);
	};

	const capitalizeWords = (words) => {
		return words.map(
			(word) =>
				word
					.split(" ") // Split each ingredient into individual words (in case of multiple words like 'sour cream')
					.map((subWord) => subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase()) // Capitalize each word
					.join(" ") // Join the words back into a single string
		);
	};

	// Handle dinner deletion
	const handleDelete = async (id) => {
		try {
			await axios.delete(`https://dinner-list-server.onrender.com/api/dinners/${id}`);
			fetchDinners(); // Fetch updated dinners list after deletion
		} catch (err) {
			console.error("Error deleting dinner:", err);
		}
	};

	return (
		<div>
			{/* Dinner Form */}
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					marginBottom: 3,
					padding: 2,
					display: "flex",
					flexDirection: "column",
					gap: 2,
					maxWidth: 400,
				}}
			>
				<Typography variant="h5">Add a New Dinner</Typography>
				<TextField label="Dinner Name" name="name" value={newDinner.name} onChange={handleChange} required fullWidth />
				<TextField
					label="Ingredients (comma separated)"
					name="ingredients"
					value={newDinner.ingredients}
					onChange={handleChange}
					required
					fullWidth
				/>
				<Button variant="contained" type="submit">
					Add Dinner
				</Button>
			</Box>

			{/* Dinner List */}
			<Grid container spacing={3} justifyContent="center">
				{dinners.map((dinner, index) => (
					<Grid item xs={12} sm={6} md={4} key={dinner._id}>
						<Card
							variant="outlined"
							onClick={() => handleCardClick(index)} // Handle click event
							sx={{
								backgroundColor: selectedDinnerIndices.includes(index) ? "lightyellow" : "white", // Change color on selection
								cursor: "pointer", // Change cursor to pointer
								position: "relative", // To position the delete button
							}}
						>
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(dinner._id);
								}} // Prevent card click event
								sx={{
									position: "absolute",
									top: 10,
									right: 10,
									color: "red", // Optional: Change color of the icon
								}}
							>
								<DeleteIcon />
							</IconButton>

							<CardContent>
								<Typography variant="h6" component="div" gutterBottom>
									{dinner.name}
								</Typography>
								<List>
									{dinner.ingredients.map((ingredient, idx) => (
										<ListItem key={idx} disablePadding>
											<Typography variant="body2">{ingredient}</Typography>
										</ListItem>
									))}
								</List>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default DinnerList;
