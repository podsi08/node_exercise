exports.searchInBase = function(request, base, key) {
  const query = request.params[key];
  const selectedItems = base.filter(item => item[key].toLowerCase().indexOf(query.toLowerCase()) > -1);
  if (selectedItems.length < 1) {
    return {
      error: 'No results'
    }
  }
  return selectedItems;
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

exports.searchForUser = function(request, base) {
  const name = request.body.name;
  const password = request.body.password;

  return base.find(user => user.name === name && user.password === password);
};

exports.findDeletedCoffee = function(name, base) {
  return base.find(coffee => coffee.name === name)
};

exports.prepareNewCoffeesArray = function(name, base) {
  return base.filter(coffee => coffee.name !== name)
};

exports.createNewCoffeeObj = function(id, {name, country, aromas, roast_date, strength}) {
  console.log(id, name, country, aromas, roast_date, strength);
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
};

exports.validate = function(name, country, aromas, date, strength, coffees){
  const errors = [];

  if (!name) {
    errors.push('Name required!');
  }

  if (!country) {
    errors.push('Country required!');
  }

  if (!aromas) {
    errors.push('Give atl east one aroma!');
  }

  if (!date) {
    errors.push('Roast date required!');
  }

  if (!strength || !Number.isInteger(strength) || strength < 1 || strength > 5) {
    errors.push('Strength is required and must be integer between 1 and 5!');
  }

  if (typeof (coffees.find(coffee => coffee.name === name)) !== "undefined") {
    errors.push('Coffee with the same name already is in base!')
  }

  return errors;
};