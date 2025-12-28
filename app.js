
// // const EventEmitter = require('events');
// emitter.on('hehe',(arg)=>{
//     console.log(" hehe detected ",arg);
// })

// const Logger = require('./logger');
// const logger = new Logger();
// logger.log('hehe');

require('dotenv').config(); // load .env
const fetch = require('node-fetch'); // CommonJS style
const http = require('http');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const Busboy = require("busboy");
const fs = require("fs");
const path = require("path");
const db = admin.firestore(); // now you can use Firestore

const api_base = "https://orange-planets-try.loca.lt";

const server = http.createServer(async(req, res) => {
  console.log("Incoming request:", req.method, req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.url === '/') {
    console.log("New connection");
    res.write("hello");
    res.end();
  }
  else if (req.url === "/user/profile" && req.method === "POST") {
    try {
      const decoded = await verifyUser(req);
      const uid = decoded.uid;
  
      const busboy = Busboy({ headers: req.headers });
  
      const userData = {};
      let resumePath = "";
  
      busboy.on("field", (fieldname, value) => {
        if (fieldname === "skills") {
          userData.skills = JSON.parse(value);
        } else {
          userData[fieldname] = value;
        }
      });
  
      busboy.on("file", (fieldname, file, filename) => {
        if (fieldname === "resume") {
          resumePath = `uploads/${uid}_${filename}`;
          file.pipe(fs.createWriteStream(resumePath));
        }
      });
  
      busboy.on("finish", async () => {
        await saveUserProfile(uid, {
          ...userData,
          resumePath
        });
  
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      });
  
      req.pipe(busboy);
    } catch (err) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
  else if (req.url === "/matching_internships" && req.method === "GET") {
    try {
      const decoded = await verifyUser(req);
      console.log("Called getMatchingInternships, uid is : ",decoded.uid);
      const internships = await getMatchingInternships(decoded.uid);
  
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(internships));
    } catch (err) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
  // else if (req.url === "/favicon.ico") {
  //   console.log("internships");
  //   const internships = await getInternships();
  
  //   res.writeHead(200, { "Content-Type": "application/json" });
  //   res.end(JSON.stringify(internships));
  // }

  else if (req.url === "/internships") {
    console.log("internships");
    const internships = await getInternships();
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(internships));
  }

  else if (req.url === "/hackathons") {
    const hackathons = await getHackathons();
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(hackathons));

  }
  else if (req.url === "/all") {
    const all = await getAllOpportunities();
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(all));
    
  }
  else if (req.url === "/upload_resume" && req.method === "POST") {
    try {
      const decoded = await verifyUser(req);
      const uid = decoded.uid;
  
      let body = "";
  
      req.on("data", chunk => {
        body += chunk;
      });
  
      req.on("end", async () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          res.writeHead(400);
          return res.end("Invalid JSON");
        }
  
        const { resumeText } = parsed;
  
        if (!resumeText || resumeText.trim().length === 0) {
          res.writeHead(400);
          return res.end("resumeText is required");
        }
  
        await db.collection("users").doc(uid).set(
          {
            resumeText,
            resumeUploaded: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
  
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      });
    } catch (err) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
  

  else if (req.url === "/analysis" && req.method === "POST") {
    try {
      const decoded = await verifyUser(req);
      const uid = decoded.uid;
  
      // Read request body
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        const { internshipId } = JSON.parse(body);
  
        if (!internshipId) {
          res.writeHead(400);
          return res.end("Missing internshipId");
        }
  
        const analysis = await getAnalysis(uid, internshipId);
  
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(analysis));
      });
    } catch (err) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
  

});


