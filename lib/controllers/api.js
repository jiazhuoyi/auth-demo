const cors = require('koa-cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Token = require('../models/token');

exports.getJson = async(ctx, next) => {
  try {
      await cors();
      ctx.body = JSON.parse(fs.readFileSync('lib/utils/demo.json'));
  } catch (error) {
      console.log(error);
  }
};

exports.login = async(ctx) => {
    try {
        const { account, password } = ctx.request.body;
        const user = await User.findOne({ account });
        if(!user) return ctx.body = '用户名不存在';
        const match = await user.comparePassword(password);
        if(!match) {
            return ctx.body = '密码错误';
        }
        const accessToken = jwt.sign({ 
            userId: account 
        }, 'my_token', { expiresIn: 60*10 });
        const refreshToken = jwt.sign({
            userId: account
        }, 'my_token', { expiresIn: 60*60*24 });
        const token = {
            userId: account,
            accessToken,
            refreshToken
        };
        const result = await Token.update({ userId: account}, { accessToken, refreshToken }, { upsert: true });
        ctx.body = {
            msg: 'ok',
            accessToken,
            refreshToken
        };

    } catch (error) {
        console.log(error);
    }
}

exports.signup = async(ctx) => {
    try {
        const _user = ctx.request.body.user;
        let user = await User.findOne({ account: _user.account });
        if(user) {
            return ctx.body = '账户已存在';
        }
        user = new User(_user);
        await user.save();
        ctx.body = '注册成功';
    } catch (error) {
        console.log('error:', error);
    }

}
/**
 *  根据refresh获取新的token, 返回新的accessToken和refreshToken
 *
 * @param {*} ctx
 */
exports.refreshToken = async(ctx) => {
    try {
        const account = ctx.userId;
        const accessToken = jwt.sign({ 
            userId: account 
        }, 'my_token', { expiresIn: 60*10 });
        const refreshToken = jwt.sign({
            userId: account
        }, 'my_token', { expiresIn: 60*60*24 });
        const token = {
            userId: account,
            accessToken,
            refreshToken
        };
        const result = await Token.update({ userId: account}, { accessToken, refreshToken }, { upsert: true });
        ctx.body = {
            msg: 'ok',
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.log('error:', error);
    }
}
