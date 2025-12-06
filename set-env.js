const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error('Error loading .env file:', result.error);
        process.exit(1);
    }
    console.log('Loaded environment variables from .env');
} else {
    console.log('.env file not found, using system environment variables');
}

// Define the path to the environment file
const targetPath = path.resolve(__dirname, './src/environments/environment.ts');

// Get environment variables
const supabaseUrl = process.env.NG_APP_SUPABASE_URL || '';
const supabaseKey = process.env.NG_APP_SUPABASE_KEY || '';
const isProduction = process.env.NODE_ENV === 'production';

// Create the content for the environment file
const envConfigFile = `export const environment = {
  production: ${isProduction},
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

// Write the file
fs.writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
        console.error('Error writing environment file:', err);
        process.exit(1);
    }
    console.log(`Environment file generated correctly at ${targetPath}`);
});
