
var id = 1;
var adjectives = ["Attractive", "Beautiful", "Chubby", "Dazzling", "Magnificent", "Plump",
"Ashy", "Black", "Icy", "Red", "Best", "Delicious", "Jolly", "Wonderful", "Mysterious"]
var the = "The"
var typesOfRestaurants = ["Pizzeria", "Pancake House", "Taco City", "Sandwichery", "Creamery"]
var names = ["Mary", "Patricia", "Linda", "Barbara", "Jennifer", "Maria", "Susan", "James", "John", "Robert", "Michael", "William", "David"]
var foodTypes = ["Burger", "Curry", "Fries", "Taco", "Salad", "Burrito", "Sandwich"]
var streetNames = ["Granville", "Arbutus", "Davie", "Broadway", "Cambie", "Marine"]
var streetTypes = ["Dr", "St", "Cr"]

function getUniqueID() {
  return id++
}

function randomStreet() {
  return (Math.floor(Math.random() * 1000)).toString() + " " + randomFrom(streetNames) + " " + randomFrom(streetTypes)
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function createData(numStores, numCustomers) {
  var buffer = ""
  var numOrders = numCustomers * 5

  var start = "INSERT INTO "
  var mid = " VALUES ("
  var end = ");\n"

  var smids = []
  var cids = []
  var sids = []
  var mids = []
  var fids = []
  var oids = []

  // Generate Stores, StoreManagers, and 5 FoodItems per store
  Array.from(Array(numStores).keys()).forEach(i => {
    var sid = getUniqueID()
    sids.push(sid);

    var foodBuffer = "";
    (Array.from(Array(5).keys())).forEach(j => {
      var foodType = randomFrom(foodTypes)
      var title = '"' + randomFrom(adjectives) + " " + foodType + '"'
      var description = '"' + "The tastiest " + foodType + " possible!" + '"'
      var fid = getUniqueID()
      fids.push(fid)
      foodBuffer += start + "FoodItemOffers1" + mid + title + "," + description + end
      foodBuffer += start + "FoodItemOffers2" + mid + fid + "," + sid + "," + title + end
    })

    var smid = getUniqueID()
    smids.push(smid)
    var firstName = randomFrom(names)
    var smName = '"' + firstName + " " + randomFrom(names) + '"'
    var smPasswd = '"' + smid + '"'
    var smUsername = '"' + firstName + smid + '"'
    var smAddress = '"' + randomStreet() + '"'

    buffer += start + "StoreManager" + mid + smid + "," + sid + "," + smUsername + "," + smPasswd + "," + smName + "," + smAddress + end

    var sName = '"' + the + " " + randomFrom(adjectives) + " " + randomFrom(typesOfRestaurants) + '"'
    var popularItem = fids[fids.length - 1]
    var sAddress = '"' + randomStreet() + '"'

    buffer += start + "Store1" + mid + sName + "," + popularItem + end
    buffer += start + "Store2" + mid + sid + "," + smid + "," + sName + "," + sAddress + end

    buffer += foodBuffer
  })

  // Generate customers
  Array.from(Array(numCustomers).keys()).forEach(index => {
    var cid = getUniqueID()
    cids.push(cid)
    var firstName = randomFrom(names)
    var username = '"' + firstName + cid + '"'
    var password = '"' + cid + '"'
    var name = '"' + firstName + " " + randomFrom(names) + '"'
    var address = '"' + randomStreet() + '"'

    buffer += start + "Customer" + mid + cid + "," + username + "," + password + "," + name + "," + address + end
  })

  // gen orders + messages
  // first give all users 1 order
  // next for leftover orders give them randomly

  return buffer
}
