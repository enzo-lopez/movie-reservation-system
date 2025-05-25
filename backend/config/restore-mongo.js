import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MONGO_URI = process.env.MONGO_URI
const BACKUP_PATH = path.resolve(__dirname, '../../backup')

const command = `mongorestore --drop --uri="${MONGO_URI}" "${BACKUP_PATH}"`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al restaurar la base de datos: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(`Restauración completada:\n${stdout}`)
})
