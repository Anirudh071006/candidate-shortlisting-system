const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const Candidate = require("./models/Candidate");

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});


// ADD CANDIDATE API

app.post("/api/candidates", async (req, res) => {

    try {

        const candidate = new Candidate(req.body);

        await candidate.save();

        res.json({
            message: "Candidate Added Successfully",
            candidate
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});



// GET ALL CANDIDATES API

app.get("/api/candidates", async (req, res) => {

    try {

        const candidates = await Candidate.find();

        res.json(candidates);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// MATCH CANDIDATES API

app.post("/api/match", async (req, res) => {

    try {

        const { requiredSkills, minExperience } = req.body;

        const candidates = await Candidate.find();

        const rankedCandidates = candidates.map(candidate => {

            // Find matched skills
            const matchedSkills = candidate.skills.filter(skill =>
                requiredSkills.includes(skill)
            );

            // Calculate percentage score
            const score =
                (matchedSkills.length / requiredSkills.length) * 100;

            return {

                ...candidate._doc,

                matchedSkills,

                matchScore: score.toFixed(2)

            };

        })

        // Filter by minimum experience
        .filter(candidate =>
            candidate.experience >= minExperience
        )

        // Sort highest score first
        .sort((a, b) =>
            b.matchScore - a.matchScore
        );

        res.json(rankedCandidates);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});



// AI SHORTLIST API

app.post("/api/ai/shortlist", async (req, res) => {

    try {

        const candidates = await Candidate.find();

        const prompt = `
Job Requirements:
${JSON.stringify(req.body)}

Candidates:
${JSON.stringify(candidates)}

Rank the best candidates and explain why they are suitable for this job.
`;

        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openai/gpt-4o-mini",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },

            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }

        );

        res.json(response.data);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            error: err.message
        });

    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});