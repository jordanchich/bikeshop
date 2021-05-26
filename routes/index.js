var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_o9sWtAKD4rmPgv3xfgyNsPwX001kmUDFnO');

var dataBike = [
  {name: 'Model BIKO45', price: 679, url: '/images/bike-1.jpg'},
  {name: 'Model ZOOK7', price: 799, url: '/images/bike-2.jpg'},
  {name: 'Model LIKO89', price: 839, url: '/images/bike-3.jpg'},
  {name: 'Model GEWO', price: 1206, url: '/images/bike-4.jpg'},
  {name: 'Model TITAN5', price: 989, url: '/images/bike-5.jpg'},
  {name: 'Model AMIG39', price: 599, url: '/images/bike-6.jpg'}
];



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.dataCardBike)
  if(req.session.dataCardBike == undefined) {
    req.session.dataCardBike = [];
  }
  res.render('index', {dataBike});
});

/* GET home page. */
router.post('/checkout', function (req, res, next) {
  console.log(req.body)
  var Panier = 0;
  for (var i = 0; i < req.session.dataCardBike.length; i++) {
    Panier = Panier + (req.session.dataCardBike[i].price * req.session.dataCardBike[i].quantity)
  }
  var token = req.body.stripeToken;
  var charge =  stripe.charges.create({
    amount: Panier * 100,
    currency: 'eur',
    description: 'Paiement la Capsule',
    source: token,
  });
  res.render('done', { charge, Panier  });
});

/* POST shop page. */
router.post('/shop', function(req, res, next) {

  req.session.dataCardBike.push(
    {
      name: req.body.bikeNameFromFront,
      price: req.body.bikePriceFromFront,
      url: req.body.bikeImageFromFront,
      quantity: req.body.bikeQuantityFromFront
    }
  );

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});


/* GET delete shop page. */
router.get('/delete-shop', function(req, res, next) {

  req.session.dataCardBike.splice(req.query.position, 1);

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});


/* POST update shop page. */
router.post('/update-shop', function(req, res, next) {

  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});









// // give the user the possibity to reach the shop page without clicking on buy
router.get('/shop', function(req, res, next) {
  if(req.session.dataCardBike == undefined) {
    req.session.dataCardBike = [];
  }
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});





module.exports = router;
