
// // const EventEmitter = require('events');
// emitter.on('hehe',(arg)=>{
//     console.log(" hehe detected ",arg);
// })

// const Logger = require('./logger');
// const logger = new Logger();
// logger.log('hehe');

require('dotenv').config(); // load .env
const fetch = require('node-fetch');const http = require('http');
const pdfParse = require("pdf-parse");

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// const Busboy = require("busboy");
// const fs = require("fs");
// const path = require("path");
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
  else if (req.url === "/matching_hackathons") {
    try {
      const decoded = await verifyUser(req);
      console.log("Called getMatchingHackathons, uid is : ",decoded.uid);
      const hackathons = await getMatchingHackathons(decoded.uid);
  
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(hackathons));
    } catch (err) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  else if (req.url === "/internships") {
    console.log("internships");
    const internships = await getInternships();
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(internships));
  }

  else if (req.url === "/hackathons") {
    console.log("hackathons");
    const hackathons = await getHackathons();
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(hackathons));

  }
  else if (req.url === "/all") {
    const all = await getAllOpportunities();
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(all));
    
  }
  else if (req.url === "/upload-resume" && req.method === "POST") {
    try {
      console.log("1️⃣ Upload route hit");
  
      const decoded = await verifyUser(req);
      const uid = decoded.uid;
      console.log("2️⃣ User verified:", uid);
  
      upload.single("resume")(req, res, async (err) => {
        try {
          const pdfBuffer = req.file.buffer;
          console.log("6️⃣ Buffer length:", pdfBuffer.length);
      
          // Dynamically import pdf-parse
          // const pdfModule = await import("pdf-parse");
          // const pdfParse = pdfModule.default; // ✅ This will be the function
      
          const parsed = await pdfParse(pdfBuffer);
          console.log("7️⃣ PDF parsed, text length:", parsed.text.length);
          console.log("7️⃣ PDF parsed text :", parsed.text);
          // Save to Firestore
          await db.collection("users").doc(uid).set(
            { resumeText: parsed.text, resumeUpdatedAt: Date.now() },
            { merge: true }
          );
      
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          console.error("❌ PDF parse / Firestore error:", e);
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      
    } catch (err) {
      console.error("❌ Outer error:", err);
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
  else if (req.url === "/analysis" && req.method === "POST") {
    try {
      const decoded = await verifyUser(req);
      const uid = decoded.uid;
  
      let body = "";
      req.on("data", chunk => (body += chunk));
  
      req.on("end", async () => {
        try {
          const { internshipId, hackathonId, type } = JSON.parse(body);
  
          // Basic validation
          if (!type) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Missing type" }));
          }
  
          const itemId = internshipId || hackathonId;
  
          if (!itemId) {
            res.writeHead(400);
            return res.end(
              JSON.stringify({ error: "Missing internshipId or hackathonId" })
            );
          }
  
          const analysis = await getAnalysis({
            userId: uid,
            itemId,
            type
          });
  
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              analysis
            })
          );
        } catch (err) {
          console.error("Analysis error:", err);
          res.writeHead(500);
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } catch (err) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
  

});


async function getAnalysis({ userId, itemId, type }) {
  try {
    console.log("Getting analysis for:", type, itemId);

    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    // 1️⃣ Get user data
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return "User resume not found";

    const userData = userDoc.data();
    const resumeText = userData.resumeText || "No resume text provided";
    const userSkills = userData.skills || [];

    // 2️⃣ Determine collection
    let collectionName;
    let promptContext;

    if (type === "internship") {
      collectionName = "internships";
      promptContext = "Internship details";
    } else if (type === "hackathon") {
      collectionName = "hackathons";
      promptContext = "Hackathon details";
    } else {
      return "Invalid analysis type";
    }

    // 3️⃣ Get item data
    const itemDoc = await db.collection(collectionName).doc(itemId).get();
    if (!itemDoc.exists) return `${type} not found`;

    const itemData = itemDoc.data();

    const description =
      itemData.description ||
      itemData.Description ||
      "No description provided";

    const skillsRequired =
      itemData.skillsRequired ||
      itemData.skills ||
      itemData.themes ||
      itemData.domains ||
      [];

    // 4️⃣ Gemini request
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a career coach AI.

${promptContext}:
Description:
${description}

Required skills:
${Array.isArray(skillsRequired) ? skillsRequired.join(", ") : skillsRequired}

User profile:
Resume:
${resumeText}

User skills:
${Array.isArray(userSkills) ? userSkills.join(", ") : userSkills}

Analyze how suitable this opportunity is for the user.
Explain:
- Skill match
- Missing skills
- Strengths
- Whether they should apply/participate

Skill interpretation rules:
- Treat skill names semantically, not literally.
- Consider common variants equivalent (e.g., Node.js, NodeJS, node js, nodejs).
- If a skill appears in the user's skill list, assume the user has it.
- Do NOT mark a skill as missing if it is a semantic match.

Respond in plain text.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("\n") || "No analysis returned";

    console.log("Analysis result:", aiText);
    return aiText;

  } catch (err) {
    console.error("Gemini fetch failed:", err);
    return "Analysis failed. Please try again later.";
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
  
  async function getMatchingHackathons(uid) {
    console.log("Inside matching hackathons func");
  
    // 1️⃣ Get user
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return [];
  
    const userSkillsRaw = userDoc.data().skills || [];
  
    // 2️⃣ Normalize user skills
    const userSkills = userSkillsRaw.map(skill =>
      skill.trim().toLowerCase()
    );
  
    if (userSkills.length === 0) return [];
  
    // 3️⃣ Fetch ALL hackathons
    const hackathonsSnap = await db.collection("hackathons").get();
  
    const results = [];
  
    hackathonsSnap.forEach(doc => {
      const hackathon = doc.data();
  
      const requiredSkillsRaw = hackathon.skillsRequired || [];
  
      // 4️⃣ Normalize skills
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
          ...hackathon
        });
      }
    });
  
    console.log("Matched hackathons:", results.length);
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


async function getAllOpportunities() {
  

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


async function getHackathons() {
  

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

