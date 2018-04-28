const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// const cors = require('cors')
// app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '../dist'))
app.get('/', (req, res) => {
  res.render('../dist/index.html');
});

let db;
app.post('/login', (req, res) => {
  mongo.connect('mongodb://ds159129.mlab.com:59129/razz', {
    auth: {
      user: req.body.user,
      password: req.body.password
    }
  }, (err, client) => {
    if (err) {
      res.send({ ok: 0, user: err.codeName });
    } else {
      console.log(`${req.body.user} connected to MongoDB`);
      db = client.db('razz');
      res.send({ ok: 1, user: req.body.user});
    };
  });
});

app.get('/prize-list', (req, res) => {
  db.collection('prizes')
  .find({})
  .toArray((err, result) => {
    res.send(result);
  });
});

app.get('/prize', (req, res) => {
  db.collection('prizes')
  .find({ _id: ObjectId(req.query.prizeId) })
  .toArray((err, result) => {
    res.send(result);
  });

  // db.collection('prizes')
  // .watch({ $match: { _id: ObjectId(req.query.prizeId) } })
  // .next((err, next) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(next);
  //   }
  // })
});

app.post('/redeem-prize', (req, res) => {
  if (req.body.quantity > 0) {
    db.collection('prizes')
    .updateOne(
      { _id: ObjectId(req.body.prizeId) },
      { $inc: { quantity: -1} },
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        };
      }
    );
  }
});

app.post('/new-user', (req, res) => {
  db.addUser(req.body.user, req.body.password, {
    roles: [{
      role: 'readWrite',
      db: 'razz'
    }]
  }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result[0]);
    };
  });
});

const port = process.env.PORT || 3636;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
