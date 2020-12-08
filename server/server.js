/*import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync} from 'fs';

let database;
if (existsSync("database.json")) {
    database = JSON.parse(readFileSync("database.json"));
} else {
    database = {
        wordScores: [],
        gameScores: []
    };
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);

    if (parsed.pathname === '/wordScore') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.wordScores.push({
                name: data.name,
                word: data.word,
                score: data.score
            });
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    } else if (parsed.pathname === '/gameScore') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.gameScores.push({
                name: data.name,
                score: data.score
            });
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    } else if (parsed.pathname === '/highestWordScores') {
        res.end(JSON.stringify(
            database.wordScores.sort((a, b) => b.score - a.score).filter((v, i) => i < 10)
        ));
    } else if (parsed.pathname === '/highestGameScores') {
        res.end(JSON.stringify(
            database.gameScores.sort((a, b) => b.score - a.score).filter((v, i) => i < 10)
        ));
    } else {
        // If the client did not request an API endpoint, we assume we need to fetch a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
        const path = join("client/", filename);
        console.log("trying to serve " + path + "...");
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            } else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            } else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            } else {
                res.writeHead(200);
            }

            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
}).listen(process.env.PORT || 8080);*/

const express = require("express");
const { MongoClient } = require("mongodb");
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const minicrypt = require('./miniCrypt');

let secrets, username, password, url;
//let currUsers;
if (!process.env.PASSWORD) {
    secrets = require('../secure.json');
    username = secrets.username;
    password = secrets.password;
    url = `mongodb+srv://${username}:${password}@movielist.bbubk.mongodb.net/MovieList?retryWrites=true&w=majority`;
} else {
    username = process.env.USERNAME;
    password = process.env.PASSWORD;
    url = process.env.DATABASE_URL;
}

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = "MovieList";

let db, collection;

const app = express();
app.use(express.json());

app.use(express.static("client"));

app.post("/addWatchList", async (req, res) => {
    collection = db.collection("Watch List");
    const movie = {
        title: req.body.title,
        year: req.body.year,
        cast: req.body.cast,
        rating: req.body.rating,
        notes: req.body.notes
    };

    collection.insertOne(movie, (err) => {
        if(err) {
            res.send("Error with addWatchList POST request");
        }
        else {
            res.send("Information has been passed successfully");
        }
    });
});

/*app.get("/viewfood", (req, res) => { //Note: first parameter has to be req even though it isn't used
    collection = db.collection("food");
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewfood GET request");
        }
        else {
            docs = docs.filter((doc) => {
                return doc.dc === req.query.dc;
            });
            res.send(docs);
        }
    });
});


app.put("/updatecontact", (req, res) => { //May need to be app.put
    collection = db.collection("contact");
    collection.findOneAndUpdate(
        {dc: req.body.dc}, //Query field. Should eventually be the name of the DC we want to update
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                dc: req.body.dc
            }
        },
        {
            upsert: true //This means insert a document if none fitting the query exist
        }
    );
    res.send("Contact successfully updated"); //Not sure if this is necessary or is sending the right info
});

app.get("/viewcontact", async (req, res) => {
    collection = db.collection("contact");
    const contact = await collection.findOne({"dc": req.query.dc});
    res.send(contact);
});

app.post("/addToSelection", (req, res) => {
    collection = db.collection("selection");
    const selectedFood = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount
    };

    collection.insertOne(selectedFood, (err) => {
        if(err) {
            res.send("Error with addToSelection POST request");
        }
        else {
            res.send("Information has been passed successfully");
        }
    });
});

app.get("/selectedFood", (req, res) => {
    collection = db.collection("selection");
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewfood GET request");
        }
        else {
            res.send(docs);
        }
    });
});

app.post("/makeRequest", (req, res) => {
    collection = db.collection("requests");
    const requestedFood = {
        name: req.body[0],
        time: req.body[1],
        foods: req.body[2],
        dc: req.body[3]
    };
    collection.insertOne(requestedFood, (err) => { //Adding the current request
        if(err) {
            res.send("Error with makeRequest POST request");
        }
        else {
            res.send("Information has been passed successfully");
        }
    });
    //Now, to remove all the food from the list of available food
    const foods = requestedFood.foods;
    for(let selectedFoods = 0; selectedFoods < foods.length; selectedFoods++) {
        const currFood = foods[selectedFoods];
        db.collection("food").deleteOne({name: currFood});
    }

    //Finally, to clear the selection so another selection may be made
    db.collection("selection").drop();
});

app.get("/viewrequests", (req, res) => {
    collection = db.collection("requests");
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewrequests GET request");
        }
        else {
            docs = docs.filter((doc) => {
                return doc.dc === req.query.dc;
            });
            res.send(docs);
        }
    });
});

app.post("/fulfillRequest", (req) => {
    collection = db.collection("requests");
    collection.deleteOne({name: req.body.name});
});*/


client.connect(err => {
    if (err) {
        console.error(err);
    } else {
        const port = process.env.PORT || 8080;
        app.listen(port);
        db = client.db(dbName);
        //getUsers();
    }
});
/*
async function getUsers() { //Getting a local copy of the users
    currUsers = await db.collection('users').find({}).toArray();
}

//Login/signup stuff
const mc = new minicrypt();

const session = {
    secret : process.env.SECRET || 'SECRET',
    resave : false,
    saveUninitialized: false
};

const strategy = new LocalStrategy(
    async (username, password, done) => {
        if (!findUser(username)) {
            return done(null, false, {'message':'Wrong email'});
        }
        if (!validatePassword(username, password)) {
            await new Promise((r) => setTimeout(r, 2000));
            return done(null, false, { 'message' : 'Wrong password' });
        }
        return done(null, username);
    });

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.urlencoded({'extended' : true}));

function findUser(username) {
    for(let i = 0; i < currUsers.length; i++) {
        if(currUsers[i].username === username) {
            return true;
        }
    }
    return false;
}

function validatePassword(username, pwd) {

    if (!findUser(username)) {
        return false;
    }

    const users = {};
    for(let i = 0; i < currUsers.length; i++) {
        users[currUsers[i].username] = currUsers[i].password;
    }
    if (!mc.check(pwd, users[username][0], users[username][1])) {
        return false;
    }
    return true;
}

function addUser(username, pwd) {
    if (findUser(username)) {
        return false;
    }
    const [salt, hash] = mc.hash(pwd);
    const newuser = {
        username: username,
        password: [salt, hash]
    };
    db.collection('users').insertOne(newuser);
    currUsers.push(newuser);
    return true;
}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.post('/logindc',
    passport.authenticate('local' , {   
        'successRedirect' : '/dc',   
        'failureRedirect' : '/login'
    })
);

app.post('/loginngo',
    passport.authenticate('local' , {   
        'successRedirect' : '/ngo',   
        'failureRedirect' : '/login'
    })
);

app.get('/dc',
    checkLoggedIn,
    (req, res) => {
        const path = __dirname + "/../client";
        res.sendFile("dc-home.html", {root: path});
    }
);

app.get('/ngo',
    checkLoggedIn,
    (req, res) => {
        const path = __dirname + "/../client";
        res.sendFile("ngo-choose-dc.html", {root: path});
    }
);

app.get('/login',
    (req, res) => {
        const path = __dirname + "/../client";
        res.sendFile("index.html", {root: path});
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.post('/register',
    (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        if (addUser(username, password)) {
            res.redirect('/login');
        } else {
            res.redirect('/register');
        }
    });

app.get('/register',
    (req, res) => {
        const path = __dirname + "/../client";
        res.sendFile("signup.html", {root: path});
    }
);*/