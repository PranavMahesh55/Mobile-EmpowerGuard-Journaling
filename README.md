# EmpowerGuard Journaling

**EmpowerGuard Journaling – Unlock Your Emotions, Empower Your Future.**

---

## Inspiration

EmpowerGuard Journaling was born out of the urgent need to provide accessible emotional support for young people and individuals facing domestic abuse. With nearly 1 in 5 young people experiencing significant mental health challenges every day—and with domestic abuse often going unrecognized until it’s too late—our mission is to transform these statistics into actionable insights. We believe that early support and self-awareness can truly change lives.

---

## What It Does

- **Journal Page:**  
  Write, edit, and save your thoughts in an intuitive rich text editor. As you journal, our AI (powered by LangChain and OpenAI) analyzes your entries in real time to detect your emotional tone and provide personalized recommendations.

- **Home Page:**  
  Browse previous entries with a powerful search bar. Each entry can be expanded to reveal detailed insights—including the detected emotional tone and actionable recommendations—and even deleted if needed.

- **Dashboard:**  
  Visualize your emotional journey with interactive charts, overall emotion summaries, and individual mood meters. See your tone trends over time, helping you track your mental well-being.

- **Profile Page:**  
  Manage your personal details and customize your experience. Your profile settings persist between sessions, ensuring a personalized experience every time you log in.

---

## Built With

- **Frontend:**  
  - **React:** For building a dynamic, responsive user interface.  
  - **React Router:** For seamless navigation between pages.  
  - **React Quill:** For a rich text editor on the Journal page.  
  - **Chart.js:** For interactive data visualizations on the Dashboard.

- **Backend:**  
  - **Node.js & Express:** For building a robust REST API.  
  - **Mongoose:** For interacting with MongoDB.

- **Database:**  
  - **MongoDB Atlas:** For scalable data storage.

- **AI & NLP:**  
  - **LangChain & OpenAI API:** For advanced text-based tone analysis and personalized recommendations.

- **Other Tools:**  
  - **dotenv:** For secure management of environment variables.  
  - **Git & GitHub:** For version control and collaboration.  
  - **face-api.js:** For potential future camera-based facial emotion analysis.

---

## Installation

### Backend

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/EmpowerGuard-Journaling.git
   cd EmpowerGuard-Journaling/empowerguard-backend

2.	Install Dependencies: npm install
3.	Set Up Environment Variables:MONGO_CONNECTION_STRING="your_mongodb_connection_string"
PORT=5001
OPENAI_API_KEY="your_openai_api_key"
4. Start the Backend Server: node server.js


Frontend
1.	Navigate to the Frontend Folder: cd ../frontend
2.	Install Dependencies:npm install
3.	Start the Frontend: npm start
