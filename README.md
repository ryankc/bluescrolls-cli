# bluescrolls-cli

`bluescrolls-cli` is a simple command-line interface (CLI) tool written in TypeScript that traverses directories and searches for `README` files. It also checks for any tracked `README` files in a Git repository.

## Features

- Traverse directories to find `README` files.
- Platform agnostic and easy to use.
- Built using TypeScript for type safety and code clarity.
- Sync README's with Bluescrolls

## Get Started
```bash
npm install -g bluescrolls-cli
bluescrolls ./
```

## Installation

### Global Installation

You can install the tool globally from npm to make it available as a command:

```bash
npm install -g bluescrolls-cli
```

## Local Installation 
Alternatively, you can clone the repository and run it locally using 'ts-node':
```
git clone https://github.com/yourusername/bluescrolls-cli.git
cd bluescrolls-cli
npm install
npm run start ./
```

You can build and execute like this 
```
npm run build && ./dist/bluescrolls.js ./
```


## Usage
After installing bluescrolls-cli globally, you can run it from anywhere using the command:
```
bluescrolls ./path/to/directory
```

### Arguments
`<directory>`: The path to the directory where the tool should start looking for README files. If no directory is provided, it defaults to the current directory (`./`).
`<excludedPaths>`: The paths the tool will ignore e.g. `['node_modules', 'dist', '.git', 'build', 'out', 'target', 'bin', 'packages']`

## Example
To search for `README` files in the current directory and check for tracked `README` files in the Git repository:
```
bluescrolls ./
```
This will output a list of `README` files found in the directory and any `README` files tracked by Git.

## Development
### Prerequisites
Make sure you have the following installed:
- Node.js (v14 or higher)
- npm

## Installation
To install the dependencies:
```
npm install
```

## Building the Project
To compile the TypeScript code into JavaScript, run:
```
npm run build
```

## Running Locally
To run the tool using `ts-node` for local development:
```
npm run start ./path/to/directory
```

## Publishing
To publish the package to npm, first make sure your code is committed, then run:
```
npm publish
```

## Issues
If you found the global bin directory (for example, /usr/local/bin or /opt/homebrew/bin), ensure that it is in your PATH.

If you had issues with ts-node before, you might need to install it again:
```
env: ts-node: No such file or directory
npm install -g ts-node
```
