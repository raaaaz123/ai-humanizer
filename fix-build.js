const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build fix script...');

// Path to .next directory
const nextDir = path.join(__dirname, '.next');

// Check if .next directory exists
if (fs.existsSync(nextDir)) {
  console.log('Found .next directory, cleaning...');
  
  try {
    // On Windows, use rmdir /s /q to force delete without prompting
    if (process.platform === 'win32') {
      console.log('Using Windows commands to clean .next directory...');
      execSync('rmdir /s /q .next', { stdio: 'inherit' });
    } else {
      // On Unix systems, use rm -rf
      console.log('Using Unix commands to clean .next directory...');
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    console.log('.next directory successfully removed');
  } catch (error) {
    console.error('Error removing .next directory:', error.message);
    console.log('Attempting to remove trace file specifically...');
    
    // Try to remove just the trace file if full directory removal fails
    const traceFile = path.join(nextDir, 'trace');
    if (fs.existsSync(traceFile)) {
      try {
        fs.unlinkSync(traceFile);
        console.log('Successfully removed trace file');
      } catch (unlinkError) {
        console.error('Failed to remove trace file:', unlinkError.message);
      }
    }
  }
} else {
  console.log('.next directory does not exist, no cleanup needed');
}

// Update package.json scripts
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Check if we need to update the build script
  if (!packageJson.scripts.prebuild || !packageJson.scripts.prebuild.includes('node fix-build.js')) {
    console.log('Updating package.json scripts...');
    
    // Add prebuild script
    packageJson.scripts.prebuild = 'node fix-build.js';
    
    // Write back to package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with prebuild script');
  } else {
    console.log('package.json already has prebuild script');
  }
} catch (error) {
  console.error('Error updating package.json:', error.message);
}

console.log('Build fix script completed');
console.log('You can now run "npm run build" to build the project'); 