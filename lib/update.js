const updateNotifier = require('update-notifier')
// 控制台字符样式
const chalk = require('chalk')

const pkg = require('../package.json')
const UpdateNotifier = require('update-notifier')

const notifier = updateNotifier({
  // 从package.json获取name和version进行查询
  pkg,
  // 设定检查更新周期 默认为1000 * 60 * 60 * 24(1天) ，这里设置为1000毫秒
  updateCheckInterval: 1000,
})

function updateChk() {
  if(notifier.update) {
    console.log(`发现新版本：${chalk.cyan(notifier.update.latest)},建议您在使用之前进行更新`);
    notifier.notify();
  }else {
    console.log('您当前版本为最新版本。');
  }
}

module.exports = updateChk