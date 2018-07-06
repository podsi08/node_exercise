const express = require('express');
const app = express();

app.get('/home', function (req, res) {
  res.send("Welcome to Coffee Shop!");
});

app.get('/home/:query', function (req, res) {
  const query = req.param;
  console.log("req", query);
  const selectedCoffee = coffees.find(coffee => coffee.id === query);
  res.send(`This is coffee ${selectedCoffee.name}`)
});

const coffees = [
  {
  id: 1,
  name: "Brasiliana",
  details: {
    country: "Brasil",
    aromas: ["carmel", "chocolate"],
    roast_date: "2018-07-01",
    strength: 4,
    }
  },
  {
    id: 2,
    name: "Dark Queen",
    details: {
      country: "Chile",
      aromas: ["carmel", "nuts", "raspberry"],
      roast_date: "2018-07-03",
      strength: 4,
    }
  },
];

app.post('/', function (req, res) {
  req.body = coffees.find(coffee => coffee.id === 2);
  res.send(req.body)
});

app.listen(3000, () => {console.log('Listening!')});