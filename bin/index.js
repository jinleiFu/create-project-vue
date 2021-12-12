#!/usr/bin/env node

const program = require('commander')

const updateChk = require('../lib/update')

const setMirror = require('../lib/mirror')

const downloadTemplate = require('../lib/download')

const initProject = require('../lib/init')


program.version(require('../package.json').version, '-v,--version')

program
  // 声明的命令 
  .command('update')
  // 描述信息 在帮助信息时显示
  .description('检查版本')
  .action(() => {
    updateChk()
  })

program
  // 声明的命令 
  .command('mirror <template_mirror>')
  // 描述信息 在帮助信息时显示
  .description('设置镜像')
  .action((templateMirror) => {
    setMirror(templateMirror)
  })

program
  .command('template')
  .description('下载模板')
  .action(() => {
    downloadTemplate()
  })

program
  .command('init <project_name>')
  .description('初始化项目')
  .action((projectName) => {
    initProject(projectName)
  })



program.parse(process.argv)