const express = require("express");
const session = require("express-session");
const cors = require("cors");

const {
    restricted,
    softDelete,
    operation,
    records,
    isAuthenticated,
    login,
    logout,
} = require("./service.js");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

const sessionConfig = {
    secret: process.env.SECRET || "Hey there",
    resave: false,
    saveUninitialized: false,
    cookie: {},
};

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.secure = true;
    sessionConfig.cookie.sameSite = "None";
}

app.use(session(sessionConfig));

app.get("/", function (req, res) {
    res.json({ running: true });
});

app.patch("/soft-delete", restricted, softDelete);

app.put("/operation", restricted, operation);

app.post("/records", restricted, records);

app.get("/is-authenticated", isAuthenticated);

app.get("/logout", restricted, logout);

app.post("/login", login);

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
