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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const commander_1 = require("commander");
const simple_git_1 = __importDefault(require("simple-git"));
// Helper function to traverse directories and find README files
function findReadmeFiles(dirPath) {
    let readmes = [];
    // Read the directory contents
    const files = fs.readdirSync(dirPath);
    // Iterate over each file or folder
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        // If the item is a directory, recurse into it
        if (stat.isDirectory()) {
            readmes = readmes.concat(findReadmeFiles(fullPath));
        }
        else if (file.toLowerCase().includes('readme')) {
            // Check if the file is a README file
            readmes.push(fullPath);
        }
    });
    return readmes;
}
// Function to look for README files in Git repo
async function findReadmesInGitRepo() {
    const git = (0, simple_git_1.default)();
    // Check if we are in a Git repository
    const isGitRepo = await git.checkIsRepo();
    if (!isGitRepo) {
        console.log('Not a Git repository.');
        return [];
    }
    // Get the list of tracked files from the Git repository
    const status = await git.raw(['ls-files', '--full-name']);
    const files = status.split('\n').filter(file => file.toLowerCase().includes('readme'));
    return files;
}
// Main function to run the bluescrolls CLI
async function runBluescrolls(dir) {
    console.log(`Searching for README files in: ${dir}`);
    // Traverse the directory to find README files
    const readmeFiles = findReadmeFiles(dir);
    console.log('README files found in the directory:');
    readmeFiles.forEach(file => console.log(file));
    // Check for README files in the git repository
    const gitReadmes = await findReadmesInGitRepo();
    if (gitReadmes.length > 0) {
        console.log('\nREADME files found in Git repository:');
        gitReadmes.forEach(file => console.log(file));
    }
    else {
        console.log('\nNo README files found in Git repository.');
    }
}
// Set up Commander.js for CLI argument parsing
const program = new commander_1.Command();
program
    .version('1.0.0')
    .argument('<directory>', 'Directory to search for README files')
    .action((directory) => {
    runBluescrolls(directory).catch(err => {
        console.error('Error:', err);
    });
});
program.parse(process.argv);
