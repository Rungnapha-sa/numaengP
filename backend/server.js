const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite DB");
    }
});

const runQuery = promisify(db.run.bind(db));
const getQuery = promisify(db.get.bind(db));
const allQuery = promisify(db.all.bind(db));

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT
)`);

db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      category TEXT,
      date TEXT
    )
  `);

  // ✅ POST - Add new To-Do
app.post("/todos", async (req, res) => {
    const { title, content, category, date } = req.body;
  
    if (!title || !content || !category || !date) {
      return res.status(400).send({ message: "All fields are required" });
    }
  
    try {
      await runQuery(
        `INSERT INTO todos (title, content, category, date) VALUES (?, ?, ?, ?)`,
        [title, content, category, date]
      );
      res.send({ message: "To-Do added successfully" });
    } catch (error) {
      console.error("Error in /todos (POST):", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });
  
  // ✅ GET - Fetch all To-Dos
  app.get("/todos", async (req, res) => {
    try {
      const todos = await allQuery(`SELECT * FROM todos ORDER BY id DESC`);
      res.send(todos);
    } catch (error) {
      console.error("Error in /todos (GET):", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });
  
  // ✅ DELETE - Remove To-Do by ID
  app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await runQuery(`DELETE FROM todos WHERE id = ?`, [id]);
      res.send({ message: "To-Do deleted successfully" });
    } catch (error) {
      console.error("Error in /todos/:id (DELETE):", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

app.post("/login", async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        if ((!email && !phone) || !password) {
            return res.status(400).send({ message: "Email/Phone and password are required" });
        }

        // ใช้ email หรือ phone เพื่อตรวจสอบผู้ใช้
        const user = await getQuery(`SELECT * FROM users WHERE email = ? OR phone = ?`, [email, phone]);

        if (!user) return res.status(400).send({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, phone: user.phone }, "SECRET_KEY", { expiresIn: "1h" });

        res.send({ 
            message: "Login successful", 
            token, 
            fullname: user.fullname, 
            email: user.email, 
            avatarUrl: user.avatarUrl || "https://via.placeholder.com/100"
        });

    } catch (error) {
        console.error("Error in /login:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});


app.post("/register", async (req, res) => {
    try {
        console.log("POST request received:", req.body);

        const { fullname, email, phone, password } = req.body;
        if (!fullname || !password || (!email && !phone)) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const userExists = await getQuery(`SELECT * FROM users WHERE email = ? OR phone = ?`, [email, phone]);
        if (userExists) {
            return res.status(400).send({ message: "User already exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await runQuery(
            `INSERT INTO users (fullname, email, phone, password) VALUES (?, ?, ?, ?)`,
            [fullname, email, phone, encryptedPassword]
        );

        res.send({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error in /register:", error);
        res.status(400).send({ message: "User already exists or invalid data" });
    }
});

app.listen(5001, () => console.log("Server running on port 5001"));
