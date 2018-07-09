const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const services = require('./services');
const search = services.searchInBase;
const aromaSearch = services.searchForAromas;

const app = express();

app.use(bodyParser.json());

app.get('/coffees', function (req, res) {
  fs.readFile('./coffees.json', 'utf8', (err, data) => {
    res.send(JSON.parse(data));
  })
});

app.get('/:id', function (req, res) {
  fs.readFile('./coffees.json', 'utf8', (err, data) => {
    const selectedCoffee = search(req, JSON.parse(data), 'id');
    res.send(selectedCoffee);
  })
});

app.get('/coffee/:name', function (req, res) {
  fs.readFile('./coffees.json', 'utf8', (err, data) => {
    const selectedCoffee = search(req, JSON.parse(data), 'name');
    res.send(selectedCoffee);
  });
});

app.get('/aromas/:aroma', function (req, res) {
  fs.readFile('./coffees.json', 'utf8', (err, data) => {
    res.send(aromaSearch(req, JSON.parse(data)));
  });
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
    console.log(name);
    fs.readFile('./coffees.json', 'utf8', (err, data) => {
      let coffeesArray = JSON.parse(data);
      const nextId = coffeesArray.length;
      console.log(nextId + 1);
      const newCoffee = createNewCoffeeObj(nextId, name, country, aromas, roast_date, strength);
      coffeesArray.push(newCoffee);

      fs.writeFile("./coffees.json", JSON.stringify(coffeesArray), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      return res.send(newCoffee);
    });
  } else {
    res.send({ errors })
  }
});

app.listen(3000, () => {console.log('Listening on port 3000!')});