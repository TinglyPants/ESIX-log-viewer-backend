const fs = require("fs");
const readline = require("readline");
const path = require("path");
require("dotenv").config();
const logFolderPath = process.env.LOGS_PATH;

let globalDataObject = { users: {}, commands: {} };

function processLogFiles() {
    let filenames = fs.readdirSync(logFolderPath);
    
    // reset global data
    globalDataObject = { users: {}, commands: {} };

    for (file of filenames) {
        processFile(file);
    }
}

async function processFile(filename) {
    const fileStream = fs.createReadStream(path.join(logFolderPath, filename));

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let date = filename.replace(".txt", "");
    console.log(date);

    let processedObject = { commands: {}, users: {} };

    for await (const line of rl) {
        // This is what happens for every line. Here we go!
        let splitLog = line.split(" ");
        let username = splitLog[0];
        let command = splitLog[2].slice(0, -1);

        // Adding to object
        // Commands
        if (processedObject.commands[command] === undefined) {
            processedObject.commands[command] = {};
        }
        if (processedObject.commands[command][username] === undefined) {
            processedObject.commands[command][username] = 1;
        } else {
            processedObject.commands[command][username] += 1;
        }

        //For global data object, create command if it doesn't exist.
        if (globalDataObject.commands[command] === undefined) {
            globalDataObject.commands[command] = 0;
        }
        globalDataObject.commands[command] += 1;

        //Users
        // Create user if it doesn't exist
        if (processedObject.users[username] === undefined) {
            processedObject.users[username] = {};
        }

        //For global data object, create user if it doesn't exist.
        if (globalDataObject.users[username] === undefined) {
            globalDataObject.users[username] = 0;
        }
        globalDataObject.users[username] += 1;

        // Add command data
        if (processedObject.users[username][command] === undefined) {
            processedObject.users[username][command] = 1;
        } else {
            processedObject.users[username][command] += 1;
        }
    }

    let processedObjectString = JSON.stringify(processedObject);
    fs.writeFile(
        path.join(__dirname, "processedLogs", date + ".json"),
        processedObjectString,
        (err) => {
            if (err) throw err;
            console.log("It's saved!");
        }
    );
    let globalDataObjectString = JSON.stringify(globalDataObject);
    fs.writeFile(
        path.join(__dirname, "processedLogs", "globalData.json"),
        globalDataObjectString,
        (err) => {
            if (err) throw err;
            console.log("It's saved!");
        }
    );
}

//processLogFiles();

module.exports = processLogFiles;
