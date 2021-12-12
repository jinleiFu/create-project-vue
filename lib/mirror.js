const logSymbols  = require('log-symbols')
const fse = require('fs-extra')
const path = require('path')

const defineConfig = require('./config')

const configPath = path.resolve(__dirname,'../config.json')

async function setMirror(link) {
  const existing = await fse.pathExists(configPath)
  if(existing) {
    // 存在config.json直接写入配置
    mirrorAction(link)
  }else {
    // 不存在config.json时先生成config.json
    await defineConfig()
    mirrorAction(link)
  }
}

async function mirrorAction(link){
  try {
    // 读取config文件
    const config = await fse.readJson(configPath)
    // 写入mirror配置
    config.mirror = link
    await fse.writeJson(configPath,config)
    console.log(logSymbols.success,'设置镜像成功');
  } catch (err) {
    console.log(logSymbols.error,chalk.red(`设置镜像失败： ${err}`))
    process.exit()
  }
}

module.exports = setMirror