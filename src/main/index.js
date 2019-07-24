'use strict'

import { app, BrowserWindow } from 'electron'

// const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow () {
    /* Initialize IPC Main. */
    const ipc = require('electron').ipcMain

    /**
     * Initial window options
     *
     * NOTE: We use a minimalist UI since primary functions are managed
     *       from the full client.
     */
    mainWindow = new BrowserWindow({
        /* Set dimensions. */
        width: 325,
        height: 500,
        minWidth: 325,
        minHeight: 500,

        useContentSize: true,

        /* Set background color. */
        backgroundColor: '#387fea',

        /* Set app icon. */
        // icon: path.join(__dirname, 'assets/icons/png/64x64.png')
        icon: '~@/assets/icons/png/64x64.png'
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    /* Handle debugging. */
    ipc.on('_debug', function (_event, _arg) {
        console.log('DEBUG:', _arg)
    })

    /* Handle commands. */
    ipc.on('cmd', function (_event, _arg) {
        // console.log('HEY! someone sent a CMD', _event, _arg)

        if (_arg === 'quit') {
            app.quit()
        }
    })

    /* Handle number of hashes update. */
    ipc.on('numHashes', function (_event, _arg) {
        mainWindow.webContents.send('updateNumHashes', _arg)
    })

    /* Handle hash rate update. */
    ipc.on('hashRate', function (_event, _arg) {
        mainWindow.webContents.send('updateHashRate', _arg)

        if (process.platform === 'darwin') {
            /* Set dock badge. */
            app.dock.setBadge(_arg)
        }
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require('./menu')
