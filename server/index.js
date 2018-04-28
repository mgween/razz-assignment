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

// db.collection('prizes').insertMany([
//   {
//     name: 'Lorem Ipsum',
//     description: 'Quisque velit nisi, pretium ut lacinia in, elementum id enim. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
//     image_url: 'http://via.placeholder.com/500x300',
//     quantity: 30
//   },
//   {
//     name: 'Quisque Velit',
//     description: 'Pellentesque in ipsum id orci porta dapibus. Nulla quis lorem ut libero malesuada feugiat. Pellentesque in ipsum id orci porta dapibus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.',
//     image_url: 'http://via.placeholder.com/500x300',
//     quantity: 25
//   },
//   {
//     name: 'Libero Malesuada',
//     description: 'Donec sollicitudin molestie malesuada. Vivamus suscipit tortor eget felis porttitor volutpat. Nulla porttitor accumsan tincidunt. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Sed porttitor lectus nibh.',
//     image_url: 'http://via.placeholder.com/500x300',
//     quantity: 20
//   },
//   {
//     name: 'Tempus Convallis',
//     description: 'Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Nulla porttitor accumsan tincidunt. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.',
//     image_url: 'http://via.placeholder.com/500x300',
//     quantity: 15
//   },
//   {
//     name: 'Donec Rutrum',
//     description: 'Cras ultricies ligula sed magna dictum porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Pellentesque in ipsum id orci porta dapibus. Nulla quis lorem ut libero malesuada feugiat.',
//     image_url: 'http://via.placeholder.com/500x300',
//     quantity: 10
//   },
//   {
//     name: 'Orci Porta',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum congue leo eget malesuada. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Nulla porttitor accumsan tincidunt. Quisque velit nisi, pretium ut lacinia in, elementum id enim.',
//     image_url: 'http://via.placeholder.com/500x300',
//     quantity: 5
//   }
// ], (err, result) => {
//   if (err) throw err;
//   console.log(result);
// });

const port = 3636;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
