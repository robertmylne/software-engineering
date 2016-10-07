module.exports = class DB {

    constructor() {
        console.log('creating success and error handlers')
        this.successHandler = (callback, tx, result) => {
            let records = Array.from(result.rows)
            callback(records, false)
        }
        this.error = (tx, error) => {
            callback(NULL, true)
        }
        console.log('init db')
        this.db = openDatabase('database', '1.0', 'Assignment Database', 2 * 1024 * 1024)
        this.db.transaction((tx) => {
            console.log('dropping tables')
            tx.executeSql('DROP TABLE customer')
            tx.executeSql('DROP TABLE menuItem')
            tx.executeSql('DROP TABLE creditCard')
            tx.executeSql('DROP TABLE menuOrder')
            tx.executeSql('DROP TABLE orderList')
            console.log('creating tables')
            tx.executeSql('CREATE TABLE IF NOT EXISTS customer (firstName, lastName, phone, address, postCode)')
            tx.executeSql('CREATE TABLE IF NOT EXISTS menuItem (name, price, image)')
            tx.executeSql('CREATE TABLE IF NOT EXISTS creditCard (customerID, cardNumber, expiryDate, cvc)')
            tx.executeSql('CREATE TABLE IF NOT EXISTS menuOrder (customerID, date, delivery)')
            tx.executeSql('CREATE TABLE IF NOT EXISTS orderList (orderID, menuItemID, quantity)')
            console.log('seeding database tables')
            tx.executeSql('INSERT INTO customer (firstName, lastName, phone, address, postCode) VALUES ("John", "Smith", "0400111221", "123 Fairy Lane", "4000")', [], this.success, this.error)
            tx.executeSql('INSERT INTO customer (firstName, lastName, phone, address, postCode) VALUES ("Jane", "Johnson", "0400111222", "123 Jones Street", "4004")', [], this.success, this.error)
            tx.executeSql('INSERT INTO menuItem (name, price, image) VALUES ("Pizza", "20", "#")', [], this.success, this.error)
            tx.executeSql('INSERT INTO menuItem (name, price, image) VALUES ("Pasta", "16", "#")', [], this.success, this.error)
            tx.executeSql('INSERT INTO menuItem (name, price, image) VALUES ("Garlic Bread", "4", "#")', [], this.success, this.error)
            tx.executeSql('INSERT INTO creditCard (customerID, cardNumber, expiryDate, cvc) VALUES ("1", "42424242", "1212", "123")', [], this.success, this.error)
            tx.executeSql('INSERT INTO menuOrder (customerID, date, delivery) VALUES ("1", "12122016", "true")', [], this.success, this.error)
            tx.executeSql('INSERT INTO orderList (orderID, menuItemID, quantity) VALUES ("1", "1", "2")')
        }, (message) => console.log(message), (message) => console.log(message))
    }

    searchByPhone(phone, callback) {
        this.db.transaction((tx) => {
            tx.executeSql('SELECT rowid, * FROM customer WHERE phone = ?', [phone], this.successHandler.bind(this, callback), this.errorHandler)
        })
    }

    getMenuItems(callback) {
        this.db.transaction((tx) => {
            tx.executeSql('SELECT rowid, * FROM menuItem', [], this.successHandler.bind(this, callback), this.errorHandler)
        })
    }

    createCustomer(customer, callback) {
        this.db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO customer (firstName, lastName, phone, address, postCode) VALUES (?, ?, ?, ?, ?)',
                [customer.firstName, customer.lastName, customer.phone, customer.address, customer.postCode],
                (tx, result) => callback(result, false),
                this.errorHandler
            )
        })
    }

    createCreditCard(creditCard, callback) {
        this.db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO creditCard (customerID, cardNumber, expiryDate, cvc) VALUES (?, ?, ?, ?)',
                [creditCard.customerID, creditCard.cardNumber, creditCard.expiryDate, creditCard.cvc],
                this.successHandler.bind(this, callback),
                this.errorHandler
            )
        })
    }

    createMenuItem(menuItem, callback) {
        this.db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO menuItem (name, price, image) VALUES (?, ?, ?)',
                [menuItem.name, menuItem.price, menuItem.image],
                this.successHandler.bind(this, callback),
                this.errorHandler
            )
        })
    }

    createOrderList(orderList, callback) {
        this.db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO orderList (orderID, menuItemID, quantity) VALUES (?, ?, ?)',
                [orderList.orderID, orderList.menuItemID, orderList.quantity],
                (tx, result) => callback(result, false),
                this.errorHandler
            )
        })
    }

    createMenuOrder(menuOrder, callback) {
        this.db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO menuOrder (customerID, date, delivery) VALUES (?, ?, ?)',
                [menuOrder.customerID, menuOrder.date, menuOrder.delivery],
                (tx, result) => callback(result, false),
                this.errorHandler
            )
        })
    }

};
