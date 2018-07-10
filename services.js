const fs = require('fs');

exports.searchInBase = function(request, base, key) {
  const query = request.params[key];
  const selectedItem = base.find(item => toUnderscores(item[key].toString()) === query);
  if (typeof selectedItem === "undefined") {
    return {
      error: 'No results'
    }
  }
  return selectedItem;
};

exports.searchForAromas = function(request, base) {
  const query = request.params['aroma'];
  const results = base.filter(item => item.details.aromas.indexOf(query) !== -1);
  if (results.length === 0) {
    return {
      error: 'No results'
    }
  }
  return results
};

function toUnderscores(str) {
  return str.toLowerCase().replace(/ /g, '_');
}

exports.readFromFile = function() {
  return new Promise((resolve) => {
    //fs.readFile nic nie zwraca
    // kiedy promise się rozwiąże zostanie zwrucona tablica z wynikami
    fs.readFile('./coffees.json', 'utf8', (err, data) => {
      const resultData = JSON.parse(data);
      resolve(resultData);
    });
  });
};