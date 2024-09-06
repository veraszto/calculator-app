const express = require('express');
const session = require('express-session');
const cors = require('cors');
const {authenticate, client, getRecords, softDelete} = require('./db.js');
const {performOperation} = require('./operation.js')

const app = express();

const port = process.env.PORT || 3000;

//app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors({credentials:true, origin: true}));

const sessionConfig = {
    secret: process.env.SECRET || 'Hey there',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
    sessionConfig.cookie.sameSite = 'None';
}

app.use(session(sessionConfig));

function restricted(req, res, next) {
    if (req.session.username) {
        next()
    } else {
        res.json({isAuthenticated: false});
    }
}

app.get('/', function (req, res) {
    res.json({running: true});
});

app.patch('/soft-delete', restricted, function(req, res) {
    console.log('/soft-delete', req.body.recordId);
    softDelete(req.body.recordId).then((result)=>{
        console.log('/soft-delete', result);
        res.json(result);
    }).catch((error)=>{
        console.error(error);
        res.status(500).json({})
    })
});

app.put('/operation', restricted, function(req, res) {
    performOperation(req.body.operation, req.session.userid).then((result)=>{
        if (result.error) {
            return res.status(result.code).json({error: result.error})
        }
        res.json(result);
    }).catch((error)=>{
        console.error(error);
        res.status(500).json({})
    });
})

app.post('/records', restricted, function(req, res) {
    console.log('/records', req.session.userid);
    let skip = 0;
    if (req.body.skip) {
        skip = req.body.skip;
    }
    getRecords(req.session.userid, skip).then((result) => {
        res.json(result);
    }).catch((error)=>{
        res.status(500).json([]);
        console.error(error);
    })
})

app.get('/is-authenticated', function(req, res) {
    console.log("/is-authenticated", req.session.username);
    if (req.session.username) {
        res.json({isAuthenticated: true, username:req.session.username, userid: req.session.userid});
    } else {
        res.json({isAuthenticated: false});
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(() => {
        res.json({sessionDestroyed: true});
    })    
});

app.post('/login', function(req, res, next) {
    console.log("/login", req.body);
    authenticate(req.body.username, req.body.password).then((response)=>{
        console.log("/login", response);
        if (response) {
            req.session.regenerate(function (){
                req.session.username = response.username;
                req.session.userid = response._id;
                res.json({isAuthenticated: true, username: response.username, userid: response._id});
            })
        } else {
            res.json({isAuthenticated: false});
        }
    }).catch((error) => {
        console.error('/login', error);
        res.status(500).json({isAuthenticated: false})
    });
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
