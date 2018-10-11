const express = require('express');
const cors = require('cors');
const monk = require('monk'); // uses mongoDB
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');
const filter = new Filter();

app.use(cors());
app.use(express.json());

function isValidateMew (mew) {
  return mew.name && mew.name.toString().trim() !== '' &&
    mew.content && mew.content.toString().trim() !== '';
}

app.get('/', (req, res) => {
  res.json({
    message: 'Meower! 😹'
  });
});

app.get('/mews', (req, res) => {
  mews.find().then(mew => {
    res.json(mew);
  });
});

app.use(rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1 // limit each IP to 1 request per windowMs
}));

app.post('/mews', (req, res) => {
  if (isValidateMew(req.body)) {
    // insert into db...
    const mew = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date()
    };

    mews.insert(mew).then(createdMew => {
      res.json(createdMew);
    });
  } else {
    // respond with error
    res.status(422);
    res.json({
      message: 'Name and content required.'
    });
  }
});

app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
})