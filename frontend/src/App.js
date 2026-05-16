import React, { useState } from "react";
import axios from "axios";

function App() {

  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: ""
  });

  const [results, setResults] = useState([]);

  const [aiResult, setAiResult] = useState("");



  const handleChange = (e) => {

    setCandidate({
      ...candidate,
      [e.target.name]: e.target.value
    });

  };



  const addCandidate = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/candidates",
        {
          ...candidate,
          skills: candidate.skills.split(",")
        }
      );

      alert("Candidate Added Successfully");

    } catch (err) {

      console.log(err);

    }

  };



  const matchCandidates = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/match",
        {
          requiredSkills: ["React", "Node.js"],
          minExperience: 1
        }
      );

      setResults(response.data);

    } catch (err) {

      console.log(err);

    }

  };



  const aiShortlist = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/ai/shortlist",
        {
          requiredSkills: ["React", "Node.js"],
          minExperience: 1
        }
      );

      setAiResult(
        response.data.choices[0].message.content
      );

    } catch (err) {

      console.log(err);

    }

  };



  return (

    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      padding: "30px",
      color: "white",
      fontFamily: "Arial"
    }}>

      <div style={{
        maxWidth: "1000px",
        margin: "auto"
      }}>

        <h1 style={{
          textAlign: "center",
          color: "#38bdf8",
          marginBottom: "40px"
        }}>
          Candidate Shortlisting System
        </h1>





        {/* ADD CANDIDATE */}

        <div style={cardStyle}>

          <h2>Add Candidate</h2>

          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Skills (comma separated)"
            name="skills"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Experience"
            name="experience"
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            placeholder="Bio"
            name="bio"
            onChange={handleChange}
            style={{
              ...inputStyle,
              height: "80px"
            }}
          />

          <button
            onClick={addCandidate}
            style={buttonStyle}
          >
            Add Candidate
          </button>

        </div>





        {/* MATCHING */}

        <div style={cardStyle}>

          <h2>Candidate Matching</h2>

          <button
            onClick={matchCandidates}
            style={buttonStyle}
          >
            Match Candidates
          </button>


          {
            results.map((candidate, index) => (

              <div
                key={index}
                style={{
                  backgroundColor: "#1e293b",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "20px",
                  border: "1px solid #334155"
                }}
              >

                <h3 style={{
                  color: "#38bdf8"
                }}>
                  {candidate.name}
                </h3>

                <p>
                  <strong>Email:</strong>
                  {" "}
                  {candidate.email}
                </p>

                <p>
                  <strong>Experience:</strong>
                  {" "}
                  {candidate.experience} years
                </p>

                <p>
                  <strong>Match Score:</strong>
                  {" "}
                  {candidate.matchScore}%
                </p>

                <p>
                  <strong>Skills Matched:</strong>
                  {" "}
                  {candidate.matchedSkills.join(", ")}
                </p>

              </div>

            ))
          }

        </div>





        {/* AI */}

        <div style={cardStyle}>

          <h2>AI Shortlisting</h2>

          <button
            onClick={aiShortlist}
            style={buttonStyle}
          >
            Generate AI Recommendation
          </button>

          <div style={{
            marginTop: "20px",
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.7",
            border: "1px solid #334155"
          }}>

            {aiResult}

          </div>

        </div>

      </div>

    </div>

  );

}



const cardStyle = {

  backgroundColor: "#111827",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.4)"

};



const inputStyle = {

  width: "100%",
  padding: "12px",
  marginTop: "15px",
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "6px",
  color: "white",
  fontSize: "16px",
  boxSizing: "border-box"

};



const buttonStyle = {

  marginTop: "20px",
  padding: "12px 20px",
  backgroundColor: "#38bdf8",
  color: "black",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold"

};



export default App;