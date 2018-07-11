const fs = require('fs');

let db = [];
let usersBase = [];
let tokensBase = [];

const readFromFile = function(file) {
  return new Promise((resolve) => {
    //fs.readFile nic nie zwraca
    // kiedy promise się rozwiąże zostanie zwrucona tablica z wynikami
    fs.readFile(file, 'utf8', (err, data) => {
      const resultData = JSON.parse(data);
      resolve(resultData);
    });
  });
};

const writeToFile = function(array, file) {
  fs.writeFile(file, JSON.stringify(array), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
};

//wywołuję funkcję readFromFile, która po rozwiązaniu promisa zwróci tablicę z danymi
readFromFile('./coffees.json').then((fileData) => {
  db = fileData;
});

readFromFile('./users.json').then((fileData) => {
  usersBase = fileData;
});

readFromFile('./tokens.json').then((fileData) => {
  tokensBase = fileData;
});

//eksportuję funkcję zwracającą db, a nie tablicę (eksport nastąpi na początku kiedy tablica byłaby jeszcze pusta)

module.exports = {
  getData: function() {
    return db;
  },
  write: writeToFile,
  getUsers: function() {
    return usersBase;
  },
  getTokens: function() {
    return tokensBase;
  }
};