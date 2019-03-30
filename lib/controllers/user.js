const User = require('../models/user');

exports.getUserInfo = async(ctx) => {
  try {
      const account = ctx.userId;
      const user = await User.findOne({ account });
      if(!user) {
        return ctx.throw(41001, '用户不存在');
      }
      ctx.body = {
          msg: 'ok',
          status: 200,
          userInfo: {
              account: user.account,
              name: user.name,
              roles: user.roles,
              email: user.email,
              tel: user.tel,
              avatar: user.avatar
          }
      };
  } catch (error) {
      console.log(error);
  }
}

exports.updateUserInfo = async(ctx) => {
    try {
        // const user = await User.find({})
        const user = ctx.request.body;
        const userInfo = await User.findOne({ account: user.account });
        if(userInfo) {
            const result = await User.updateOne(
                { account: user.account },
                { name: user.name,
                  tel: user.tel,
                  email: user.email,
                avatar: user.avatar });
            if (result.ok === 1) {
                return ctx.body = {
                    msg: 'ok',
                    status: 200
                };
            }
            return ctx.body = {
                msg: '该用户不存在',
                status: 502
            }
        }
        ctx.body = {
            msg: 'updateUserInfo error',
            status: 500
        };
    } catch (error) {
        console.log(error);
    }
}

exports.updatePassword = async(ctx) => {
    try {
        const account = ctx.userId;
        console.log('----account:', account);
        const passwordForm = ctx.request.body;
        if (passwordForm.newPassword !== passwordForm.checkPassword) {
            return ctx.body = {
               status:  41003,
               msg: '两次输入的新密码不一致'
            };
        }
        // const user = await User.findOne({ account });
        const user = await User.findOne({ account });
        if (!user) return ctx.body = {
            status: 41001,
            msg: '用户名不存在'
        };
        const match = await user.comparePassword(passwordForm.oldPassword);
        if (!match) return ctx.body = {
            status: 41002,
            msg: '原密码错误'
        };
        user.password = passwordForm.newPassword;
        const _user = new User(user);
        await _user.save();
        ctx.body = {
            status: 200,
            msg: 'ok'
        }
    } catch (error) {
        console.log(error);
    }
}