#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const commander_1 = require("commander");
const defaultExcluded = ['node_modules', 'dist', '.git', 'build', 'out', 'target', 'bin', 'packages'];
/**
 * Helper function to traverse directories and find README files.
 * Excludes specified directories such as 'node_modules'.
 *
 * @param dirPath The directory path to search in.
 * @param excludePaths Array of directories to exclude from the search.
 * @returns A list of paths to README files.
 */
function findReadmeFiles(dirPath, excludePaths = []) {
    let readmes = [];
    // Read the directory contents
    const files = fs.readdirSync(dirPath);
    // Iterate over each file or folder
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        // Skip the current directory if it's in the exclusion list
        if (stat.isDirectory() && excludePaths.includes(file)) {
            return;
        }
        // If the item is a directory, recurse into it
        if (stat.isDirectory()) {
            readmes = readmes.concat(findReadmeFiles(fullPath, excludePaths));
        }
        else if (file.toLowerCase().includes('readme')) {
            const directory = (path.dirname(fullPath)); // Get the directory of the README file
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            console.log(`README found in directory: ${directory}`); // Log the directory name
            readmes.push({ path: fullPath, content: fileContent });
        }
    });
    return readmes;
}
const apiTokenSetupError = `
API Token Not Found Error. Please follow the setup instructions at: 
- https://bluescrolls.com -> 
  - API Setup
    - API Token.
`;
const noWorkspaceIdError = `
No Workspace Id Provided Error. Please follow the setup instructions at: 
- https://bluescrolls.com -> 
  - Usage
  
You can also find workspace ids by opening a workspace. In the url, you will see the workspace id url.
`;
// Main function to run the bluescrolls CLI
async function runBluescrolls(dir) {
    console.log(`Searching for README files in: ${dir}`);
    const apiToken = process.env.BLUESCROLLS_API_TOKEN;
    if (apiToken == null) {
        console.log(apiTokenSetupError);
        return;
    }
    const workspaceId = process.argv.slice(3)[1];
    if (workspaceId == null) {
        console.log(noWorkspaceIdError);
        return;
    }
    const excluded = process.argv.slice(3)[2] || JSON.stringify(defaultExcluded);
    // Traverse the directory to find README files
    const readmeFiles = findReadmeFiles(dir, JSON.parse(excluded.replace(/'/g, '"')));
    const prefix = path.basename(process.cwd());
    console.log('README files found in the directory:');
    readmeFiles.forEach(file => console.log(`${prefix}\\${file.path}`));
    return;
    // await postData(apiToken, workspaceId).catch((e) => {
    //     console.log("Error calling bluescrolls api:", e)
    // })
}
// Set up Commander.js for CLI argument parsing
const program = new commander_1.Command();
program
    .version('1.0.0')
    .argument('<directory>', 'Directory to search for README files')
    .argument('<workspaceId>', 'Go to https://bluescrolls.com and open up a workspace. The workspace id is in the url.')
    .option('e', `The paths the tool will ignore e.g. "['node_modules', 'dist', '.git', 'build', 'out']"`)
    .action((directory) => {
    runBluescrolls(directory).catch(err => {
        console.error('Error:', err);
    });
});
program.parse(process.argv);
