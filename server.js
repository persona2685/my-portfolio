const Contact = require("./Contact");
require("dotenv").config();

const mongoose = require("mongoose");
const Project = require("./models/Project");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching projects"
        });
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const contact = new Contact({
            name,
            email,
            message
        });

        await contact.save();

        res.json({
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to send message"
        });
    }
});

app.delete("/api/projects/:id", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);

        res.json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting project"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
