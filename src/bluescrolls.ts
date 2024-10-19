#!/usr/bin/env ts-node

import * as fs from 'fs-extra';
import * as path from 'path';
import { Command } from 'commander';
import simpleGit, { SimpleGit } from 'simple-git';

// Helper function to traverse directories and find README files
function findReadmeFiles(dirPath: string): string[] {
  let readmes: string[] = [];

  // Read the directory contents
  const files = fs.readdirSync(dirPath);

  // Iterate over each file or folder
  files.forEach((file: any) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    // If the item is a directory, recurse into it
    if (stat.isDirectory()) {
      readmes = readmes.concat(findReadmeFiles(fullPath));
    } else if (file.toLowerCase().includes('readme')) {
      // Check if the file is a README file
      readmes.push(fullPath);
    }
  });

  return readmes;
}

// Function to look for README files in Git repo
async function findReadmesInGitRepo(): Promise<string[]> {
  const git: SimpleGit = simpleGit();

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
async function runBluescrolls(dir: string): Promise<void> {
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
  } else {
    console.log('\nNo README files found in Git repository.');
  }
}

// Set up Commander.js for CLI argument parsing
const program = new Command();
program
  .version('1.0.0')
  .argument('<directory>', 'Directory to search for README files')
  .action((directory: string) => {
    runBluescrolls(directory).catch(err => {
      console.error('Error:', err);
    });
  });

program.parse(process.argv);

