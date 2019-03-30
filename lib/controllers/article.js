const Article = require('../models/article');

exports.submitArticle = async(ctx) => {
  try {
    const account = ctx.userId;
    console.log('------参数:', ctx.request.body);
    const _article = ctx.request.body.article;
    _article.account = account;
    const article = new Article(_article);
    await article.save();
    ctx.body = {
      status: 200,
      msg: '发布成功'
    };
  } catch (error) {
    console.log('error:', error);
  }
}

exports.getArticles = async(ctx) => {
  try {
    const account = ctx.userId;
    const articles = await Article.find({ account, status: 0 }).sort({ createAt: -1 });
    console.log('=========articles-0------');
    console.log('articles:', articles);
    ctx.body = {
      status: 200,
      msg: 'ok',
      articles 
    };
  } catch (error) {
    console.log('error:', error);
  }
}

exports.deletArticle = async(ctx) => {
  try {
    const id = ctx.query.id;
    console.log('----id:', id);
    // const article = await Article.findById(id);
    const article = await Article.findByIdAndUpdate({
      _id: id
    }, {
      $set: { status: 1 }
    });
    console.log('----result:', article);
    ctx.body = {
      status: 200,
      msg: 'ok',
      article 
    };
  } catch (c) {
    console.log('error:', error);
  }
}