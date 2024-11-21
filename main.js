const {app, BrowserWindow, Menu, dialog, ipcMain} = require("electron");
const fs = require("fs")

let mainWindow;
let currentFilePath = "untitled";

app.whenReady().then(()=>{
    mainWindow = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false,
        },
    })

    // custom menu bar 
    const menuTemplate = [
        {
            label:'File',
            submenu : [{
                label: "New",
                click : ()=>{
                    console.log("New button clicked.");
                    mainWindow.webContents.send("new-file");
                    mainWindow.webContents.send("filepath", "untitled");
                }
            },
            {
                label: "Open",
                click: ()=>{
                    console.log("Open button clicked");
                    const filePaths = dialog.showOpenDialogSync(mainWindow, {
                        filters : [{name:"Text Files", extensions:['txt']}]
                    })
                    if(filePaths && filePaths.length>0){
                        const filePath = filePaths[0];
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        mainWindow.webContents.send('file-opened', fileContent);
                        mainWindow.webContents.send("filepath", filePath);
                    }
                }    
            },
            {
                label: "Save",
                click: ()=>{
                    console.log("hello");
                    mainWindow.webContents.send("get-text-save");
                }
            },
            {
                label: "Save As",
                click: ()=>{
                    console.log("Save As button was clicked");
                    mainWindow.webContents.send("get-text-save-as");
                    mainWindow.webContents.send("filepath", currentFilePath);
                }
            },
            {type: 'separator'},
            {label: "Exit", role:"quit"}
            ]

        },
        {
            label:"Edit",
            submenu : [
                {
                    label:"Cut",
                    click: ()=>{console.log("Cut was clicked");},
                    role : "cut"
                },
                {
                    label:"Copy",
                    click: ()=>{console.log("Copy was clicked");},
                    role : "copy",
                },
                {
                    label:"Paste",
                    click: ()=>{console.log("Paste was clicked");},
                    role : "paste"
                }
            ]
        }
    ]

    const menuBar = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menuBar);

    ipcMain.on("save-text-save-as", (evt, text)=>{
        dialog.showMessageBox(mainWindow, {
            type:"question",
            title:"Save or not",
            message:"Do you want to save file",
            buttons:["yes", "no"]
        }).then((result)=>{
            if(result.response===0){
                const filePath = dialog.showSaveDialogSync(mainWindow, {
                    filters : [{name:"Text Files", extensions : ['txt']}]
                })
                if(filePath){
                    fs.writeFileSync(filePath, text);
                    currentFilePath = filePath;
                    mainWindow.webContents.send("filepath", currentFilePath);
                    console.log("file saved successfully");
                }
                
            }
            else{
                console.log("nothing saved");
            }
        })
        
    })

    ipcMain.on("save-text-save", (evt, text)=>{
        if(currentFilePath==="untitled"){
            dialog.showMessageBox(mainWindow, {
                type:"question",
                title:"Save or not",
                message:"Do you want to save file",
                buttons:["yes", "no"]
            }).then((result)=>{
                if(result.response===0){
                    const filePath = dialog.showSaveDialogSync(mainWindow, {
                        filters : [{name:"Text Files", extensions : ['txt']}]
                    })
                    if(filePath){
                        fs.writeFileSync(filePath, text);
                        currentFilePath = filePath;
                        mainWindow.webContents.send("filepath", currentFilePath);
                        console.log("file saved successfully");
                    }
                    
                }
                else{
                    console.log("nothing saved");
                }
            })
        }
        else {
            fs.writeFileSync(currentFilePath, text);
            console.log('saved');
        }
    })

    mainWindow.loadFile("./src/index.html");
})

app.on('window-all-closed', ()=>{
    app.quit();
});
