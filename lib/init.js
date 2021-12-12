const path = require('path')
const fse = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
// 控制台交互
const inquirer = require('inquirer')
// 替换模板字符
const handlebars = require('handlebars')

const downloadTemplate = require('./download')
const downTemplate = require('./download')

/**
 * 初始化项目
 * @param {String} projectName 项目名称
 */
async function initProject(projectName) {
  try {
    const projectExisting = await fse.pathExists(projectName)
    if (projectExisting) {
      console.log(logSymbols.error, chalk.red('项目已经存在'))
    } else {

      const initSpinner = ora(chalk.cyan('初始化项目中...'))
      initSpinner.start()
      const templatePath = path.resolve(__dirname, '../template/')

      // nodejs进程的工作目录
      const processPath = process.cwd()
      // 项目名称转小写
      const lowerProjectName = projectName.toLowerCase()
      // 项目完整路径
      const projectPath = `${processPath}/${lowerProjectName}`

      const templateExisting = await fse.pathExists(templatePath)
      // 模板不存在时先下载模板
      if (!templateExisting) {
        await downTemplate()
      }

      try {
        await fse.copy(templatePath, projectPath)
      } catch (err) {
        console.log(logSymbols.error, chalk.red(`拷贝模板失败${err}`))
        process.exit()
      }

      // 替换的模板字符
      const multiMeta = {
        project_name: lowerProjectName
      }

      const multiFiles = [
        `${projectPath}/package.json`,
        `${projectPath}/public/index.html`,
      ]

      for (let i = 0, len = multiFiles.length; i < len; i++) {
        try {
          const fileContent = await fse.readFile(multiFiles[i], 'utf8')
          // 替换模板字符
          const fileResult = await handlebars.compile(fileContent)(multiMeta)
          // 输出文件
          await fse.outputFile(multiFiles[i], fileResult)
        } catch (err) {
          initSpinner.text = chalk.red(`初始化项目失败${err}`)
          initSpinner.fail()
          process.exit()
        }
      }

      initSpinner.text = '项目初始化成功'
      initSpinner.succeed()
      console.log(`
        启动项目:

        cd ${chalk.yellow(lowerProjectName)}
        ${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
        ${chalk.yellow('npm run serve')} or ${chalk.yellow('yarn run serve')}
      `)



      // inquirer.prompt([
      //   {
      //     type: 'input',
      //     message: '请输入项目名称',
      //     default: 'vue模板'
      //   }
      // ]).then(async (answer) => {
      //   const initSpinner = ora(chalk.cyan('初始化项目中...'))
      //   initSpinner.start()
      //   const templatePath = path.resolve(__dirname, '../template/')

      //   // nodejs进程的工作目录
      //   const processPath = process.cwd()
      //   // 项目名称转小写
      //   const lowerProjectName = projectName.toLowerCase()
      //   // 项目完整路径
      //   const projectPath = `${processPath}/${lowerProjectName}`

      //   const templateExisting = await fse.pathExists(templatePath)
      //   // 模板不存在时先下载模板
      //   if (!templateExisting) {
      //     await downTemplate()
      //   }

      //   try {
      //     await fse.copy(templatePath, projectPath)
      //   } catch (err) {
      //     console.log(logSymbols.error, chalk.red(`拷贝模板失败${err}`))
      //     process.exit()
      //   }

      //   // 替换的模板字符
      //   const multiMeta = {
      //     project_name: lowerProjectName
      //   }



      // })

    }
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

module.exports = initProject