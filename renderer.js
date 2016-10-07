window.$ = window.jQuery = require('jquery')
let DB = require('./js/db.js')
let db = new DB()

new Vue({
    el: 'body',
    ready: () => {
        console.log('vue started')
    },
    data: {
        v1: {
            show: true,
            init: false,
            customerFound: null,
            customer: {},
            phone: '0400111222',
        },
        v2: {
            show: false,
            addCreditCard: false,
            customer: {},
            creditCard: {}
        },
        v3: {
            show: false,
            order: {
                items: []
            }
        },
        v4: {
            show: false,
            loading: false
        }
    },
    computed: {
        runningTotal() {
            var total = 0
            for(let i = 0; i < this.v3.order.items.length; i++) {
                if(this.v3.order.items[i].quantity > 0) {
                    total += this.v3.order.items[i].price * this.v3.order.items[i].quantity
                }
            }
            return total
        }
    },
    methods: {
        // Button clicks
        goToViewV1(clearV2Customer) {
            this.v1.show = true
            this.v2.show = false
            this.v3.show = false
            this.v4.show = false
            if(clearV2Customer == true) {
                this.v2.customer = {}
                this.v2.creditCard = {}
                this.v2.addCreditCard = false
            }
            console.log(this.v1.customer)
        },

        goToViewV2() {
            this.v1.show = false
            this.v2.show = true
            this.v3.show = false
            this.v4.show = false
            console.log(this.v1.customer)
        },

        goToViewV3(getItems) {
            this.v1.show = false
            this.v2.show = false
            this.v3.show = true
            this.v4.show = false
            if(getItems == true) {
                this.getMenuItems()
            }
            console.log(this.v1.customer)
        },

        goToViewV4() {
            this.v1.show = false
            this.v2.show = false
            this.v3.show = false
            this.v4.show = true
            console.log(this.v1.customer)
        },

        clearScreen() {
            this.v1.customer = {}
            this.v2.customer = {}
            this.v1.customerFound = false
            this.v1.phone = ''
            this.v1.init = false
        },

        changeQuantityOf(item, direction) {
            for(let i = 0; i < this.v3.order.items.length; i++) {
                if(this.v3.order.items[i].name == item.name) {
                    if(direction == '+') {
                        this.v3.order.items[i].quantity += 1
                    } else if (direction == '-') {
                        this.v3.order.items[i].quantity -= 1
                    } else {
                        console.log('Error: changeQuantityOf()')
                    }

                }
            }
        },

        reset() {
            // Clear all the variables
            this.v1 = {
                show: true,
                init: false,
                customerFound: null,
                customer: {},
                phone: '',
            }
            this.v2 = {
                show: false,
                addCreditCard: false,
                customer: {},
                creditCard: {}
            }
            this.v3 = {
                show: false,
                order: {
                    items: []
                }
            }
            this.v4 = {
                show: false,
                loading: false
            }
        },

        // Database
        getMenuItems() {
            db.getMenuItems((menuItems, hasError) => {
                if(hasError) {
                    console.log('error')
                } else {
                    for(let i = 0; i < menuItems.length; i++) {
                        menuItems[i].quantity = 0
                    }
                    this.v3.order.items = menuItems
                }
            })
        },

        createCustomer() {
            // Validation

            // Save to database
            console.log(this.v2.customer)
            console.log(this.v2.creditCard)
            db.createCustomer(this.v2.customer, (customer, hasError) => {
                if(hasError) {
                    console.log('error')
                } else {
                    this.v2.show = false
                    this.v1.show = true
                    this.v1.phone = this.v2.customer.phone
                    this.v2.customer = {}
                    this.searchByPhone()
                    if(this.v2.addCreditCard) {
                        this.v2.creditCard.customerID = customer.insertId
                        db.createCreditCard(this.v2.creditCard, (creditCard, hasError) => {
                            if(hasError) {
                                console.log('Error: createCustomer()')
                            } else {
                                console.log('credit card created')
                            }
                            this.v2.creditCard = {}
                        })
                    }
                }
            })
        },



        searchByPhone() {
            db.searchByPhone(this.v1.phone, (customers, hasError) => {
                console.log(customers)
                this.v1.init = true
                if(hasError || customers.length == 0) {
                    this.v1.customerFound = false
                } else {
                    this.v1.customerFound = true
                    this.v1.customer = customers[0]
                }
            })
        },

        confirmOrder() {
            this.v4.loading = true
                console.log('confirmOrder()')
                console.log('create menuOrder')
                db.createMenuOrder({
                    customerID: this.v1.customer.rowid,
                    date: Date.now(),
                    delivery: false
                }, (menuOrder, hasError) => {
                    if(hasError) {
                        console.log('Error: confirmOrder()')
                    } else {
                        console.log(menuOrder)
                        for(item of this.v3.order.items) {
                            if(item.quantity > 0) {
                                this.saveItem(item, menuOrder.insertId)
                            }
                        }
                        this.reset()
                        this.goToViewV1()
                    }
                })
        },

        saveItem(item, orderID) {
            db.createOrderList({
                orderID: orderID,
                menuItemID: item.rowid,
                quantity: item.quantity
            }, (success, hasError) => {
                if(hasError) {
                    console.log('Error: saveItem(item)')
                } else {
                    console.log('Item added')
                }
            })
        }
    }
})
