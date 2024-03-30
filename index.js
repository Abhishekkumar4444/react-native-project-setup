#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const yargs = require('yargs');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Define the project structure: directories and their respective files
const projectStructure = {
  'src': [
    'assets',
    'api',
    'configs',
    'components/auth',
    'components/payment',
    'components/common',
    'components/employees',
    'hooks/auth',
    'hooks/payment',
    'hooks/employees',
    'lib',
    'services',
    'states',
    'utils',
    'screens',
    'helpers',
    'constants',
    'navigations',
    'styles',
  ],
  'src/components/auth': ['SignUpForm.tsx'],
  'src/components/payment': ['PaymentForm.tsx'],
  'src/components/common': ['Button.tsx'],
  'src/components/employees': ['EmployeeList.tsx', 'EmployeeSummary.tsx'],
  'src/hooks/auth': ['useAuth.ts'],
  'src/hooks/payment': ['usePayment.ts'],
  'src/hooks/employees': ['useEmployees.ts', 'useUpdateEmployee.ts'],
  'src/screens': [],
  'src/helpers': [],
  'src/constants': [],
  'src/navigations': [],
  'src/styles': [],
};

// Function to create directories and files
async function createProjectStructure() {
  for (const [dir, subdirs] of Object.entries(projectStructure)) {
    try {
      await mkdirRecursive(dir); // Create directories recursively
      if (subdirs) {
        await Promise.all(subdirs.map(subdir => mkdirRecursive(`${dir}/${subdir}`))); // Create subdirectories recursively
        if (dir !== 'src') {
          await Promise.all(subdirs.map(subdir => writeFile(`${dir}/${subdir}/.gitkeep`, ''))); // Create .gitkeep in subdirectories
        }
      }
    } catch (error) {
      console.error(`Error creating ${dir}: ${error.message}`);
    }
  }
}

// Function to create directories recursively
async function mkdirRecursive(dirPath) {
  const normalizedPath = path.normalize(dirPath);
  const segments = normalizedPath.split(path.sep);
  let currentPath = '';
  for (const segment of segments) {
    currentPath = path.join(currentPath, segment);
    try {
      await mkdir(currentPath);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

// Command to create a new project structure
yargs.command({
  command: 'create',
  describe: 'Create a new project structure',
  handler: async () => {
    try {
      await createProjectStructure();
      console.log('Project structure created successfully.');
    } catch (error) {
      console.error('Error creating project structure:', error);
    }
  },
});

// Parse command-line arguments
yargs.parse();
