/*     HTS To UTAU     */
/*  (c) 2023 Renorari  */
/* Created by Renorari */

// Imports
const readline = require("node:readline");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

// Create interface
const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get HTS file path
interface.question("Enter the path to the HTS file: ", (HTSPath) => {
    // Windows path fix
    HTSPath = HTSPath.replace(/\\/g, "/");

    // Check file type & existence
    if (!HTSPath.endsWith(".htsvoice")) {
        console.log("Invalid file type.");
        process.exit(1);
    } else if (!fs.existsSync(HTSPath)) {
        console.log("File does not exist.");
        process.exit(1);
    }

    // Read file
    const hts = fs.readFileSync(HTSPath, "utf-8");

    // Check HTS file
    if (!hts.match("FULLCONTEXT_FORMAT:HTS_TTS_JPN")) {
        console.log("Invalid HTS file.");
        process.exit(1);
    }

    // Set output path
    const outputPath = path.join("output", path.basename(HTSPath, ".htsvoice"));

    // Create output directory
    if (!fs.existsSync("output")) fs.mkdirSync("output");
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

    // List list
    const lists = fs.readdirSync(path.join(__dirname, "List"));

    // Select List
    interface.question(`Select a list [${lists.join("/")}]: `, (selectedList) => {
        // Convert to uppercase
        selectedList = selectedList.toLocaleUpperCase();

        // Check list
        if (!lists.includes(selectedList)) {
            console.log("Invalid list.");
            process.exit(1);
        }

        // Get list
        var list = list = require(path.join(__dirname, "List", selectedList, "index.js"));

        // Create UTAU file
        var index = 0;
        for (const voice of list) {
            index++;
            console.log(`Converting ${voice.name} (${Math.round(index / list.length * 100)}%)...`);
            childProcess.execSync(`hts_engine -vp -m ${HTSPath} -ow ${path.join(outputPath, voice.name + ".wav")} ${voice.path}`);
            console.log(`Converted ${voice.name}.`);
        }

        // Exit
        console.log("Done.");
        process.exit(0);
    });
});