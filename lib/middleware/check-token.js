const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Token = require('../models/token');
/**
 * 从请求头中获取token
 *
 * @param {*} ctx
 * @returns 返回token
 */
const getToken = (ctx) => {
  const parts = ctx.header.authorization.split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];
    if (/^Bearer$/i.test(scheme)) {
        return token;
    }
  }
  ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"');
}
/**
 *  解析token
 *
 * @param {*} ctx
 * @returns  获取userId
 */
const getUser = (ctx) => {
  const token = getToken(ctx);
  let userId;
  if(token) {
    const decoded = jwt.decode(token, 'my_token');
    userId = decoded.userId;
  }
  return userId;
}

const unlessUrls = ['/api/v1/login', '/api/v1/signup', '/api/v1/qiniu-token'];
const refreshTokenUrls = ['/api/v1/token'];
/**
 * 判断requestUrl请求是否存在于urls列表
 *
 * @param {*} urls
 * @param {*} requestUrl
 */
const isMatchUrl = (urls, requestUrl) => urls.some(url => url === requestUrl);

module.exports = async (ctx, next) => {
  try {
    console.log('===============check-Token=======================');
    const url = ctx.originalUrl || ctx.url;
    console.log('-------url:', url);
    if (!isMatchUrl(unlessUrls, url)) {
      // 不是登录或者注册的请求
      const token = getToken(ctx);
      const userId = getUser(ctx);
      console.log('----userId:', userId, '   , token:', token);
      if(isMatchUrl(refreshTokenUrls, url)) {
        // 获取新的accessToken
        const userToken  = await Token.findOne({ userId });
        console.log('获取新的accessToken:', userToken);
        console.log('======================================');
        if(!userToken || userToken.refreshToken !== token) {
          ctx.status = 401;
          ctx.msg = 'Invalid token';
        }
      } else {
        // 正常获取资源请求
        const userToken  = await Token.findOne({ userId }); 
        console.log('正常获取资源:', userToken);
        console.log('======================================');
        if(!userToken || userToken.accessToken !== token) {
          ctx.status = 401;
          ctx.msg = 'Invalid token';
        }
      }
      console.log('======================================');
      ctx.userId = userId;
    }
    await next();
  } catch (error) {
    console.log('##########error:', error);
  }
};