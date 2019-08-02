const electron = require('electron')

const app = electron.app
// const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

// const ipc = electron.ipcRenderer

// const appData = app.getPath('appData')
// const ministoData = appData + '/Ministo'
// console.log('APP DATA', appData)
// console.log('MINISTO DATA', ministoData)

// const appName = app.getName()
// console.log('APP NAME', appName)

// const appVersion = app.getVersion()
// console.log('APP VERSION', appVersion)

// const appLocale = app.getLocale()
// console.log('APP LOCALE', appLocale)

// const appTitle = app.client.getTitle()
// console.log('APP TITLE', appTitle)

if (process.platform === 'darwin') {
    // app.setBadgeCount(3)
    app.dock.show()
    // setTimeout(app.dock.bounce(), 7000)
}

let template = [{
    label: 'View',
    submenu: [{
        label: 'Toggle Full Screen',
        accelerator: (function () {
            if (process.platform === 'darwin') {
                return 'Ctrl+Command+F'
            } else {
                return 'F11'
            }
        })(),
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
        }
    }, {
        label: 'Full View',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                const options = {
                    type: 'info',
                    title: 'Full View',
                    buttons: ['Ok'],
                    message: 'Coming soon..'
                }

                electron.dialog.showMessageBox(focusedWindow, options, function () {})
            }
        }
    }, {
        label: 'Compact View',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                const options = {
                    type: 'info',
                    title: 'Compact View',
                    buttons: ['Ok'],
                    message: 'Coming soon..'
                }

                electron.dialog.showMessageBox(focusedWindow, options, function () {})
            }
        }
    }]
}, {
    label: 'Tools',
    submenu: [{
        label: 'Change Ministo Tag',
        click: function (item, focusedWindow) {
            // const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow.webContents.send('changeTag')
        }
    }, {
        label: 'Run Host Analysis',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                const options = {
                    type: 'info',
                    title: 'Host Analysis',
                    buttons: ['Ok'],
                    message: 'Coming soon..'
                }

                electron.dialog.showMessageBox(focusedWindow, options, function () {})
            }
        }
    }]
}, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'Minado.Network',
        click: function () {
            electron.shell.openExternal('https://minado.network')
        }
    }, {
        label: 'Mining Hardware Guide',
        click: function () {
            electron.shell.openExternal('https://minado.network/hardware-guide')
        }
    }]
}]

function addUpdateMenuItems (items, position) {
    if (process.mas) return

    const version = electron.app.getVersion()

    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click: function () {
            require('electron').autoUpdater.checkForUpdates()
        }
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: function () {
            require('electron').autoUpdater.quitAndInstall()
        }
    }]

    items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem () {
    const menu = Menu.getApplicationMenu()

    if (!menu) return

    let reopenMenuItem

    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })

    return reopenMenuItem
}

if (process.platform === 'darwin') {
    const pjson = require('../../package.json')

    /* Set app name. */
    const appName = `Ministo v${pjson.version}`

    template.unshift({
        label: appName,
        submenu: [{
            label: `About ${appName}`,
            role: 'about'
        }, {
            type: 'separator'
        }, {
            label: 'Services',
            role: 'services',
            submenu: []
        }, {
            type: 'separator'
        }, {
            label: `Hide ${appName}`,
            accelerator: 'Command+H',
            role: 'hide'
        }, {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
        }, {
            label: 'Show All',
            role: 'unhide'
        }, {
            type: 'separator'
        }, {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function () {
                app.quit()
            }
        }]
    })

    // Window menu.
    // template[2].submenu.push({
    //     type: 'separator'
    // }, {
    //     label: 'Bring All to Front',
    //     role: 'front'
    // })

    addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu

    addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', function () {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})

app.on('browser-window-created', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
})
