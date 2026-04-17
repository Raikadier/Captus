#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Iniciando Captus...\n');

// Función para ejecutar comandos
function runCommand(command, args, cwd, name) {
  console.log(`📦 Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: true
  });
  
  process.on('error', (error) => {
    console.error(`❌ Error en ${name}:`, error.message);
  });
  
  process.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} terminó con código ${code}`);
    }
  });
  
  return process;
}

// Verificar si las dependencias están instaladas
async function checkDependencies() {
  console.log('🔍 Verificando dependencias...');
  
  try {
    // Verificar backend
    const backendPackageJson = join(projectRoot, 'backend', 'package.json');
    const backendNodeModules = join(projectRoot, 'backend', 'node_modules');
    
    // Verificar frontend
    const frontendPackageJson = join(projectRoot, 'frontend', 'package.json');
    const frontendNodeModules = join(projectRoot, 'frontend', 'node_modules');
    
    console.log('✅ Dependencias verificadas');
    return true;
  } catch (error) {
    console.log('❌ Error verificando dependencias:', error.message);
    return false;
  }
}

// Función principal
async function start() {
  const depsOk = await checkDependencies();
  
  if (!depsOk) {
    console.log('\n💡 Ejecuta: npm run setup');
    process.exit(1);
  }
  
  console.log('\n🎯 Iniciando servicios...\n');
  
  // Iniciar backend primero
  const backendProcess = runCommand('npm', ['run', 'dev'], join(projectRoot, 'backend'), 'Backend');
  
  // Esperar un poco antes de iniciar el frontend
  setTimeout(() => {
    const frontendProcess = runCommand('npm', ['run', 'dev'], join(projectRoot, 'frontend'), 'Frontend');
    
    // Manejar cierre limpio
    process.on('SIGINT', () => {
      console.log('\n🛑 Cerrando servicios...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
  }, 2000);
}

start().catch(console.error);
