const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Falls ein Preload-Skript benötigt wird
            nodeIntegration: false,  // Sicherheitseinstellung
            contextIsolation: true   // Sicherheitseinstellung
        }
    });

    // Lädt die React-App (Vite Dev-Server oder das Build)
    const devURL = "http://localhost:5173";  // Dev-Modus (Vite)
    const prodURL = `file://${path.join(__dirname, "dist", "index.html")}`; // Build-Modus

    mainWindow.loadURL(app.isPackaged ? prodURL : devURL);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

// Beendet die App, wenn alle Fenster geschlossen sind
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});