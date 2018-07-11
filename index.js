const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const services = require('./services');
const search = services.searchInBase;
const aromaSearch = services.searchForAromas;
const createCoffee = services.createNewCoffeeObj;
const validate = services.validate;
const findDeletedCoffee = services.findDeletedCoffee;
const prepareNewCoffeesArray = services.prepareNewCoffeesArray;
const userSearch = services.searchForUser;

const storageMethods = require('./storage');
const getDataFromMemoryDb = storageMethods.getData;
const writeToFile = storageMethods.write;
const getUsersFromDb = storageMethods.getUsers;
const getTokensBase = storageMethods.getTokens;

const app = express();

app.use(bodyParser.json());

app.get('/coffees', function (req, res) {
  if (typeof getTokensBase().find(item => item.token === req.headers.token) === "undefined") {
    res.send({ error: "You have to log in"});
  }
  res.send(getDataFromMemoryDb());
});

//dodaję do ścieżki /id (zamiast /coffee/:id), żeby przy zapytaniu, nie wykonywała się też funkcja
//z coffee/delete -> delete byłoby przyporządkowane do id
app.get('/coffee/id/:id', function (req, res) {
  const selectedCoffee = search(req, getDataFromMemoryDb(), 'id');
  res.send(selectedCoffee);
});

app.get('/coffee/search/:name', function (req, res) {
  const selectedCoffee = search(req, getDataFromMemoryDb(), 'name');
  res.send(selectedCoffee);
});

app.get('/aromas/:aroma', function (req, res) {
  res.send(aromaSearch(req, getDataFromMemoryDb()));
});

app.delete('/coffee/delete', function (req, res) {
  const { name } = req.body;

  let coffeesArray = getDataFromMemoryDb();

  writeToFile(prepareNewCoffeesArray(name, coffeesArray));

  res.send(findDeletedCoffee(name, coffeesArray));
});

app.post('/coffee/add', function (req, res) {
  const { name, country, aromas, roast_date, strength } = req.body;
  //pobieram tabelę z danymi o kawach
  let coffeesArray = getDataFromMemoryDb();

  //sprawdzam czy dane dodawanej kawy są poprawne
  const errors = validate(name, country, aromas, roast_date, strength, coffeesArray);

  //jeżeli dane sąpoprawne tworzę nowy obiekt kawy, dodaję go na koniec tablicy i całą tablicę zapisuję do pliku
  if (errors.length === 0) {
    //Math.max znajduje największą wartość z podanych, nie można podać jako argument tablicy
    const nextId = Math.max(...(coffeesArray.map(arr => arr.id))) + 1;

    const newCoffee = createCoffee(nextId, {name, country, aromas, roast_date, strength});
    coffeesArray.push(newCoffee);

    writeToFile(coffeesArray, './coffees.json');

    return res.send(newCoffee);

  } else {
    res.send({ errors })
  }
});

app.post('/login', function (req, res) {
  const usersBase = getUsersFromDb();
  const tokenBase = getTokensBase();

  const user = userSearch(req, usersBase);

  if (typeof user === "undefined") {
    res.status(401).send({ error: 'unauthorized' });
  }

  let newToken = uuidv4();

  // jeżeli w tablicy tokenów nie ma jeszcze tokenu dla danego użytkownika, dodaj go
  typeof tokenBase.find(item => item.id === user.id) === "undefined" &&
  tokenBase.push({id: user.id, token: newToken});

  writeToFile(tokenBase, './tokens.json');
  res.status(200).send({ token: newToken});
});

app.get('/logout', function (req, res) {
  let newTokensArray = getTokensBase().filter(item => req.headers.token !== item.token);

  writeToFile(newTokensArray, './tokens.json');

  res.status(200).send({ status: "OK"})
});


app.listen(3000, () => {console.log('Listening on port 3000!')});