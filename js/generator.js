// Application entry point
// Call this function to create fake data
function createData(numStores, numCustomers) {
  var sqlBuffer  = ''

  var cids = []
  var sids = []
  var fids = new Map()

  // Generate Stores, StoreManagers, and randomly between 0-10 items per store
  rangeOfSize(numStores).forEach(() => {
    var sid = newID()
    sids.push(sid)
    fids.set(sid, [])

    // Generating FoodItems
    var foodBuffer = ''
    var numItemsPerStore = randomFrom1To(10)
    rangeOfSize(numItemsPerStore).forEach(() => {
      var foodType = randomFrom(foodTypes)
      var title = '"' + randomFrom(adjectives) + ' ' + foodType + '"'
      var description = '"' + 'The tastiest ' + foodType + ' possible' + '"'
      var fid = newID()
      fids.get(sid).push(fid)
      foodBuffer += wrapAsInsert('FoodItemOffers1', title, description)
      foodBuffer += wrapAsInsert('FoodItemOffers2', fid, sid, title)
    })

    // Generate Manager
    var smid = newID()
    var firstName = randomFrom(names)
    var lastName = randomFrom(names)
    var smName = '"' + firstName + ' ' + lastName + '"'
    var smPassword = '"' + lastName + smid + '"'
    var smUsername = '"' + firstName + smid + '"'
    var smAddress = '"' + randomStreet() + '"'

    sqlBuffer  += wrapAsInsert('StoreManager', smid, sid, smUsername, smPassword, smName, smAddress)

    // Generating Store and finishing up
    var sName = '"' + 'The ' + randomFrom(adjectives) + ' ' + randomFrom(typesOfRestaurants) + '"'
    var popularItem = fids.get(sid)[fids.get(sid).length - 1]
    var sAddress = '"' + randomStreet() + '"'

    sqlBuffer  += wrapAsInsert('Store1', sName, popularItem)
    sqlBuffer  += wrapAsInsert('Store2', sid, smid, sName, sAddress)

    sqlBuffer  += foodBuffer
  })

  // Generate customers
  rangeOfSize(numCustomers).forEach(() => {
    var cid = newID()
    cids.push(cid)
    var firstName = randomFrom(names)
    var lastName = randomFrom(names)
    var username = '"' + firstName + cid + '"'
    var password = '"' + lastName + cid + '"'
    var name = '"' + firstName + ' ' + lastName + '"'
    var address = '"' + randomStreet() + '"'

    sqlBuffer  += wrapAsInsert('Customer', cid, username, password, name, address)
  })

  // Generate orders and messages
  sids.forEach(sid => {
    var numOrders = randomFrom1To(10)
    rangeOfSize(numOrders).forEach(() => {
      var oid = newID()
      var cid = randomFrom(cids)
      var time = randomTime()
      sqlBuffer  += wrapAsInsert('OrderFullfillsAndPlaces', oid, sid, cid, time)

      var numItems = randomFrom1To(5)
      rangeOfSize(numItems).forEach(() => {
        sqlBuffer  += wrapAsInsert('Contains', oid, randomFrom(fids.get(sid)))
      })

      var mid = newID()
      var subject = '"' + 'Your order #' + oid.toString() + '"'
      var content = '"' + 'Your order is on its way. Enjoy!' + '"'
      sqlBuffer  += wrapAsInsert('MessageSendsAndReceives', mid, sid, cid, subject, content, time)
    })
  })

  try {
    download('fakeData-' + numStores + 'stores-'+ numCustomers + 'customers.sql', sqlBuffer)
  } catch {}

  return sqlBuffer
}

function generate() {
  createData(document.getElementById("numStores").value,
             document.getElementById("numCustomers").value)
}

var start = 'INSERT INTO '
var middle = ' VALUES ('
var end = ');\n'
function wrapAsInsert(tableName, ...values) {
  return start + tableName + middle + values.join(',') + end
}

var id = 1
function newID() {
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
  var modifier = randomFrom1To(1000000)
  return randomFrom1To(10) < 5 ? baseTime + modifier : baseTime - modifier
}

function rangeOfSize(n) {
  return Array.from(Array(n).keys())
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Data for random attribute generation
var adjectives = ['Attractive', 'Beautiful', 'Chubby', 'Dazzling', 'Magnificent', 'Plump', 'Black', 'Icy', 'Red', 'Best', 'Delicious', 'Jolly', 'Wonderful', 'Mysterious', 'Succulent', 'Spicy', 'Natural', 'Fresh', 'Traditional', 'Healthy', 'Soft', 'Hot', 'Cold', 'Enjoyable', 'Amazing', 'Magical', 'Toasted']
var typesOfRestaurants = ['Pizzeria', 'Pancake House', 'Taco City', 'Sandwichery', 'Creamery', 'Boulangerie', 'Patisserie', 'Brasserie', 'Barbecue', 'Tavern', 'Buffet', 'Cafe', 'Pub', 'Dive Bar']
var names = ['Mary', 'Patricia', 'Linda', 'Barbara', 'Jennifer', 'Maria', 'Susan', 'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Kelly', 'Cindy', 'Gary', 'Robyn', 'Hannah', 'Bill', 'Joey', 'Han', 'Harrison', 'Leah', 'Elon', 'Jeff', 'Elle', 'Christie', 'Roy', 'Violet', 'Lydia', 'Kim', 'Ross', 'Tim', 'Bob', 'Alicia', 'Nicki', 'Dan', 'Jan', 'Carleton', 'Smith', 'Winnie', 'Lena', 'Drake', 'Adam', 'Davis', 'Emily', 'Kyra', 'Sebastian', 'Percy', 'Chris', 'Glenn', 'Alan', 'Anne', 'George', 'Kyle', 'Lee', 'Wong', 'Timothy', 'Faye', 'Horton', 'Izuku', 'Whitney', 'Anderson', 'Beckett', 'Bonnibel', 'Taylor', 'Jackson', 'Lincoln', 'Cohen', 'Yuki', 'Yuri', 'Rey', 'Sara']
var foodTypes = ['Burger', 'Curry', 'Fries', 'Taco', 'Salad', 'Burrito', 'Sandwich', 'Sushi', 'Ice Cream', 'Pulled Pork Sandwich', 'Coffee', 'Meatballs', 'Pasta', 'Calzone', 'Cake', 'Bagel', 'Milkshake', 'Chicken Strips']
var streetNames = ['Granville', 'Arbutus', 'Davie', 'Broadway', 'Cambie', 'Marine', 'Yew', 'Burrard', 'Main', 'Thurlow', 'Sasamat', 'Blanca', 'Alma', 'Trafalgar', 'Discovery', 'Pender', 'Mainland', 'Hamilton', 'Pacific', 'Beach', 'Eastdown', 'Gibbins', 'Highland', 'Carmel', 'Upland']
var streetTypes = ['Dr', 'St', 'Cr', 'Way', 'Lane', 'Grove', 'Place', 'Terrace', 'Hill', 'Square', 'Junction', 'Heights', 'Gardens', 'Creek', 'Center', 'Canyon', 'Avenue', 'Boulevard', 'Alley']
