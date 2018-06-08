var id = 1;
var adjectives = ['Attractive', 'Beautiful', 'Chubby', 'Dazzling', 'Magnificent', 'Plump',
'Ashy', 'Black', 'Icy', 'Red', 'Best', 'Delicious', 'Jolly', 'Wonderful', 'Mysterious']
var the = 'The'
var typesOfRestaurants = ['Pizzeria', 'Pancake House', 'Taco City', 'Sandwichery', 'Creamery']
var names = ['Mary', 'Patricia', 'Linda', 'Barbara', 'Jennifer', 'Maria', 'Susan', 'James', 'John', 'Robert', 'Michael', 'William', 'David']
var foodTypes = ['Burger', 'Curry', 'Fries', 'Taco', 'Salad', 'Burrito', 'Sandwich']
var streetNames = ['Granville', 'Arbutus', 'Davie', 'Broadway', 'Cambie', 'Marine']
var streetTypes = ['Dr', 'St', 'Cr']

function getUniqueID() {
  return id++
}

function randomStreet() {
  return (Math.floor(Math.random() * 1000)).toString() + ' ' + randomFrom(streetNames) + ' ' + randomFrom(streetTypes)
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomFrom1To(n) {
  return Math.floor(Math.random() * n + 1)
}

function randomTime() {
  var baseTime = (new Date).getTime()
  var modifier = randomFrom1To(1000)
  return randomFrom1To(10) < 5 ? baseTime + modifier : baseTime - modifier
}

function createData(numStores, numCustomers) {
  var buffer = ''
  var numOrders = numCustomers * 5

  var start = 'INSERT INTO '
  var middle = ' VALUES ('
  var end = ');\n'

  var smids = []
  var cids = []
  var sids = []
  var mids = []
  var fids = new Map();
  var oids = []

  // Generate Stores, StoreManagers, and randomly between 0-10 items per store
  Array.from(Array(numStores).keys()).forEach(i => {
    var sid = getUniqueID()
    sids.push(sid)
    fids.set(sid, [])

    var foodBuffer = '';
    var numItemsPerStore = randomFrom1To(10)
    Array.from(Array(numItemsPerStore).keys()).forEach(j => {
      var foodType = randomFrom(foodTypes)
      var title = '"' + randomFrom(adjectives) + ' ' + foodType + '"'
      var description = '"' + 'The tastiest ' + foodType + ' possible' + '"'
      var fid = getUniqueID()
      fids.get(sid).push(fid)
      foodBuffer += start + 'FoodItemOffers1' + middle + title + ',' + description + end
      foodBuffer += start + 'FoodItemOffers2' + middle + fid + ',' + sid + ',' + title + end
    })

    var smid = getUniqueID()
    smids.push(smid)
    var firstName = randomFrom(names)
    var smName = '"' + firstName + ' ' + randomFrom(names) + '"'
    var smPasswd = '"' + smid + '"'
    var smUsername = '"' + firstName + smid + '"'
    var smAddress = '"' + randomStreet() + '"'

    buffer += start + 'StoreManager' + middle + smid + ',' + sid + ',' + smUsername + ',' + smPasswd + ',' + smName + ',' + smAddress + end

    var sName = '"' + the + ' ' + randomFrom(adjectives) + ' ' + randomFrom(typesOfRestaurants) + '"'
    var popularItem = fids[fids.length - 1]
    var sAddress = '"' + randomStreet() + '"'

    buffer += start + 'Store1' + middle + sName + ',' + popularItem + end
    buffer += start + 'Store2' + middle + sid + ',' + smid + ',' + sName + ',' + sAddress + end

    buffer += foodBuffer
  })

  // Generate customers
  Array.from(Array(numCustomers).keys()).forEach(index => {
    var cid = getUniqueID()
    cids.push(cid)
    var firstName = randomFrom(names)
    var username = '"' + firstName + cid + '"'
    var password = '"' + cid + '"'
    var name = '"' + firstName + ' ' + randomFrom(names) + '"'
    var address = '"' + randomStreet() + '"'

    buffer += start + 'Customer' + middle + cid + ',' + username + ',' + password + ',' + name + ',' + address + end
  })

  // Generate orders and messages
  sids.forEach(sid => {
    var numOrders = randomFrom1To(10)
    Array.from(Array(numOrders).keys()).forEach(i => {
      var oid = getUniqueID()
      oids.push(oid)
      var cid = randomFrom(cids)
      var time = randomTime()
      buffer += start + 'OrderFullfillsAndPlaces' + middle + oid + ',' + sid + ',' + cid + ',' + time + end

      var numItems = randomFrom1To(5)
      Array.from(Array(numItems).keys()).forEach(j => {
        buffer += start + 'Contains' + middle + oid + ',' + randomFrom(fids.get(sid)) + end
      })

      var mid = getUniqueID()
      mids.push(mid)
      var subject = '"' + 'Your order ' + oid.toString() + '"'
      var content = '"' + 'Your order is on its way. Enjoy!' + '"'
      buffer += start + 'MessageSendsAndReceives' + middle + mid + ',' + sid + ',' + cid + ',' + subject + ',' + content + ',' + time + end
    })
  })

  return buffer
}
