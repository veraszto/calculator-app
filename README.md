## Calculator APP

This is the backend application of its UI [counterpart](https://github.com/veraszto/calculator-ui)

Run `npm install`

Run a MongoDB instance wherever you like, MongoDB Atlas, Docker and so on

In case the Docker way is chosen, run `run-docker-mongodb.sh` to have a MongoDB instance running

Initialize the DB using the appropriate option:

My actual deployment with public acess using this application of MongoDB is on Atlas and I connect to it using the URI below

`CALCULATOR_APP_MONGODB_URI="mongodb+srv://<user>:<pass>@mycluster.kcj4x.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster" node initialize-db.js`

Whereas to connect to the Docker MongoDB configured with the command more above

`CALCULATOR_APP_MONGODB_URI="mongodb://localhost:27017" node initialize-db.js`

Run the application

`CALCULATOR_APP_MONGODB_URI="mongodb+srv://<user>:<pass>@mycluster.kcj4x.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster" npm run start`

Or using Docker

`CALCULATOR_APP_MONGODB_URI="mongodb://localhost:27017"  npm run start`

### Thanks!
