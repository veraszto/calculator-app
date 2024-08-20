const express = require('express');
const session = require('express-session');
const cors = require('cors');
const {authenticate, client} = require('./db.js');

const app = express();

const port = process.env.PORT || 3000;

//app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors({credentials:true, origin: true}));

app.use(session({
    secret: process.env.SECRET || 'Hey there',
    resave: false,
    saveUninitialized: false,
    /*
    cookie: {
        sameSite: false,
        secure: false,
        httpOnly: true
    }*/
}));


app.get('/is-authenticated', function(req, res) {
    console.log("is-authenticated", req.session.username);
    if (req.session.username) {
        res.json({isAuthenticated: true});
    } else {
        res.json({isAuthenticated: false});
    }
});

app.post('/login', function(req, res, next) {
    console.log("req.body", req.body);
    authenticate(req.body.username, req.body.password).then((response)=>{
        if (response.length) {
            req.session.regenerate(function (){
                req.session.username = req.body.username;
                res.json({success: true, userPack: response});
            })
        } else {
            res.json({success: false});
        }
    });
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
