const path = require('path')
// 下载文件
const download = require('download')
// 等待动画
const ora = require('ora')
// 控制台字符样式
const chalk = require('chalk')
// 操作文件
const fse = require('fs-extra')

const defineConfig = require('./config')

const configPath = path.resolve(__dirname, '../config.json')

// 模板路径
const templatePath = path.resolve(__dirname, '../template')

// 下载模板
async function downTemplate() {
  const existing = await fse.pathExists(configPath)
  if (existing) {
    await downloadAction()
  } else {
    await defineConfig()
    await downloadAction()
  }
}

async function downloadAction() {
  // 清空模板文件夹
  try {
    await fse.remove(templatePath)
  } catch (err) {
    console.error(err)
    process.exit()
  }

  const config = await fse.readJson(configPath)
  const downloadSpinner = ora(chalk.cyan('下载模板中...'))
  downloadSpinner.start()
  try {
    await download(
      `${config.mirror}template.zip`,
      path.resolve(__dirname, '../template/'),
      { extract: true })
  } catch (err) {
    downloadSpinner.text = chalk.red(`下载模板失败,${err}`)
    downloadSpinner.fail()
    process.exit()
  }

  downloadSpinner.text = '下载模板成功'
  downloadSpinner.succeed()
}

module.exports = downTemplate