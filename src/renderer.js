const {ipcRenderer} = require("electron");
let currentFilePath = "untitled";



ipcRenderer.on('get-text-save-as', (evt)=>{
    const text = document.getElementById("textBox").value;
    ipcRenderer.send('save-text-save-as', text);
});

ipcRenderer.on('get-text-save', (evt)=>{
    const text = document.getElementById("textBox").value;
    ipcRenderer.send('save-text-save', text);
});

ipcRenderer.on("file-opened", (evt, fileContent)=>{
    const textBox = document.getElementById("textBox");
    textBox.value=fileContent;
})

ipcRenderer.on("new-file", ()=>{
    document.getElementById("textBox").value="";
})

ipcRenderer.on("filepath", (evt, filePath)=>{
    currentFilePath = filePath;
    document.title=filePath;
})