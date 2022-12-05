const Product = require('../models/product');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId

// get Products
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('admin/products', { 
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  })
  .catch(err => console.log(err))  
};

// get Form add 
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};
 
//post Add 
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(
    title,
    price, 
    description, 
    imageUrl, 
    null, 
    req.user._id //string
    )
  product
  .save()
  .then(result => {
    // console.log(result);
    console.log('Created Product');
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err); 
  })
};

// get Form Edit !!!
exports.getEditProduct = (req, res, next) => {
  // console.log('hello')
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // console.log('//prodId', prodId)
  Product.findById( prodId )
    .then( product => {
      if (!product) {
        return res.redirect('/');
      } 
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      })
    })
  .catch(err => console.log(err))
};

//post Edit !!!
exports.postEditProduct = (req, res, next) => {
  
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl; 
  const updatedDesc = req.body.description; 
  // Product.findById(prodId)
    // .then(product => {
    //   product.title = updatedTitle;
    //   product.price = updatedPrice;
    //   product.imageUrl = updatedImageUrl;
    //   product.description = updatedDesc;
    //   return product.save();
    // })
  const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId);
  console.log('//product', product)
  product.save()
    .then(result => {
      console.log('result', result);
      console.log('UPDATED PRODUCT!!!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

// //post Delete 
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findByPk(prodId)
  //   .then(product => {
  //     return product.destroy();
  //   })
  Product.deleteById(prodId)
    .then(() => {
      console.log('DESTROY PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
