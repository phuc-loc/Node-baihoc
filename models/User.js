const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart; //{items : []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err)
            })
    }

    addToCart(product) {

        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        console.log('//index', cartProductIndex)

        let newQuan = 1;
        const udItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            newQuan = this.cart.items[cartProductIndex].quantity + 1;
            udItems[cartProductIndex].quantity = newQuan;
        } else {
            udItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuan
            })
        }
        // const updatedCart  = { items : [ {productId: new ObjectId(product._id), quantity: 1} ] };
        const updatedCart = { items: udItems }

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId
        })
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity:
                            this.cart.items.find(
                                i => { return i.productId.toString() === p._id.toString(); }
                            ).quantity
                    }
                })
            })
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        })
        const db = getDb()
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            )
    }

    //dung cho app.js 
    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
    }

    //note 
    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name
                    }
                }
                return db
                    .collection('orders')
                    .insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] }; //?
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            })
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({'user._id': new ObjectId(this._id)})
            .toArray()
    }
}

module.exports = User;