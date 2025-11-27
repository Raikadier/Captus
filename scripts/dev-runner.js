import figlet from 'figlet';
import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Clear console thoroughly before showing logo
// ============================================
console.clear(); // Native clear

// Alternative clearing methods for better compatibility
if (process.platform === 'win32') {
    // Windows: Clear using ANSI escape codes + cls equivalent
    process.stdout.write('\x1Bc'); // Reset terminal
    process.stdout.write('\x1B[2J\x1B[0f'); // Clear screen and move cursor to top
} else {
    // Unix/Linux/Mac
    process.stdout.write('\x1Bc');
}

// Extra newlines to push any remaining content up
console.log('\n'.repeat(process.stdout.rows || 50));

// Custom Cactus ASCII Art (realistic with shading and relief)
const cactus = `
${chalk.green('                  ░░░░░▒▒▓▓▓')}
${chalk.green('                ░░░░░░▒▒▒▓▓▓█')}
${chalk.green('               ▒░░░░░░▒▒▒▒▓▓██')}
${chalk.green('               ░░░░░░░▒▒▒▒▓▓███')}
${chalk.green('              ░░░░░░░▒▒▒▒▒▓█████')}
${chalk.green(' ░░▒▒▓        ░░░░░░▒▒▒▒▒▒▓█████')}
${chalk.green('░░░░░▒▓▓█     ░░░░░▒▒▒▒▒▒▒▓█████')}
${chalk.green('░░░░░▒▒▓▓     ░░▒▒▒▒▒▒▒▒▒▓██████       ▓▓▓▓▓██')}
${chalk.green('░░░░▒▒▓▓█     ▒▒▒▒▒▒▒▒▒▒▓▓██████      ▓▓▓▓▓██▓')}
${chalk.green('░░░░▒▒▓▓█     ▒▒▒▒▒▒▒▒▒▓▓▓█████▓      ▓▓▓▓██▓▓')}
${chalk.green('░░░░▒▒▓▓█     ▒▒▒▒▒▒▒▒▓▓▓▓█████▓      ▓▓▓▓██▓▓')}
${chalk.green('░░░▒▒▒▒▓▓     ▒▒▒▒▒▒▒▓▓▓▓▓█████▓      ▓▓▓███▓▓')}
${chalk.green('░░░▒▒▒▒▒▓▓█   ▒▒▒▒▒▓▓▓▓▓▓▓█████▓      ▓█████▓▓')}
${chalk.green(' ▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▓▓▓▓▓▓▓▓▓█████▓      ██████▓▓')}
${chalk.green(' ▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████▓▓     ███████▓▓')}
${chalk.green('  ▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███▓▓▓ ██████████▓▓▓')}
${chalk.green('    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███▓▓▓▓██████████▓▓▓')}
${chalk.green('        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███▓▓▓▓▓▓████████▓▓▓')}
${chalk.green('              ▓▓▓▓▓▓▓▓▓████▓▓▓▓▓▓▓████▓▓▓▓▓')}
${chalk.green('              ▓▓▓▓▓▓▓▓▓███▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')}
${chalk.green('              ▓▓▓▓▓▓▓▓████▓▓▓▓▓▓▓▓▓▓▓▓▓')}
${chalk.green('              ▓▓▓▓▓▓▓█████▓▓▓▓▓▓')}
${chalk.green('              ▓▓▓▓▓▓██████▓▓▓▓▓▓')}
${chalk.green('              ▓▓▓▓▓▓██████▓▓▓▓▓▓')}
${chalk.green('              ▓▓▓▓▓███████▓▓▓▓▓▌')}
${chalk.green('              ▓▓▓▓████████▓▓▓▓▓▌')}
${chalk.green('              ▓▓▓█████████▓▓▓▓▓▌')}
${chalk.green('              ▓▓██████████▓▓▓▓▓▌')}
${chalk.green('              ████████████▓▓▓▓▓▌')}
${chalk.green('              ███████████▓▓▓▓▓▓▌')}
${chalk.green('               ████████▓▓▓▓▓▓▓▓')}
`;

// Display Banner
console.log(cactus);

// Custom CAPTUS text art (more elaborate design with box drawing characters)
const captusText = `
${chalk.bold.green('   ██████╗ █████╗ ██████╗ ████████╗██╗   ██╗███████╗')}
${chalk.bold.green('  ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║   ██║██╔════╝')}
${chalk.bold.green('  ██║     ███████║██████╔╝   ██║   ██║   ██║███████╗')}
${chalk.bold.green('  ██║     ██╔══██║██╔═══╝    ██║   ██║   ██║╚════██║')}
${chalk.bold.green('  ╚██████╗██║  ██║██║        ██║   ╚██████╔╝███████║')}
${chalk.bold.green('   ╚═════╝╚═╝  ╚═╝╚═╝        ╚═╝    ╚═════╝ ╚══════╝')}
`;

console.log(captusText);

console.log(chalk.bold.white('\n🚀  CAPTUS DEVELOPMENT SERVER\n'));

// Info Box
const boxWidth = 60;
const border = chalk.green('─'.repeat(boxWidth));

console.log(border);
console.log(chalk.bold.green(`  Frontend:   `) + chalk.white('http://localhost:5173'));
console.log(chalk.bold.green(`  Backend:    `) + chalk.white('http://localhost:4000'));
console.log(chalk.bold.green(`  Swagger UI: `) + chalk.white('http://localhost:4000/api-docs'));
console.log(chalk.bold.green(`  Health:     `) + chalk.white('http://localhost:4000/api/health'));
console.log(border);
console.log('\n');

// Run concurrently
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const backend = spawn(npmCmd, ['run', 'backend:dev'], {
    stdio: 'pipe',
    shell: true,
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, FORCE_COLOR: 'true' },
});

const frontend = spawn(npmCmd, ['run', 'frontend:dev'], {
    stdio: 'pipe',
    shell: true,
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, FORCE_COLOR: 'true' },
});

// Handle output
const formatOutput = (name, color, data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
        // Skip empty lines to avoid spam
        if (line.trim().length === 0) return;

        // Print line with prefix and color
        console.log(`${color(`[${name}]`)} ${line}`);
    });
};

backend.stdout.on('data', (data) => formatOutput('BACKEND', chalk.green, data));
backend.stderr.on('data', (data) => formatOutput('BACKEND', chalk.red, data));

frontend.stdout.on('data', (data) => formatOutput('FRONTEND', chalk.cyan, data));
frontend.stderr.on('data', (data) => formatOutput('FRONTEND', chalk.red, data));

// Handle process exit
const cleanup = () => {
    backend.kill();
    frontend.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
