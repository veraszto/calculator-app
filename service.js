const {authenticate, client, getRecords, softDelete: performSoftDelete} = require('./db.js');
const {performOperation} = require('./operation.js')

function restricted(req, res, next) {
    if (req.session.username) {
        next()
    } else {
        res.json({isAuthenticated: false});
    }
}

function softDelete(req, res) {
    console.log('/soft-delete', req.body.recordId);
    performSoftDelete(req.body.recordId).then((result)=>{
        console.log('/soft-delete', result);
        res.json(result);
    }).catch((error)=>{
        console.error(error);
        res.status(500).json({})
    })
}

function operation(req, res) {
    performOperation(req.body.operation, req.session.userid).then((result)=>{
        if (result.error) {
            return res.status(result.code).json({error: result.error})
        }
        res.json(result);
    }).catch((error)=>{
        console.error(error);
        res.status(500).json({})
    });
}

function records(req, res) {
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
}

function isAuthenticated(req, res) {
    console.log("/is-authenticated", req.session.username);
    if (req.session.username) {
        res.json({isAuthenticated: true, username:req.session.username, userid: req.session.userid});
    } else {
        res.json({isAuthenticated: false});
    }
}


function login(req, res, next) {
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
}

function logout(req, res) {
    req.session.destroy(() => {
        res.json({sessionDestroyed: true});
    })    
}


module.exports = {
    restricted,
    softDelete,
    operation,
    records,
    isAuthenticated,
    login,
    logout
}

