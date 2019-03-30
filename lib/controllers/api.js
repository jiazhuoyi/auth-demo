const cors = require('koa-cors');
const fs = require('fs');
const qiniu = require('qiniu');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Token = require('../models/token');

/**
 *  生成acessToken 和 refreshToken 以及生成时间
 *
 * @param {*} userId
 * @returns
 */
const signToken = async(userId) => {
    try {
        const createTokenAt = Math.floor(Date.now() / 1000);
        const accessToken = jwt.sign({
            exp: createTokenAt + (60 * 10),
            userId
        }, 'my_token');
        const refreshToken = jwt.sign({
            exp: createTokenAt + (60 * 60 * 24),
            userId
        }, 'my_token');
        const result = await Token.update({ 
            userId
        }, { 
            accessToken, refreshToken 
        }, { 
            upsert: true 
        });
        return { accessToken, refreshToken, createTokenAt };
    } catch (error) {
        console.log(error);
    }
};

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
        if(!user) return ctx.body = {
          status: 41001,
          msg: '用户名不存在'
        };
        const match = await user.comparePassword(password);
        if(!match) return ctx.body = {
            status: 41002,
            msg: '密码错误'
          };
        const tokens = await signToken(account); 
        ctx.body = {
            status: 200,
            msg: 'ok',
            account,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            createTokenAt: tokens.createTokenAt
        };

    } catch (error) {
        console.log(error);
    }
}

exports.logOut = async(ctx) => {
    try {
        const { account } = ctx.request.body;
        const result = await Token.deleteOne({ userId: account });
        console.log('-------result:', result);
        if (result.ok === 1) {
            return ctx.body = {
                msg: 'ok',
                status: 200
            };
        }
        ctx.body = {
            msg: 'logout failed',
            status: 41003
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
            return ctx.body = {
                status: 41004,
                msg:'账户已存在'
            };
        }
        user = new User(_user);
        await user.save();
        ctx.body = {
            status: 200,
            msg: '注册成功'
        };
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
        const tokens = await signToken(account); 
        ctx.body = {
            status: 200,
            msg: 'ok',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            createTokenAt: tokens.createTokenAt
        };
    } catch (error) {
        console.log('error:', error);
    }
}

exports.getQiniuToken = async(ctx) => {
    try {
        const ak = 'El5eCOz61fm38Y2NtCjspUrOurKvCXkIeEf111WH';
        const sk = 'pFxWux_OjUrqY617EoEviLLuNbXvcJLXEzYum366';
        const mac = new qiniu.auth.digest.Mac(ak, sk);
        const options = {
            scope: 'vue-admin'
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const token = putPolicy.uploadToken(mac);
        ctx.body = {
            status: 200,
            msg: 'ok',
            token
        }
    } catch (error) {
        console.log('error:', error);
    }
}