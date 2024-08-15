const express = require('express');
const session = require('express-session');
const cors = require('cors');

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
	console.log("is-authenticated", req.session.user);
	res.send(`sessionUser: ${req.session.user}`);
});

app.post('/login', function(req, res, next) {
	console.log("req.body", req.body);
	if (req.body.user === 'hello') {
		req.session.regenerate(function (){
			req.session.user = req.body.user
			res.json({user: req.session.user, success: true});
		})
	} else {
		res.json({user: req.body.user, success: false});
	}
})

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});
