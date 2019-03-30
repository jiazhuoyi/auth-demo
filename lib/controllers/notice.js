const Mock = require('mockjs');
const Notice = require('../models/notice');

exports.getNotices = async(ctx) => {
  const status = ctx.query.status;
  const pageNumber = ctx.query.pageNumber;
  const limit = ctx.query.limit;
  const start = pageNumber * limit;
  const condition = {};
  if ( status == -1) {
    condition.status = { $in: [0, 1] };
  } else {
    condition.status = status;
  }
  console.log('??????????condition?', condition);
  const result = await Notice.find(condition).limit(~~limit).skip(~~start).exec();
  const totalCount = await Notice.count(condition);
  const ip = ctx.req.headers['x-forwarded-for'] ||
    ctx.req.connection.remoteAddress ||
    ctx.req.socket.remoteAddress ||
    ctx.req.connection.socket.remoteAddress;
  console.log('========================================================')
  console.log('========================================================')
  console.log('req', ctx.req);
  console.log('========================================================')
  console.log('========================================================')
  console.log('ip:', ip);
  ctx.body = {
    status: 200,
    msg: 'ok',
    notices: result,
    totalCount,
    ip
  };
};

exports.getNoticesCount = async(ctx) => {
  const totalCount = await Notice.count({ status: 0 });
  ctx.body = {
    status: 200,
    msg: 'ok',
    totalCount
  };
}

exports.updateNotices = async(ctx) => {
  const notices = ctx.request.body.notices;
  console.log('$$$$$$$$$$$$$$notices:', notices);
  const result = await Notice.updateMany({ _id: { $in: notices }, status: 0 }, { $set: { status: 1 }})
  ctx.body = {
    status: 200,
    msg: 'ok'
  };
}

exports.deleteNotices = async(ctx) => {
  const notices = ctx.request.body.notices;
  console.log('$$$$$$$$$$$$$$notices:', notices);
  const result = await Notice.updateMany({ _id: { $in: notices }}, { $set: { status: 2 }})
  ctx.body = {
    status: 200,
    msg: 'ok'
  };
}

exports.mockNotices = async(ctx) => {
  const notices = Mock.mock({
    "notices|100-100": [
      { 
        "title": '@csentence(5, 10)',
        "createAt": '@datetime("T")',
        "from": '@cname',
        "content": '@cparagraph'
      }]
  });
  const result = await Notice.insertMany(notices.notices);
  console.log('-----mock:', notices.notices);
  ctx.body = {
    status: 200,
    msg: 'ok',
    notices: notices.notices,
    totalCount: 32
  };
};