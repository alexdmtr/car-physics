var express = require('express');
var router = express.Router();

function getTitle(title) {
  let constant = 'Mecanica unei masini in miscare'
  if (title != null)
    constant = title + ' | ' + constant
  return constant
}

let nav = {
  'Animație': '/',
  'Despre': '/about'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: getTitle(), nav, page:'/' });
})

/* GET about */
router.get('/about', function(req, res) {
  res.render('about', { title: getTitle('Despre'), nav, page:'/about'})
})

module.exports = router;
