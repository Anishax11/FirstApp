# 🚀 SkillLens — 
### AI-Powered Skill-Based Opportunity Matching Platform
SkillLens is an intelligent web platform that helps students and early-career professionals discover **internships, hackathons, and opportunities that truly match their skills**.  
By analyzing a user’s resume and comparing it with opportunity requirements, SkillLens provides **personalized recommendations, skill-gap insights, and learning roadmaps**.

---

## 🔍 Problem Statement

Students often:
- Apply to internships and hackathons without knowing if they are a good fit
- Lack clarity on required skills
- Waste time on irrelevant opportunities
- Do not know what to learn next

There is no smart, skill-based filtering system that guides them effectively.

---

## 💡 Solution — SkillLens

SkillLens solves this problem by:
- Extracting skills directly from the user’s resume using AI
- Comparing user skills with required skills for each opportunity
- Calculating a **skill match percentage**
- Highlighting **Recommended opportunities (≥ 80% match)**
- Providing missing skills and improvement roadmap

---

## ✨ Key Features

### 📄 Resume Skill Extraction
- Upload resume (PDF)
- AI automatically extracts technical and domain skills
- Skills are stored and reused across the platform

### 🤖 Smart Recommendation System
- Skill-to-skill comparison between user and opportunity
- Match percentage calculation
- Opportunities with **80% or higher match** are marked as:

🟢 **Recommended**

### 🧭 Personalized Analysis
- Skill match score
- Missing skill identification
- Clear roadmap for improvement

### 🏆 Supported Opportunities
- Internships
- Hackathons
- Career Opportunities

### 🎨 Professional UI
- Dark, modern, tech-inspired theme
- Clean cards and badges
- Smooth transitions and animations
- Recruiter-friendly design

---

## 🧠 Recommendation Logic

```text
Match Percentage =
(Number of matched skills / Total required skills) × 100
If Match ≥ 80% → Recommended Opportunity
```
---

## 🖥️ Tech Stack
### Frontend
React.js
CSS (custom modern UI)
Responsive layout
### Backend
Node.js
Express.js
REST APIs
### Database
Firebase database
### AI Integration
Gemini API
Resume parsing
Skill extraction
Skill matching & analysis

---

# 🔄 Application Flow

1. User signs up / logs in
2. User uploads resume
3. AI extracts and stores skills
4. User visits Internships / Hackathons / Opportunities pages
5. Each card is analyzed against user skills
6. Opportunities with ≥ 80% match are highlighted as Recommended

### User can:
Analyze opportunity
View match score
See missing skills
Decide whether to apply

---

# 🛠️ Installation & Setup
1️⃣ Clone Repository
```text
git clone https://github.com/your-username/skilllens.git
cd skilllens
```
2️⃣ Install Dependencies
```text
npm install
```
3️⃣ Setup Environment Variables
Create a .env file in the root directory:
```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
4️⃣ Start Backend Server
```text
npm start
```
5️⃣ Start Frontend
```text
npm run dev
```

---

# 📂 Project Structure (Simplified)
```text
skilllens/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── App.js
│
├── .env
├── package.json
└── README.md
```
---

# 🚧 Future Enhancements
User skill progress tracking
Course & learning resource recommendations
Resume improvement suggestions
Company-specific preparation paths
Dashboard with analytics
Notifications for new matching opportunities

---

# 👥 Team
### SkillLens
- Harshada Chavan
- Anisha Bhosle
- Harshada Dhas
  
 Built with ❤️ to help students make smarter career decisions.
