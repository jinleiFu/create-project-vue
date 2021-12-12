const fse = require('fs-extra')
const path = require('path')

const jsonConfig = {
  name: 'create-project-vue',
  mirror: 'https://download-template.vercel.app/vue3/ant-design/'
}

const configPath = path.resolve(__dirname, '../config.json')

async function defineConfig() {
  try {
    await fse.outputJSON(configPath, jsonConfig)
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

module.exports = defineConfig