import blessed from 'blessed';
import contrib from 'blessed-contrib';
import chalk from 'chalk';
import figlet from 'figlet';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// ============================================
// 🎨 Theme
// ============================================
const backendColor = chalk.hex('#2E7D32');
const frontendColor = chalk.hex('#4285F4');
const errorColor = chalk.hex('#EA4335');
const warnColor = chalk.hex('#FBBC04');
const dimColor = chalk.hex('#5F6368');

// ============================================
// 📊 State
// ============================================
const state = {
    startTime: Date.now(),
    req2xx: 0,
    req4xx: 0,
    req5xx: 0
};

// ============================================
// 🖥️ Screen Setup
// ============================================
const screen = blessed.screen({
    smartCSR: true,
    title: 'CAPTUS DEV DASHBOARD',
    fullUnicode: true,
    dockBorders: true,
    ignoreLocked: ['C-c']
});

// ============================================
// Header (Logo + CAPTUS - No borders)
// ============================================
const header = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: 9,
    content: ''
});

const renderHeader = () => {
    const cactus = [
        '       ░░▒▓       ',
        '      ░░▒▒▓█      ',
        '     ░░▒▒▓▓██     ',
        '░▒▓  ░░▒▒▓▓██  ▓█ ',
        '░▒▓█ ░▒▒▓▓███ ▓██ ',
        ' ▒▒▒▒▒▓▓▓███▓▓██▓ ',
        '  ▓▓▓▓▓▓████▓▓▓▓  ',
        '     ▓▓█████▓     '
    ];

    const captusText = figlet.textSync('CAPTUS', { font: 'ANSI Shadow' });
    const captusLines = captusText.split('\n').filter(line => line.trim() !== '');
    const coloredLines = captusLines.map(line => chalk.bold.green(line));

    const maxLines = Math.max(cactus.length, coloredLines.length);
    const cactusPadTop = Math.floor((maxLines - cactus.length) / 2);
    const captusPadTop = Math.floor((maxLines - coloredLines.length) / 2);

    let combined = '';
    for (let i = 0; i < maxLines; i++) {
        const cactusIdx = i - cactusPadTop;
        const captusIdx = i - captusPadTop;
        const cactusLine = (cactusIdx >= 0 && cactusIdx < cactus.length) ? cactus[cactusIdx] : '                  ';
        const captusLine = (captusIdx >= 0 && captusIdx < coloredLines.length) ? coloredLines[captusIdx] : '';
        combined += chalk.green(cactusLine) + ' ' + captusLine + '\n';
    }

    header.setContent(combined);
};
renderHeader();

// ============================================
// Dashboard Section (Using grid for widgets only)
// ============================================
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// Donut for HTTP requests
const statusDonut = grid.set(3, 0, 3, 3, contrib.donut, {
    label: ' HTTP Requests ',
    radius: 8,
    arcWidth: 3,
    remainColor: 'black',
    yPadding: 2,
    data: [
        { percent: 0, label: '2xx', color: 'green' },
        { percent: 0, label: '4xx', color: 'yellow' },
        { percent: 0, label: '5xx', color: 'red' }
    ]
});

// Line chart for system load
const resourceLine = grid.set(3, 3, 3, 6, contrib.line, {
    style: { line: "yellow", text: "green", baseline: "black" },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    wholeNumbersOnly: false,
    label: ' System Load '
});

const cpuData = { title: 'CPU', x: ['1', '2', '3', '4', '5'], y: [0, 0, 0, 0, 0], style: { line: 'red' } };
const memData = { title: 'Mem', x: ['1', '2', '3', '4', '5'], y: [0, 0, 0, 0, 0], style: { line: 'blue' } };

let ticks = 0;
setInterval(() => {
    ticks++;
    const cpu = Math.floor(Math.random() * 30) + 10;
    const mem = Math.floor(Math.random() * 20) + 40;
    cpuData.y.shift(); cpuData.y.push(cpu);
    memData.y.shift(); memData.y.push(mem);
    cpuData.x.shift(); cpuData.x.push(String(ticks));
    memData.x.shift(); memData.x.push(String(ticks));
    resourceLine.setData([cpuData, memData]);
    screen.render();
}, 2000);

// Services list
const servicesBox = grid.set(3, 9, 3, 3, blessed.list, {
    label: ' Services ',
    tags: true,
    border: { type: 'line' },
    style: { selected: { bg: 'blue' }, border: { fg: 'green' } },
    items: [
        `${chalk.green('●')} Frontend: 5173`,
        `${chalk.green('●')} Backend:  4000`,
        `${chalk.green('●')} Database: 5432`,
        `${chalk.gray('○')} Redis:    OFF`,
    ]
});

// ============================================
// Logs Section (Bottom)
// ============================================

const backendLog = grid.set(6, 0, 6, 6, contrib.log, {
    fg: 'green',
    selectedFg: 'green',
    label: ' Backend Logs ',
    border: { type: 'line', fg: 'green' }
});

const frontendLog = grid.set(6, 6, 6, 6, contrib.log, {
    fg: 'cyan',
    selectedFg: 'cyan',
    label: ' Frontend Logs ',
    border: { type: 'line', fg: 'cyan' }
});

// ============================================
// Process Management
// ============================================

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const backend = spawn(npmCmd, ['run', 'backend:dev'], {
    stdio: 'pipe',
    shell: true,
    cwd: rootDir,
    env: { ...process.env, FORCE_COLOR: 'true' },
});

const frontend = spawn(npmCmd, ['run', 'frontend:dev'], {
    stdio: 'pipe',
    shell: true,
    cwd: rootDir,
    env: { ...process.env, FORCE_COLOR: 'true' },
});

const updateDonut = () => {
    const total = state.req2xx + state.req4xx + state.req5xx;
    if (total === 0) return;
    statusDonut.setData([
        { percent: Math.round((state.req2xx / total) * 100), label: '2xx', color: 'green' },
        { percent: Math.round((state.req4xx / total) * 100), label: '4xx', color: 'yellow' },
        { percent: Math.round((state.req5xx / total) * 100), label: '5xx', color: 'red' }
    ]);
};

const truncate = (str, max = 80) => str.length > max ? str.substring(0, max) + '...' : str;

backend.stdout.on('data', (data) => {
    const str = truncate(data.toString().trim());
    if (!str) return;
    if (str.match(/\s2\d{2}\s/)) { state.req2xx++; updateDonut(); }
    else if (str.match(/\s4\d{2}\s/)) { state.req4xx++; updateDonut(); }
    else if (str.match(/\s5\d{2}\s/)) { state.req5xx++; updateDonut(); }
    backendLog.log(str);
});

backend.stderr.on('data', (data) => {
    backendLog.log(chalk.red(truncate(data.toString().trim())));
});

frontend.stdout.on('data', (data) => {
    frontendLog.log(truncate(data.toString().trim()));
});

frontend.stderr.on('data', (data) => {
    frontendLog.log(chalk.red(truncate(data.toString().trim())));
});

// ============================================
// Key Bindings & Cleanup
// ============================================

screen.key(['escape', 'q', 'C-c'], function () {
    backend.kill();
    frontend.kill();
    return process.exit(0);
});

screen.on('resize', function () {
    statusDonut.emit('attach');
    resourceLine.emit('attach');
    backendLog.emit('attach');
    frontendLog.emit('attach');
});

screen.render();
