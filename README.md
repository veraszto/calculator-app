## Calculator APP

This is the backend application of its UI [counterpart](https://github.com/veraszto/calculator-ui)

Run `npm install`

Run a MongoDB instance wherever you like, MongoDB Atlas, Docker and so on

Initialize the DB by

`CALCULATOR_APP_MONGODB_URI="mongodb+srv://<user>:<pass>@mycluster.kcj4x.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster" node initialize-db.js`

Run the application

`CALCULATOR_APP_MONGODB_URI="mongodb+srv://<user>:<pass>@mycluster.kcj4x.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster" npm run start`

### Thanks!
