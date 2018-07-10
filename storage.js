const services = require('./services');
const readFromFile = services.readFromFile;

let db = [];

//wywołuję funkcję readFromFile, która po rozwiązaniu promisa zwróci tablicę z danymi
readFromFile().then((fileData) => {
  db = fileData;
});

//eksportuję funkcję zwracającą db, a nie tablicę (eksport nastąpi na początku kiedy tablica jest jeszcze pusta)
module.exports = function() {
  return db;
};
