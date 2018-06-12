// Application entry point
// Call this function to create fake data
function createData(numStores, numCustomers, downloadOutput) {
  let sqlBuffer = []

  let cids = []
  let sids = []
  let fids = new Map()

  // Generate Stores, StoreManagers, and randomly between 0-10 items per store
  rangeOfSize(numStores).forEach(() => {
    // Generate Manager
    let smid = newID()
    let firstName = randomFrom(names)
    let lastName = randomFrom(names)
    let smName = wrapQuotes(firstName + ' ' + lastName)
    let smPassword = wrapQuotes(randomFrom1To(10000) + lastName)
    let smUsername = wrapQuotes(firstName + randomFrom1To(10000))
    let smAddress = randomStreet()
    sqlBuffer.push(wrapAsInsert('StoreManager', smid, smUsername, smPassword, smName, smAddress))

    // Generate Store
    let sid = newID()
    sids.push(sid)
    fids.set(sid, [])
    let sName = storeName()
    let popularItem = newID()
    let sAddress = randomStreet()
    sqlBuffer.push(wrapAsInsert('Store2', sid, smid, sName, sAddress))
    sqlBuffer.push(wrapAsInsert('Store1', sName, popularItem))

    // Generating FoodItems
    let foodBuffer = []
    let numItemsPerStore = randomFrom1To(10)
    rangeOfSize(numItemsPerStore).forEach(i => {
      let foodType = randomFrom(foodTypes)
      let title = foodTitle(foodType)
      let description = wrapQuotes('The tastiest ' + foodType + ' possible')
      let fid = i == 0 ? popularItem : newID()
      fids.get(sid).push(fid)
      foodBuffer.push(wrapAsInsert('FoodItemOffers2', fid, sid, title))
      foodBuffer.push(wrapAsInsert('FoodItemOffers1', title, description))
    })

    sqlBuffer.push(foodBuffer.join(''))
  })

  // Generate customers
  rangeOfSize(numCustomers).forEach(() => {
    let cid = newID()
    cids.push(cid)
    let firstName = randomFrom(names)
    let lastName = randomFrom(names)
    let username = wrapQuotes(firstName + randomFrom1To(10000))
    let password = wrapQuotes(randomFrom1To(10000) + lastName)
    let name = wrapQuotes(firstName + ' ' + lastName)
    let address = randomStreet()

    sqlBuffer.push(wrapAsInsert('Customer', cid, username, password, name, address))
  })

  // Generate orders and messages
  sids.forEach(sid => {
    let numOrders = randomFrom1To(10)
    rangeOfSize(numOrders).forEach(() => {
      let oid = newID()
      let cid = randomFrom(cids)
      let time = randomTime()
      sqlBuffer.push(wrapAsInsert('OrderFullfillsAndPlaces', oid, sid, cid, time))

      let numItems = randomFrom1To(5)
      let usedItems = new Set()
      rangeOfSize(numItems).forEach(() => {
        let orderItem = randomFrom(fids.get(sid))
        if (!usedItems.has(orderItem)) {
          usedItems.add(orderItem)
          sqlBuffer.push(wrapAsInsert('Contains', oid, orderItem))
        }
      })

      let mid = newID()
      let subject = wrapQuotes('Your order #' + oid.toString())
      let content = wrapQuotes('Your order is on its way. Enjoy!')
      sqlBuffer.push(wrapAsInsert('MessageSendsAndReceives', mid, sid, cid, subject, content, time))
    })
  })

  let sql = sqlBuffer.join('')

  try {
    if (downloadOutput || downloadOutput === undefined) {
      // download('fakeData-' + numStores + 's'+ numCustomers + 'c.sql', sql)
      download('pop.sql', sql)
    }
  } catch {}

  return sql
}

function htmlGenerate() {
  let numStores = Number(document.getElementById('numStores').value)
  let numCustomers = Number(document.getElementById('numCustomers').value)
  let downloadOuput = document.getElementById('downloadOutput').checked

  if (numStores > 0 && numCustomers > 0) {
    document.getElementById('output').innerHTML = createData(numStores, numCustomers, downloadOuput)
    warning.style.display = 'none'
  } else {
    warning.style.display = 'inline'
  }
}

function copySQL() {
  document.getElementById('output').select()
  document.execCommand('copy')
}

function wrapAsInsert(tableName, ...values) {
  return 'INSERT INTO ' + tableName + ' VALUES (' + values.join(',') + ');\n'
}

function wrapQuotes(toWrap) {
  return "'" + toWrap + "'"
}

