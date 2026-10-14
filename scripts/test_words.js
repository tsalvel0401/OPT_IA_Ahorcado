import fs from 'fs';
import path from 'path';

console.log('--- VALIDANDO DICCIONARIOS DE PALABRAS MULTI-IDIOMA ---');

function validateWordFile(filePath, langName, minWords = 500, regex = /^[A-ZÑ]+$/) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`FALLO: No existe el archivo ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  const words = JSON.parse(raw);
  const total = words.length;

  console.log(`[${langName}] Total de palabras cargadas: ${total}`);

  if (total < minWords) {
    throw new Error(`FALLO en ${langName}: Se requieren al menos ${minWords} palabras. Encontradas: ${total}`);
  }

  const seen = new Set();
  let errors = 0;

  words.forEach((word, idx) => {
    if (typeof word !== 'string') {
      console.error(`[${langName}] Error en palabra #${idx}: no es string`);
      errors++;
    }
    if (word.length < 7 || word.length > 10) {
      console.error(`[${langName}] Error en palabra #${idx} ("${word}"): longitud ${word.length} no está entre 7 y 10`);
      errors++;
    }
    if (word !== word.toUpperCase()) {
      console.error(`[${langName}] Error en palabra #${idx} ("${word}"): no está en mayúsculas`);
      errors++;
    }
    if (/[ÁÉÍÓÚÜáéíóúü]/.test(word)) {
      console.error(`[${langName}] Error en palabra #${idx} ("${word}"): contiene tildes`);
      errors++;
    }
    if (!regex.test(word)) {
      console.error(`[${langName}] Error en palabra #${idx} ("${word}"): contiene caracteres inválidos`);
      errors++;
    }
    if (seen.has(word)) {
      console.error(`[${langName}] Error en palabra #${idx} ("${word}"): duplicada`);
      errors++;
    }
    seen.add(word);
  });

  if (errors > 0) {
    throw new Error(`FALLO en ${langName}: ${errors} errores encontrados.`);
  }

  console.log(`✓ [${langName}] ${total} palabras verificadas correctamente (100% conformes).`);
}

validateWordFile('src/data/words-es.json', 'Español (ES)', 500, /^[A-ZÑ]+$/);
validateWordFile('src/data/words-en.json', 'English (EN)', 500, /^[A-Z]+$/);

console.log('✓ Todos los diccionarios JSON cumplen al 100% con los estándares.');
