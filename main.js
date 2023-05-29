const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  // Carga el archivo index.html de la compilación de Angular
  win.loadURL(
    path.resolve(__dirname, 'dist/costeador-front/index.html')
  )
  // Abrir las herramientas de desarrollo de Chrome
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)