async function getAnalysis(userId,internshipId) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const userDoc = await db.collection("users").doc(userId).get();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    if (!userDoc.exists) return [];
    const resumeText = userDoc.data().resumeText;

    const internshipDoc = await db.collection("internships").doc(internshipId).get();
    const internshipSkills = internshipDoc.data().skillsRequired;

    if (!API_KEY) {
      console.error("API key not found. Please add GEMINI_API_KEY to your .env");
      return;
    }
  
    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are a career coach AI. You are given:
    
    1. Internship requirements: ${internshipSkills}
    2. User resume: ${resumeText}
    
    Please do the following:
    
    1. Identify and list the core skills the user already has that match the internship requirements.
    2. Identify optional skills that would improve the user's chances but are not strictly required.
    3. Identify missing skills that the user does not have but are required for the internship.
    4. Provide a match percentage or probability score estimating how suitable the user is for this internship.
    5. Give a roadmap or guide for the user to acquire the missing skills to increase their chances.
    
    Return the output in clear, structured JSON with keys: coreSkills, optionalSkills, missingSkills, matchPercent, and roadmap.`
            }
          ]
        }
      ]
    };
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    
      const data = await response.json();
    
      // Extract just the AI text
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        console.log(aiText);
      } else {
        console.log("No text found in response:", data);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
}

async function saveUserProfile(uid, data) {

    return admin.firestore()
      .collection("users")
      .doc(uid)
      .set(data, { merge: true });
  }


  async function getMatchingInternships(uid) {
    console.log("Inside matching internships func");
  
    // 1️⃣ Get user
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return [];
  
    const userSkillsRaw = userDoc.data().skills || [];
  
    // 2️⃣ Normalize user skills
    const userSkills = userSkillsRaw.map(skill =>
      skill.trim().toLowerCase()
    );
  
    if (userSkills.length === 0) return [];
  
    // 3️⃣ Fetch ALL internships
    const internshipsSnap = await db.collection("internships").get();
  
    const results = [];
  
    internshipsSnap.forEach(doc => {
      const internship = doc.data();
  
      const requiredSkillsRaw = internship.skillsRequired || [];
  
      // 4️⃣ Normalize internship skills
      const requiredSkills = requiredSkillsRaw.map(skill =>
        skill.trim().toLowerCase()
      );
  
      // 5️⃣ Compare using NORMALIZED values ✅
      const hasMatch = requiredSkills.some(skill =>
        userSkills.includes(skill)
      );
  
      if (hasMatch) {
        results.push({
          id: doc.id,
          ...internship
        });
      }
    });
  
    console.log("Matched internships:", results.length);
    return results;
  }
  
  
  


async function getInternships() {
  

  const internshipsRef = db.collection("internships");
  const snapshot = await internshipsRef.get(); //  fetch data

  const results = [];
  snapshot.forEach(doc => {
    results.push({
      id: doc.id,      
      ...doc.data()
    });
  });
  return results;
}


async function getHackathons() {
  

  const hackathonsRef = db.collection("hackathons");
  const hackathonsnapshot = await hackathonsRef.get(); //  fetch data

  const results = [];
  hackathonsnapshot.forEach(doc => {
    results.push({
      id: doc.id,      
      ...doc.data()
    });
  });
  

  const internshipsRef = db.collection("internships");
  const internshipsnapshot = await internshipsRef.get(); //  fetch data

  internshipsnapshot.forEach(doc => {
    results.push({
      id: doc.id,      
      ...doc.data()
    });
  });

  return results;
}


async function getAllOpportunities() {
  

  const hackathonsRef = db.collection("hackathons");
  const snapshot = await hackathonsRef.get(); //  fetch data

  const results = [];
  snapshot.forEach(doc => {
    results.push({
      id: doc.id,      
      ...doc.data()
    });
  });
  return results;
}

async function verifyUser(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token");
  }

  const token = authHeader.split("Bearer ")[1];

  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken; // contains uid, email, etc
}

// async function verifyUser(req) {
//   return { uid: "local_test_uid" };
// }

// Start the server and test Gemini
server.listen(3000, () => {

  console.log("Server running on http://localhost:3000");

  // testGemini();
  
});

