/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const multer = require("multer");
const pdfParse = require("pdf-parse");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

async function verifyUser(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: No token");
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  }
  
  function extractSkills(text) {
    if (!text) return [];
    const normalizedText = text.toLowerCase();
    const skillKeywords = [
      "Javascript", "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "TypeScript",
      "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring Boot",
      "HTML", "CSS", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Azure", "Google Cloud",
      "Docker", "Kubernetes", "Git", "GitHub", "Jira", "Figma", "Machine Learning", "Data Science",
      "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn", "NLP", "Agile", "Scrum", "DevOps", "CI/CD", "Linux"
    ];
    const foundSkills = [];
    skillKeywords.forEach(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped.toLowerCase()}\\b`, "i");
      if (normalizedText.match(regex) || normalizedText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    return [...new Set(foundSkills)];
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
  
  function normalizeSkill(skill) {
    return skill
      .toLowerCase()
      .replace(/[\s\.-]/g, ""); // remove spaces, dots, and hyphens
  }
  
  async function getRecommendations(uid, type) {
    try {
      // 1️⃣ Get user skills
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) return [];
  
      const userData = userDoc.data();
      const userSkills = (userData.skills || []).map(normalizeSkill);
  
      // 2️⃣ Determine collection
      let collectionName;
      if (type === "internship") collectionName = "internships";
      else if (type === "hackathon") collectionName = "hackathons";
      else throw new Error("Invalid type for recommendations");
  
      // 3️⃣ Fetch all items
      const snapshot = await db.collection(collectionName).get();
      const allItems = [];
      snapshot.forEach(doc => allItems.push({ id: doc.id, ...doc.data() }));
  
      // 4️⃣ Score each item
      const recommendations = allItems.map(item => {
        const requiredSkills = (item.skillsRequired || item.skills || item.themes || [])
          .map(normalizeSkill);
  
        const matchedSkills = requiredSkills.filter(skill =>
          userSkills.includes(skill)
        );
  
        const score = requiredSkills.length
          ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
          : 0;
  
        return {
          id: item.id,
          title: item.title || item.name || "Untitled",
          description: item.description || item.Description || "",
          matchedSkills,
          totalSkills: requiredSkills.length,
          matchPercent: score
        };
      });
  
      // 5️⃣ Sort by match percent
      recommendations.sort((a, b) => b.matchPercent - a.matchPercent);
  
      return recommendations;
    } catch (err) {
      console.error("getRecommendations failed:", err);
      return [];
    }
  }
  


  exports.matchingInternships = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => { // allow cross-origin requests
      if (req.method !== "GET") {
        return res.status(405).send({ error: "Method not allowed" });
      }
  
      try {
        const decoded = await verifyUser(req);
        console.log("Called getRecommendations for internships, uid:", decoded.uid);
  
        const internships = await getRecommendations(decoded.uid, 'internship');
  
        res.status(200).json(internships);
      } catch (err) {
        res.status(401).json({ error: err.message });
      }
    });
  });
  
  exports.matchingHackathons = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "GET") {
        return res.status(405).send({ error: "Method not allowed" });
      }
  
      try {
        const decoded = await verifyUser(req);
        console.log("Called getRecommendations for hackathons, uid:", decoded.uid);
  
        const hackathons = await getRecommendations(decoded.uid, 'hackathon');
  
        res.status(200).json(hackathons);
      } catch (err) {
        res.status(401).json({ error: err.message });
      }
    });
  });
  
  // GET /internships
exports.internships = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      try {
        console.log("Fetching internships");
        const internships = await getInternships();
        res.status(200).json(internships);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
  });
  
  // GET /hackathons
  exports.hackathons = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      try {
        console.log("Fetching hackathons");
        const hackathons = await getHackathons();
        res.status(200).json(hackathons);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
  });
  
  // GET /all
  exports.all = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      try {
        console.log("Fetching all opportunities");
        const all = await getAllOpportunities();
        res.status(200).json(all);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
  });
  
  // POST /uploadResume
  exports.uploadResume = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      try {
        const decoded = await verifyUser(req);
        const uid = decoded.uid;
        console.log("User verified:", uid);
  
        upload.single("resume")(req, res, async (err) => {
          if (err) return res.status(400).json({ error: err.message });
  
          try {
            const pdfBuffer = req.file.buffer;
            console.log("Resume buffer length:", pdfBuffer.length);
  
            const parsed = await pdfParse(pdfBuffer);
            console.log("PDF parsed, text length:", parsed.text.length);
  
            const extractedSkills = extractSkills(parsed.text);
            console.log("Extracted Skills:", extractedSkills);
  
            const updateData = {
              resumeText: parsed.text,
              resumeUpdatedAt: Date.now(),
            };
  
            if (extractedSkills.length > 0) {
              updateData.skills = admin.firestore.FieldValue.arrayUnion(...extractedSkills);
            }
  
            await db.collection("users").doc(uid).set(updateData, { merge: true });
  
            res.status(200).json({ success: true, extractedSkills });
          } catch (e) {
            console.error("PDF parse / Firestore error:", e);
            res.status(500).json({ error: e.message });
          }
        });
      } catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ error: err.message });
      }
    });
  });
  