let usedTitles = new Set()
function foodTitle(foodType) {
  let title = wrapQuotes(randomFrom(adjectives) + ' ' + foodType)
  while (usedTitles.has(title)) title = wrapQuotes(randomFrom(adjectives) + ' ' + foodType)
  usedTitles.add(title)
  return title
}

let usedSNames = new Set()
function storeName() {
  let sName = wrapQuotes('The ' + randomFrom(adjectives) + ' ' + randomFrom(typesOfRestaurants))
  while (usedSNames.has(sName)) sName = wrapQuotes('The ' + randomFrom(adjectives) + ' ' + randomFrom(typesOfRestaurants))
  usedSNames.add(sName)
  return sName
}

let usedIDs = new Set()
function newID() {
  let id = randomFrom1To(1000000)
  while (usedIDs.has(id)) id = randomFrom1To(1000000)
  usedIDs.add(id)
  return id
}

function randomStreet() {
  return wrapQuotes((Math.floor(Math.random() * 1000)).toString() + ' ' + randomFrom(streetNames) + ' ' + randomFrom(streetTypes))
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomFrom1To(n) {
  return Math.floor(Math.random() * (n - 1) + 1)
}

function randomTime() {
  let baseTime = (new Date).getTime()
  let modifier = randomFrom1To(1000000)
  return randomFrom1To(10) < 5 ? baseTime + modifier : baseTime - modifier
}

function rangeOfSize(n) {
  return Array.from(Array(n).keys())
}

function download(filename, text) {
  let element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Data for random attribute generation
let adjectives = ['Attractive', 'Beautiful', 'Chubby', 'Dazzling', 'Magnificent', 'Plump', 'Black', 'Icy', 'Red', 'Best', 'Delicious', 'Jolly', 'Wonderful', 'Mysterious', 'Succulent', 'Spicy', 'Natural', 'Fresh', 'Traditional', 'Healthy', 'Soft', 'Hot', 'Cold', 'Enjoyable', 'Amazing', 'Magical', 'Toasted']
let typesOfRestaurants = ['Pizzeria', 'Pancake House', 'Taco City', 'Sandwichery', 'Creamery', 'Boulangerie', 'Patisserie', 'Brasserie', 'Barbecue', 'Tavern', 'Buffet', 'Cafe', 'Pub', 'Dive Bar']
let names = ['Mary', 'Patricia', 'Linda', 'Barbara', 'Jennifer', 'Maria', 'Susan', 'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Kelly', 'Cindy', 'Gary', 'Robyn', 'Hannah', 'Bill', 'Joey', 'Han', 'Harrison', 'Leah', 'Elon', 'Jeff', 'Elle', 'Christie', 'Roy', 'Violet', 'Lydia', 'Kim', 'Ross', 'Tim', 'Bob', 'Alicia', 'Nicki', 'Dan', 'Jan', 'Carleton', 'Smith', 'Winnie', 'Lena', 'Drake', 'Adam', 'Davis', 'Emily', 'Kyra', 'Sebastian', 'Percy', 'Chris', 'Glenn', 'Alan', 'Anne', 'George', 'Kyle', 'Lee', 'Wong', 'Timothy', 'Faye', 'Horton', 'Izuku', 'Whitney', 'Anderson', 'Beckett', 'Bonnibel', 'Taylor', 'Jackson', 'Lincoln', 'Cohen', 'Yuki', 'Yuri', 'Rey', 'Sara']
let foodTypes = ['Burger', 'Curry', 'Fries', 'Taco', 'Salad', 'Burrito', 'Sandwich', 'Sushi', 'Ice Cream', 'Pulled Pork Sandwich', 'Coffee', 'Meatballs', 'Pasta', 'Calzone', 'Cake', 'Bagel', 'Milkshake', 'Chicken Strips']
let streetNames = ['Granville', 'Arbutus', 'Davie', 'Broadway', 'Cambie', 'Marine', 'Yew', 'Burrard', 'Main', 'Thurlow', 'Sasamat', 'Blanca', 'Alma', 'Trafalgar', 'Discovery', 'Pender', 'Mainland', 'Hamilton', 'Pacific', 'Beach', 'Eastdown', 'Gibbins', 'Highland', 'Carmel', 'Upland']
let streetTypes = ['Dr', 'St', 'Cr', 'Way', 'Lane', 'Grove', 'Place', 'Terrace', 'Hill', 'Square', 'Junction', 'Heights', 'Gardens', 'Creek', 'Center', 'Canyon', 'Avenue', 'Bouleletd', 'Alley']
