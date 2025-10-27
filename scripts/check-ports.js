#!/usr/bin/env node

import { execSync } from 'child_process';
import net from 'net';

const FRONTEND_PORT = 5173;
const BACKEND_PORT = 4000;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

async function checkPorts() {
  console.log('🔍 Verificando puertos...\n');
  
  const frontendFree = await checkPort(FRONTEND_PORT);
  const backendFree = await checkPort(BACKEND_PORT);
  
  console.log(`Frontend (${FRONTEND_PORT}): ${frontendFree ? '✅ Disponible' : '❌ Ocupado'}`);
  console.log(`Backend (${BACKEND_PORT}): ${backendFree ? '✅ Disponible' : '❌ Ocupado'}`);
  
  if (!frontendFree || !backendFree) {
    console.log('\n⚠️  Algunos puertos están ocupados. Puedes:');
    console.log('1. Cerrar las aplicaciones que usan estos puertos');
    console.log('2. Cambiar los puertos en la configuración');
    console.log('3. Usar diferentes puertos especificando PORT=XXXX');
  } else {
    console.log('\n✅ Todos los puertos están disponibles');
  }
  
  // Verificar si Node.js está instalado
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`\n📦 Node.js: ${nodeVersion}`);
  } catch (error) {
    console.log('\n❌ Node.js no está instalado o no está en el PATH');
  }
  
  // Verificar si npm está instalado
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`📦 npm: ${npmVersion}`);
  } catch (error) {
    console.log('\n❌ npm no está instalado o no está en el PATH');
  }
}

checkPorts().catch(console.error);
