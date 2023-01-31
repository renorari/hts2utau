/* UTAU Voice List CV  */
/*  (c) 2023 Renorari  */
/* Created by Renorari */

// Imports
const fs = require("node:fs");
const path = require("node:path");

// CV List
var CV = [];
fs.readdirSync(__dirname).forEach((file) => {
    if (!file.endsWith(".lab")) return;
    CV.push({
        "name": path.basename(file, ".lab"),
        "path": path.join("List", "CV", file)
    });
});

// Exports
module.exports = CV;