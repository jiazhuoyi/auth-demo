const router = require('koa-router')();
const Api = require('../controllers/api');
const User = require('../controllers/user');
const Notice = require('../controllers/notice');
const Article = require('../controllers/article');

router.get('/json', Api.getJson);
router.post('/login', Api.login);
router.post('/signup', Api.signup);
router.get('/token', Api.refreshToken);
router.post('/logout', Api.logOut);
router.get('/user-info', User.getUserInfo);
router.put('/user-info', User.updateUserInfo);
router.put('/password', User.updatePassword);
router.get('/qiniu-token', Api.getQiniuToken);

// 文章
router.post('/article', Article.submitArticle);
router.delete('/article', Article.deletArticle);
router.get('/articles', Article.getArticles);

// 通知
router.get('/notice', Notice.getNotices);
router.get('/notice/count', Notice.getNoticesCount);
router.put('/notice', Notice.updateNotices);
router.delete('/notice', Notice.deleteNotices);

module.exports = router;