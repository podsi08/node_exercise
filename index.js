const express = require('express');
const bodyParser = require('body-parser');

const services = require('./services');
const search = services.searchInBase;
const aromaSearch = services.searchForAromas;
const createCoffee = services.createNewCoffeeObj;
const validate = services.validate;

const storageMethods = require('./storage');
const getDataFromMemoryDb = storageMethods.getData;
const writeToFile = storageMethods.write;


const app = express();

app.use(bodyParser.json());

app.get('/coffees', function (req, res) {
  res.send(getDataFromMemoryDb());
});

app.get('/:id', function (req, res) {
  const selectedCoffee = search(req, getDataFromMemoryDb(), 'id');
  res.send(selectedCoffee);
});

app.get('/coffee/:name', function (req, res) {
  const selectedCoffee = search(req, getDataFromMemoryDb(), 'name');
  res.send(selectedCoffee);
});

app.get('/aromas/:aroma', function (req, res) {
  res.send(aromaSearch(req, getDataFromMemoryDb()));
});


app.post('/coffee/add', function (req, res) {
  const { name, country, aromas, roast_date, strength } = req.body;
  let coffeesArray = getDataFromMemoryDb();

  const errors = validate(name, country, aromas, roast_date, strength, coffeesArray);

  if (errors.length === 0) {
    const nextId = coffeesArray.length;

    const newCoffee = createCoffee(nextId, name, country, aromas, roast_date, strength);
    coffeesArray.push(newCoffee);

    writeToFile(coffeesArray);

    return res.send(newCoffee);

  } else {
    res.send({ errors })
  }
});

app.listen(3000, () => {console.log('Listening on port 3000!')});