const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const services = require('./services');
const search = services.searchInBase;
const aromaSearch = services.searchForAromas;

let getDataFromMemoryDb = require('./storage');

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


function createNewCoffeeObj (id, name, country, aromas, roast_date, strength) {
  return {
    id,
    name,
    details: {
      country,
      aromas,
      roast_date,
      strength
    }
  };
}

app.post('/coffee/add', function (req, res) {
  const errors = [];

  const { name, country, aromas, roast_date, strength } = req.body;

  if (!name) {
    errors.push('Name required!');
  }

  if (!country) {
    errors.push('Country required!');
  }

  if (!aromas) {
    errors.push('Give atl east one aroma!');
  }

  if (!roast_date) {
    errors.push('Roast date required!');
  }

  if (!strength || !Number.isInteger(strength) || strength < 1 || strength > 5) {
    errors.push('Strength is required and must be integer between 1 and 5!');
  }

  if (errors.length === 0) {
    let coffeesArray = getDataFromMemoryDb();

    const nextId = coffeesArray.length;

    const newCoffee = createNewCoffeeObj(nextId, name, country, aromas, roast_date, strength);
    coffeesArray.push(newCoffee);

    fs.writeFile("./coffees.json", JSON.stringify(coffeesArray), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
    return res.send(newCoffee);

  } else {
    res.send({ errors })
  }
});

app.listen(3000, () => {console.log('Listening on port 3000!')});