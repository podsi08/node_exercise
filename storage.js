const fs = require('fs');

const coffeesFile = './coffees.json';
let db = [];

const readFromFile = function() {
  return new Promise((resolve) => {
    //fs.readFile nic nie zwraca
    // kiedy promise się rozwiąże zostanie zwrucona tablica z wynikami
    fs.readFile(coffeesFile, 'utf8', (err, data) => {
      const resultData = JSON.parse(data);
      resolve(resultData);
    });
  });
};

const writeToFile = function(array) {
  fs.writeFile(coffeesFile, JSON.stringify(array), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
};


//wywołuję funkcję readFromFile, która po rozwiązaniu promisa zwróci tablicę z danymi
readFromFile().then((fileData) => {
  db = fileData;
});

//eksportuję funkcję zwracającą db, a nie tablicę (eksport nastąpi na początku kiedy tablica byłaby jeszcze pusta)

module.exports = {
  getData: function() {
    return db;
  },
  write: writeToFile,
};