/*
 * @Description: 发布订阅延迟任务
 * @Author: jiazhuoyi
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-01 17:01:00
 * @LastEditTime: 2019-04-04 01:31:49
 */

const { redis, pub } = require('../config/redis').getRedis();


/**
 * @description: 任务映射池
 */
const consumerPool = {}

/**
 * @description: 根据任务名向redis插入过期key, 生成延迟任务
 * @param { name: String }  任务名
 * @param { timeout: Number } 延迟时间
 * @return: 
 */
exports.createTask = async(name, timeout, fn) => {
  await pub.multi().set(name, '过期').expire(name, timeout).exec();
  consumerPool[fn.name] = fn;
}

/**
 * @description: 将任务名与任务方法绑定
 * @param {name: String } 任务名
 * @param {callback: Function } 需要绑定的任务方法 
 * @return:  
 */
exports.subTask = async() => {
  const expired_subKey = '__keyevent@8__:expired';
  return new Promise(resolve => {
    redis.subscribe(expired_subKey, () => {
      console.log('订阅成功');
      resolve();
      redis.on('message', async (channel, key) => {
        const spiltArray = key.split(':');
        if (spiltArray[0] !== 'delayTask') return;
        await consumerPool[spiltArray[1]](channel, key);
      })
    });
  });
}