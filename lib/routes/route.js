const router = require('koa-router')();
const Api = require('../controllers/api');

router.get('/json', Api.getJson);
router.post('/login', Api.login);
router.post('/signup', Api.signup);
router.get('/token', Api.refreshToken);

module.exports = router;