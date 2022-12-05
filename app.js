const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error'); 
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

app.use((req, res, next) => { 
    User.findById('6389c0c4e6eba8e1f26bd20c') 
    .then(user => {
        req.user = new User(user.username, user.email, user.cart, user._id);
        next()
    })
    .catch(err => console.log(err)) 
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    // console.log(client);
    app.listen(3000); 
})

