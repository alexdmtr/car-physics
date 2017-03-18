var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mecanica unei masini in miscare' });
});

/* GET about */
router.get('/about', function(req, res) {
  res.render('about', { title: 'Despre'})
})

module.exports = router;
