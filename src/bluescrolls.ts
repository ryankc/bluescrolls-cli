#!/usr/bin/env ts-node

import * as fs from 'fs-extra';
import * as path from 'path';
import { postData } from "./api";
import {Command} from 'commander';

const defaultExcluded = ['node_modules', 'dist', '.git', 'build', 'out', 'target', 'bin', 'packages']

export interface LocalFile {
    path: string,
    content: string,
}

/**
 * Helper function to traverse directories and find README files.
 * Excludes specified directories such as 'node_modules'.
 *
 * @param dirPath The directory path to search in.
 * @param excludePaths Array of directories to exclude from the search.
 * @returns A list of paths to README files.
 */
function findReadmeFiles(dirPath: string, excludePaths: string[] = []): LocalFile[] {
    let readmes: LocalFile[] = [];

    // Read the directory contents
    const files = fs.readdirSync(dirPath);

    // Iterate over each file or folder
    files.forEach((file: any) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        // Skip the current directory if it's in the exclusion list
        if (stat.isDirectory() && excludePaths.includes(file)) {
            return;
        }

        // If the item is a directory, recurse into it
        if (stat.isDirectory()) {
            readmes = readmes.concat(findReadmeFiles(fullPath, excludePaths));
        } else if (file.toLowerCase().includes('readme')) {

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
`

const noWorkspaceIdError = `
No Workspace Id Provided Error. Please follow the setup instructions at: 
- https://bluescrolls.com -> 
  - Usage
  
You can also find workspace ids by opening a workspace. In the url, you will see the workspace id url.
`

// Main function to run the bluescrolls CLI
async function runBluescrolls(dir: string): Promise<void> {
    console.log(`Searching for README files in: ${dir}`);
    const apiToken = process.env.BLUESCROLLS_API_TOKEN;
    if (apiToken == null) {
        console.log(apiTokenSetupError)
        return
    }

    const workspaceId = process.argv.slice(3)[1]
    if (workspaceId == null) {
        console.log(noWorkspaceIdError)
        return
    }

    const excluded = process.argv.slice(3)[2] || JSON.stringify(defaultExcluded)
    // Traverse the directory to find README files
    const readmeFiles = findReadmeFiles(dir, JSON.parse(excluded.replace(/'/g, '"')));
    const prefix = path.basename(process.cwd());
    console.log('README files found in the directory:');
    readmeFiles.forEach(file => console.log(`${prefix}\\${file.path}`));

    await postData(apiToken, workspaceId, readmeFiles).catch((e) => {
        console.log("Error calling bluescrolls api:", e)
    })
}

// Set up Commander.js for CLI argument parsing
const program = new Command();
program
    .version('1.0.0')
    .argument('<directory>', 'Directory to search for README files')
    .argument('<workspaceId>', 'Go to https://bluescrolls.com and open up a workspace. The workspace id is in the url.')
    .option('e', `The paths the tool will ignore e.g. "['node_modules', 'dist', '.git', 'build', 'out']"`)
    .action((directory: string) => {
        runBluescrolls(directory).catch(err => {
            console.error('Error:', err);
        });
    });

program.parse(process.argv);

