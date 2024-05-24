const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "MY_SECRET_KEY";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'todolist'
});

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Database Connected!");
    }
});

app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email,Username,Password are required!" })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (email,username,password) VALUES (?,?,?)', [email, username, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Email,Username Already Exists!" });
                }
                console.error("Error Inserting User");
                return res.status(500).json({ message: "Error Creating User!" });
            } else {
                const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
                return res.status(201).json({ message: "User Created Succesfully!", token });
            }
        });
    } catch (err) {
        if (err) {
            console.error("Error occurred hashing password", err);
            res.status(500).json({ message: "Error Creating User!" });
        }
    };
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username,Password is required!" });
    }
    try {
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
            if (err) {
                console.error("error occured!");
                return res.status(500).json("Server Error")
            } else {
                if (result.length === 0) {
                    return res.status(404).json({ message: "User not Found!" });
                } else {
                    const match = await bcrypt.compare(password, result[0].password);
                    if (match) {
                        const token = jwt.sign({ username: result[0].id }, SECRET_KEY, { expiresIn: '1h' });
                        return res.status(200).json({ message: "Logined succesfully!", token });
                    } else {
                        console.log("Invaild Password!");
                        return res.status(404).json({ message: "Invaild Username Or Password" })
                    }
                }
            }
        })
    } catch (err) {
        console.error("error!", err);
        return res.status(500).json({ message: "Server Error!" });
    };
});

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};

app.get('/user', authToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const de = jwt.decode(token,SECRET_KEY);
    const username = de.username;
    

    db.query('SELECT * FROM todos WHERE userId=?',[username],(err, result) => {
        if (err) console.error('err', err);
        res.json(result);

    });
});
app.post('/user', authToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const de = jwt.decode(token,SECRET_KEY);
    const username = de.username;
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({message:"Task is required!"});
    }
    db.query('INSERT INTO todos (tasks, userId) VALUES (?, ?)', [task,username], (err, result) => {
        if (err) throw err;
        res.json({ insertId: result.insertId });
    });
});
app.delete('/user/:id', authToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});


app.listen(5000, () => {
    console.log("App Listening on 5000");
})