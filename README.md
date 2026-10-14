# DOCUMENTO_PROCESO.MD
## Auditoría del Desarrollo Asistido con Inteligencia Artificial
**Proyecto:** Juego de Adivinar la Palabra (Juego del Ahorcado Web)  
**Asignatura:** Desarrollo Asistido con IA (Curso 26-27)  
**Ciclo:** 2º G.D. C.F.G.S. Desarrollo de Aplicaciones Web (D.A.W.)  
**Centro:** IES Trafalgar  
**Alumno:** Tonny  
**Fecha:** Octubre 2026  

# [Enlace ->](https://opt-ia-ahorcado.vercel.app/)

---

## 1. Registro de Herramientas y Desglose de Contribución

### 1.1. Herramientas utilizadas
A lo largo de las distintas fases del ciclo de vida del proyecto (análisis de requisitos, diseño arquitectónico, generación de código, depuración, refactorización y auditoría), se han utilizado las siguientes herramientas y modelos de Inteligencia Artificial:

1. **Gemini 3.8 Flash (Google DeepMind):**
   - **Rol principal:** Modelo central de IA responsable de la generación de **todo el código** del proyecto, el meta-prompting y la reestructuración arquitectónica.
   - **Uso específico:** Generó el 100% del código fuente (componentes React, hooks personalizados `useGame` y `useLanguage`, utilidades puras `scoreCalculator.js`, `letterValidator.js` y `wordSanitizer.js`, así como los diccionarios masivos en JSON `words-es.json` con 819 palabras y `words-en.json` con 724 palabras). Asimismo, fue el modelo encargado de refinar y optimizar los prompts iniciales informales hacia especificaciones técnicas avanzadas (meta-prompting).
2. **Entorno de Asistencia y Pair Programming CLI:**
   - **Rol principal:** Interfaz de ejecución, creación estructurada de archivos en disco, inspección estática del código generado y verificación del entorno de Vite y Node.js.
3. **Generación y Optimización de Recursos Vectoriales (SVG):**
   - **Rol principal:** Generación mediante Gemini 3.8 Flash de los iconos SVG vectoriales para las banderas (`es.svg`, `en.svg`) para solucionar el problema de renderizado de emojis de banderas en Windows.

---

### 1.2. Estimación porcentual del código final subido al repositorio

| Tipo de contribución | Porcentaje (%) | Descripción y justificación en el proyecto |
| :--- | :---: | :--- |
| **% Código / diseño propio** | **0 %** | Escrito o maquetado manualmente desde cero. Ninguna línea de código JavaScript, marcado JSX ni regla CSS fue escrita manualmente sin la mediación directa de Gemini 3.8 Flash. Todo el código base y sus modificaciones provienen de respuestas generadas por el modelo. |
| **% Código / diseño directo de IA** | **70 %** | Generado por la IA y aceptado sin modificaciones significativas: <br>• Estructura base de Vite y React (`main.jsx`, `index.html`). <br>• Funciones puras de cálculo matemático de puntuación (`scoreCalculator.js`). <br>• Lógica de sanitización y máquina de estados (`wordSanitizer.js`). <br>• Diccionarios masivos estructurados en JSON (`words-es.json` con 819 palabras y `words-en.json` con 724 palabras). <br>• Textos completos de localización internacional (`locales/es.json` y `locales/en.json`). <br>• Componentes atómicos de presentación (`Modal.jsx`, `Toast.jsx`, `Footer.jsx`). |
| **% Código / diseño refactorizado** | **30 %** | Sugerido por la IA pero corregido, adaptado o reestructurado por ti para que funcionara o se ajustara al proyecto mediante iteraciones guiadas: <br>• **Alineación del marcador:** Corrección de CSS flexbox y `white-space: nowrap` en `ScoreBoard.jsx` porque el separador `/` caía a otra línea. <br>• **Soporte multiplataforma de banderas:** Reemplazo de emojis regionales de texto plano por componentes gráficos SVG en `LanguageSelector.jsx` para evitar el bug de Windows. <br>• **Limpieza de interfaz (UI Noise):** Eliminación de contadores innecesarios de palabras restantes, badges redundantes de estado ("Listo para jugar") y fusión de botones duplicados en un único CTA dinámico (`GameControls.jsx`). <br>• **Tutorial de inicio:** Incorporación de la pantalla `StartScreen` para dar contexto antes de pulsar "Comenzar". <br>• **Desacoplamiento de funciones anidadas:** Extracción de funciones que la IA inicialmente generaba dentro de un componente monolítico hacia servicios y hooks dedicados. |
| **TOTAL** | **100 %** | **Desglose completo verificado del repositorio.** |

---

## 2. Bitácora de Interacción (Muestra de Prompts Reales)

Debes incluir en la documentación las interacciones con la IA durante la construcción de la web:

### 2.1. Casos de Estudio Requeridos por la Rúbrica Oficial

#### Ejemplo 1 (Generación / Arquitectura):
- **Prompt de entrada enviado:** (Ver transcripción completa del Prompt 1 y Prompt 2 en la sección 2.2). Se solicitó a Gemini 3.8 Flash actuar como desarrollador senior de React y Bootstrap para crear la arquitectura del juego del ahorcado con al menos 500 palabras de 7 a 10 letras, control de sesión y cálculo de puntuación.
- **Código / Estructura devuelta:** Gemini 3.8 Flash entregó una primera versión funcional pero monolítica, donde las 500 palabras estaban declaradas como un array estático hardcodeado dentro del código JavaScript (`const words = [...]`) y la lógica de inicio anidaba funciones secundarias (`iniciarJuego` contenía `seleccionarPalabra`, `calcularPuntuacion`, `validarLetra`).
- **Análisis de si funcionó a la primera o si exigió modificaciones:** **No funcionó a la primera.** Aunque era jugable en el navegador, presentaba serios problemas de arquitectura: acoplamiento de datos con la vista, regeneración innecesaria de funciones en cada render de React y una interfaz sobrecargada sin jerarquía. Exigió una refactorización guiada para extraer los datos a `words.json`, aislar funciones puras en `utils/` y modularizar los componentes.

#### Ejemplo 2 (Resolución de errores / Debugging):
- **Mensaje de error o bug pegado a la IA:**
  > *"La cosa es que en este caso: [...] En este caso los fallos cometidos se ve raro el / que este tan debajo. [...] También en este caso no me gusta para nada que donde dice el idioma no aparezca realmente el icono de la flag es decir yo quiero que se vea tal cual la bandera su iconito que es con eso de 🇪🇸. Pero claro que se vea la bandera no las letras."*
- **Solución propuesta por la IA:**
  1. En `ScoreBoard.jsx`, Gemini 3.8 Flash solucionó el salto de línea y la desalineación aplicando un contenedor Flexbox en línea con propiedades estrictas de maquetación:
     ```jsx
     <span
       className="fw-bold fs-6"
       style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', lineHeight: 1 }}
     >
       {mistakes}
       <span className="mx-1 text-secondary opacity-75" style={{ lineHeight: 1 }}>/</span>
       {maxMistakes}
     </span>
     ```
  2. En `LanguageSelector.jsx`, Gemini 3.8 Flash descartó los emojis Unicode (que en Windows se renderizaban como texto plano `ES` y `GB`) y creó dos archivos vectoriales SVG limpios (`assets/flags/es.svg` y `assets/flags/en.svg`), vinculándolos en `languageLoader.js`.
- **Evaluación de si la respuesta resolvió realmente el problema:** **Sí, lo resolvió al 100%.** El uso de `white-space: nowrap` impidió definitivamente que el separador `/` saltara de línea en cualquier resolución, y los iconos SVG garantizaron visualización idéntica y nítida en Windows, Linux y macOS.

#### Ejemplo 3 (Detección de alucinaciones / Código erróneo):
- **Caso concreto detectado:**
  1. **Alucinación de datos (Placeholder de omisión):** En la primera iteración, a pesar de que el enunciado exigía al menos 500 palabras reales sin omisiones, el modelo generó un array con unas 15 palabras seguido del comentario:
     ```javascript
     // ... aquí irían las 500 palabras restantes cumpliendo las reglas
     ```
  2. **Violación de restricciones léxicas:** Al insistirle, incluyó palabras con tildes (`ÁRBOL`, `CAMIÓN`) y palabras de menos de 7 letras (`CASA`), las cuales bloqueaban el juego ya que el validador de entrada solo admitía `[a-zA-ZñÑ]` sin acentos.
  3. **Alucinación funcional en la UI:** Creó un botón técnico con el texto *"Reiniciar diccionario"* y etiquetas como *"Array de palabras restantes: 487"*, exponiendo conceptos de backend al usuario final.
- **Cómo se detectó el fallo:**
  Se detectó revisando la longitud del array con herramientas de desarrollo (`array.length < 500`), probando la partida en el navegador (donde las palabras con acento eran imposibles de adivinar) y realizando una auditoría visual de la interfaz. Se corrigió forzando la creación de `data/words-es.json` y `data/words-en.json` con más de 800 y 700 palabras verificadas respectivamente.

#### Ejemplo 4 (Refactorización / Optimización):
- **Prompt utilizado para mejorar, limpiar o estilizar código/CSS previo:**
  (Ver transcripción completa de los Prompts 2, 3 y 4 en la sección 2.2). Se solicitó actuar como *Lead Frontend Architect y Diseñador UI/UX Senior* exigiendo Clean Architecture, subcarpetas por responsabilidad (`layout/`, `game/`, `ui/`), internacionalización (i18n) en `locales/*.json`, animaciones sutiles de *Game Juice* (`game-juice.css`) y un footer minimalista con estrictamente `© 2026 Adivina la palabra.`.

---

### 2.2. Registro Íntegro y Completo de TODOS los Prompts Reales del Proyecto

> **Nota metodológica:** Todos los prompts que figuran a continuación corresponden al registro exacto e íntegro del desarrollo (`README.md`), sin omitir ningún prompt ni sección, incluyendo el prompt inicial informal redactado por el alumno, la versión técnica mejorada enviada a **Gemini 3.8 Flash** y el análisis del resultado generado tras cada iteración.

---

### 1. Primer Prompt Completo

1. Primer prompt:

mejora este prompt;

Actua como un developer senior de HTML, CSS, PHP, React, Vue, Svelt, Boostrap.

Para la realización de este juego debes de utilizar un framework como React, Svelt, Boostrap.

El juego consistirá en adivinar una palabra seleccionada aleatoriamente entre una lista
de palabras que tiene el programa. El programa debe tener al menos 500 palabras
almacenadas, todas de entre 7 y 10 letras.

Reglas:
o Disponemos como máximo de 7 fallos para adivinar la palabra. Si cometemos
el número máximo de fallos finalizará el juego quedando con la puntuación
que tuviésemos en aquel momento.
o La puntuación por cada letra acertada estará en función del número de fallos
cometidos hasta ese momento. Cada acierto se puntuará atendiendo a la
siguiente fórmula:
Puntuación = Num. letras acertadas * (Máx. fallos permitidos - N.º fallos cometidos)
▪ Al hacer click sobre el botón “comenzar”, el programa debe rescatar una palabra del
array de palabras del juego y además eliminarla de dicho array. Debe llevarse un
control del número de palabras restantes.
▪ A partir de ahí el juego comienza. Si anteriormente se ha jugado, se borrarán todas las
letras de los campos de texto. Se debe llevar el control de palabras restantes en el
array, cuando no queden más no se podrá seguir jugando .
▪ El jugador debe ir ingresando las letras a averiguar de la palabra a través del cuadro de
texto a la derecha de la leyenda LETRA y hacer click en el botón “comprobar”. Si la
letra existe se colocará en el cuadro de texto correspondiente a su posición en la
palabra y se actualizarán los datos del cuadro de puntuaciones.
▪ La entrada de las letras debe hacerse en un formulario que valide dicha entrada.
Solamente se permitirán letras del alfabeto español, tanto mayúsculas como
minúsculas. No se permitirán letras con tildes. La palabra a adivinar aparecerá siempre
en mayúsculas y escritas tal y como están en la lista de palabras .Deberá indicarse de
la mejor manera posible al usuario cuando la entrada no sea válida y por lo tanto no
procesarla.
▪ Si se llega al número de fallos permitidos y no se ha averiguado la palabra, debe
mostrarse una ventana emergente con dicho acontecimiento. Si se averigua la
palabra, debe mostrarse una ventana emergente con dicho acontecimiento y la
puntuación obtenida en esa palabra.

Hazlo bien ;)!

Mejorado (Y enviado):

Actúa como un **desarrollador senior especializado en desarrollo web frontend y backend**, con amplia experiencia en **HTML5, CSS3, JavaScript, PHP, React, Vue, Svelte y Bootstrap**.

Tu objetivo es desarrollar un **juego web completo, funcional, moderno y visualmente atractivo para adivinar palabras**, siguiendo estrictamente los requisitos que se detallan a continuación.

## 1\. Tecnologías

El proyecto debe utilizar obligatoriamente un framework o librería moderna para la interfaz.

Utiliza preferentemente:

- **React** para la interfaz y la gestión del estado.
- **Bootstrap** para el diseño responsive y los componentes visuales.
- **JavaScript/ES6+** para la lógica del juego.
- **HTML5 y CSS3** para la estructura y personalización visual.

Si consideras que otra tecnología del listado (**Vue o Svelte**) es más adecuada, puedes utilizarla, pero debes escoger **una sola** tecnología principal para la interfaz.

No utilices React, Vue y Svelte simultáneamente.

El resultado debe ser un proyecto ejecutable y correctamente estructurado, evitando código innecesariamente complejo.

---

# 2\. Objetivo del juego

El juego consiste en **adivinar una palabra seleccionada aleatoriamente de un conjunto de palabras predefinidas**.

El programa debe disponer inicialmente de **al menos 500 palabras diferentes**.

Todas las palabras deben:

- Estar escritas en español.
- Tener entre **7 y 10 letras**, ambas inclusive.
- Estar almacenadas en el programa.
- Estar escritas en **MAYÚSCULAS**.
- No contener tildes.
- No contener espacios, guiones ni caracteres especiales.
- No repetirse.

Ejemplos válidos:

```
ORDENADOR
BICICLETA
MARIPOSA
VENTANAS
TELEFONO
```

Ejemplos no válidos:

```
ÁRBOL
CAMIÓN
SÉPTIMO
CASA
MEDIO-DIA
```

La lista debe contener como mínimo 500 palabras válidas.

---

# 3\. Inicio de una partida

La interfaz debe disponer de un botón:

**COMENZAR**

Cuando el usuario pulse este botón:

1. Se seleccionará aleatoriamente una palabra del conjunto de palabras disponibles.
2. La palabra seleccionada deberá eliminarse inmediatamente del conjunto disponible para evitar que vuelva a aparecer durante la misma sesión.
3. Se actualizará el contador de palabras restantes.
4. Se inicializará una nueva partida.
5. Se eliminarán todos los datos de la partida anterior.
6. Se pondrán a cero los fallos.
7. Se pondrá a cero la puntuación.
8. Se limpiarán las letras descubiertas de la palabra anterior.
9. Se limpiará el campo de entrada de letras.
10. Se habilitará el juego.

El usuario podrá comenzar tantas partidas como palabras disponibles existan.

Cuando el conjunto de palabras disponibles llegue a **0**, el botón "COMENZAR" deberá quedar deshabilitado y deberá informarse claramente al usuario de que **no quedan más palabras disponibles**.

---

# 4\. Representación de la palabra

Una vez seleccionada la palabra, deberá mostrarse al usuario mediante una serie de casillas, una por cada letra.

Por ejemplo, si la palabra seleccionada es:

```
ORDENADOR
```

Inicialmente se mostrará:

```
_ _ _ _ _ _ _ _ _
```

Cuando el usuario acierte una letra, esta deberá aparecer automáticamente en todas las posiciones en las que exista.

Por ejemplo, si introduce:

```
O
```

se mostrará:

```
O _ _ _ _ O _ _
```

Las letras ya descubiertas deben permanecer visibles durante el resto de la partida.

---

# 5\. Entrada de letras

El jugador deberá introducir las letras mediante un formulario compuesto por:

- Una etiqueta **LETRA**.
- Un campo de entrada.
- Un botón **COMPROBAR**.

El campo de entrada debe aceptar **una única letra**.

La validación debe permitir únicamente letras del alfabeto español sin tildes:

```
A-Z
a-z
Ñ
ñ
```

No deben permitirse:

- Números.
- Espacios.
- Tildes.
- Símbolos.
- Caracteres especiales.
- Más de una letra.

Ejemplos válidos:

```
a
M
ñ
Z
```

Ejemplos inválidos:

```
12
ab
á
é
@
A1
hola
```

La validación debe realizarse tanto visualmente como mediante la lógica de JavaScript.

Si la entrada no es válida:

- No debe procesarse.
- No debe contabilizarse como fallo.
- Debe mostrarse un mensaje claro al usuario indicando el motivo.
- El campo debe quedar preparado para introducir una nueva letra.

La comparación debe ser **insensible a mayúsculas/minúsculas**, pero la palabra mostrada siempre debe utilizar mayúsculas.

Por ejemplo:

```
a
```

y

```
A
```

deben considerarse la misma letra.

---

# 6\. Control de letras repetidas

El juego debe controlar las letras que ya han sido introducidas.

Si el usuario introduce una letra que ya había utilizado anteriormente:

- No debe volver a contabilizarse como fallo.
- No debe volver a sumar puntos.
- No debe modificar la puntuación.
- Debe mostrarse un aviso indicando que esa letra ya había sido utilizada.

Se debe mantener visualmente un listado de las letras utilizadas, diferenciando claramente entre:

- Letras acertadas.
- Letras falladas.

---

# 7\. Sistema de fallos

El jugador dispone de un máximo de:

**7 FALLOS**

Cada vez que el jugador introduzca una letra válida que **no exista en la palabra**, se incrementará el contador de fallos.

Debe mostrarse claramente:

```
Fallos: 0 / 7
```

y actualizarse después de cada intento.

Ejemplo:

```
Fallos: 3 / 7
```

Cuando el jugador alcance los **7 fallos**, la partida terminará inmediatamente.

No se permitirán más intentos en esa partida.

---

# 8\. Sistema de puntuación

La puntuación se calculará utilizando exactamente la siguiente fórmula:

```
Puntuación = Nº de letras acertadas × (Máximo de fallos permitidos - Nº de fallos cometidos)
```

Donde:

```
Máximo de fallos permitidos = 7
```

Por ejemplo:

- Letras acertadas: 4
- Fallos cometidos: 2

Entonces:

```
Puntuación = 4 × (7 - 2)
Puntuación = 20
```

La puntuación debe actualizarse después de cada intento válido.

**Importante:** una letra que aparece varias veces en la palabra debe contar como una sola letra acertada a efectos del cálculo de puntuación, aunque se revelen todas sus posiciones.

Por ejemplo, si la palabra contiene tres "A" y el usuario descubre la A:

```
Letras acertadas = 1
```

no:

```
Letras acertadas = 3
```

La interfaz debe mostrar claramente la puntuación actual.

---

# 9\. Finalización por acierto

La partida finalizará cuando el jugador haya descubierto **todas las letras de la palabra**.

En ese momento:

1. Se deberá bloquear el formulario de introducción de letras.
2. No se permitirán más intentos.
3. Se calculará la puntuación final.
4. Se mostrará una ventana emergente o modal informando de que el jugador ha ganado.
5. El mensaje deberá mostrar:
   - La palabra descubierta.
   - La puntuación obtenida.
   - El número de fallos realizados.
6. El usuario deberá poder iniciar una nueva partida mediante el botón **COMENZAR**.

Ejemplo:

```
¡ENHORABUENA!

Has descubierto la palabra: ORDENADOR

Fallos: 2
Puntuación: 35
```

---

# 10\. Finalización por exceso de fallos

Si el jugador alcanza los **7 fallos** sin descubrir la palabra:

1. La partida finalizará inmediatamente.
2. Se bloqueará el formulario.
3. No se permitirán más intentos.
4. Se mostrará una ventana emergente o modal.
5. Se deberá mostrar:
   - Un mensaje indicando que la partida ha terminado.
   - La palabra correcta.
   - La puntuación obtenida hasta ese momento.
   - El número de fallos realizados.

Ejemplo:

```
GAME OVER

Has alcanzado los 7 fallos.

La palabra era: ORDENADOR

Puntuación obtenida: 0
```

---

# 11\. Palabras disponibles

El programa debe mantener dos conceptos claramente diferenciados:

### Palabras disponibles

Son las palabras que todavía no han sido utilizadas durante la sesión.

### Palabra actual

Es la palabra que se está intentando adivinar en la partida actual.

Cuando se inicia una partida:

```
Palabra aleatoria → se elimina de palabras disponibles → pasa a ser palabra actual
```

Esto garantiza que una palabra no pueda repetirse durante la misma sesión.

La interfaz deberá mostrar permanentemente:

```
Palabras restantes: XXX
```

Por ejemplo:

```
Palabras restantes: 487
```

---

# 12\. Estado del juego

La aplicación debe gestionar correctamente los diferentes estados:

```
SIN INICIAR
      ↓
PARTIDA EN CURSO
      ↓
   ┌───────────────┐
   ↓               ↓
GANADA          PERDIDA
   ↓               ↓
   └───────┬───────┘
           ↓
    NUEVA PARTIDA
```

El código debe evitar estados inconsistentes.

Por ejemplo:

- No se puede introducir una letra antes de comenzar una partida.
- No se pueden introducir letras después de ganar.
- No se pueden introducir letras después de perder.
- No se puede comenzar una partida si no quedan palabras.
- No se debe poder procesar dos veces el mismo intento.
- Una letra repetida no debe generar un fallo.
- Una entrada inválida no debe modificar el estado del juego.

---

# 13\. Diseño de la interfaz

La interfaz debe ser **moderna, limpia, intuitiva y responsive**.

Debe funcionar correctamente en:

- Ordenadores.
- Tablets.
- Teléfonos móviles.

La pantalla debe incluir como mínimo:

### Cabecera

Título del juego.

### Panel de información

Mostrar:

```
Palabras restantes: XXX
Fallos: X / 7
Puntuación: XXX
```

### Zona de palabra

Mostrar las casillas correspondientes a las letras de la palabra.

### Zona de introducción

```
LETRA: [ ___ ] [ COMPROBAR ]
```

### Letras utilizadas

Mostrar las letras que ya han sido introducidas, separándolas visualmente entre:

- Aciertos.
- Fallos.

### Botón

```
COMENZAR
```

### Mensajes

Utilizar alertas, mensajes visuales, Toasts o componentes equivalentes de Bootstrap para informar de:

- Entrada incorrecta.
- Letra repetida.
- Letra acertada.
- Letra incorrecta.
- Victoria.
- Derrota.
- Fin de palabras disponibles.

Para ganar claridad y una mejor experiencia de usuario, utiliza preferentemente **modales de Bootstrap** para los mensajes de victoria y derrota.

---

# 14\. Experiencia de usuario

El juego debe proporcionar feedback visual inmediato.

Por ejemplo:

- Las letras acertadas pueden mostrarse en color verde.
- Las letras falladas pueden mostrarse en color rojo.
- Las casillas de la palabra pueden incorporar una pequeña animación al descubrir una letra.
- El contador de fallos puede cambiar visualmente cuando el jugador se acerca al límite.
- Los botones deben tener estados `hover`, `focus` y `disabled`.
- Los elementos interactivos deben ser accesibles mediante teclado.

No utilices animaciones excesivas que dificulten la utilización del juego.

---

# 15\. Arquitectura del código

Organiza el proyecto de forma profesional.

Si utilizas React, separa correctamente responsabilidades, por ejemplo:

```
src/
├── components/
│   ├── GameHeader
│   ├── WordDisplay
│   ├── LetterForm
│   ├── ScoreBoard
│   ├── UsedLetters
│   └── GameModal
│
├── data/
│   └── words.js
│
├── hooks/
│   └── useGame.js
│
├── App.jsx
├── main.jsx
└── styles/
    └── styles.css
```

No es obligatorio utilizar exactamente esta estructura, pero el código debe estar correctamente modularizado y ser fácil de mantener.

Evita colocar toda la lógica en un único componente.

---

# 16\. Requisitos técnicos adicionales

El código debe:

- Ser limpio y legible.
- Utilizar nombres de variables descriptivos.
- Evitar código duplicado.
- Utilizar componentes reutilizables.
- Utilizar `const` y `let` correctamente.
- Evitar variables globales innecesarias.
- Gestionar correctamente el estado.
- Validar todas las entradas del usuario.
- No producir errores en la consola.
- Ser compatible con navegadores modernos.
- Utilizar buenas prácticas de accesibilidad.
- Ser responsive.

No añadas funcionalidades que no hayan sido solicitadas salvo que aporten una mejora clara a la experiencia de usuario.

---

# 17\. Persistencia

La aplicación debe mantener las palabras utilizadas mientras dure la sesión actual.

Si resulta apropiado para la implementación, puedes utilizar `localStorage` para conservar:

- Palabras restantes.
- Estado de la partida.
- Puntuación.

Sin embargo, no es obligatorio utilizar backend ni base de datos.

El juego debe funcionar completamente en el navegador.

---

# 18\. Validación de las palabras

Antes de utilizar la lista de palabras, asegúrate de que todas cumplen las reglas:

- Entre 7 y 10 caracteres.
- Únicamente letras.
- Sin tildes.
- Sin espacios.
- Sin caracteres especiales.
- En mayúsculas.
- Sin duplicados.

Si alguna palabra no cumple estos requisitos, debe corregirse o sustituirse.

**Es obligatorio proporcionar al menos 500 palabras válidas. No utilices placeholders como****`PALABRA1`****,****`PALABRA2`****, etc.**

---

# 19\. Entrega

Quiero que generes el proyecto completo y funcional.

Debes proporcionar:

1. La estructura completa de carpetas.
2. Todos los archivos necesarios.
3. El código completo de cada archivo.
4. La lista de al menos 500 palabras.
5. Las instrucciones necesarias para instalar las dependencias.
6. Las instrucciones para ejecutar el proyecto.
7. Una breve explicación de cómo funciona la arquitectura.
8. Una explicación de cómo se gestiona el estado del juego.
9. Una comprobación final de que todos los requisitos se cumplen.

No entregues pseudocódigo.

No omitas archivos importantes.

No utilices comentarios del tipo:

```
// aquí irían las 500 palabras
```

Debes proporcionar realmente las **500 palabras o más**.

El resultado debe poder copiarse, instalarse y ejecutarse directamente.

---

# 20\. Control de calidad antes de entregar

Antes de mostrar el resultado final, realiza una revisión lógica del proyecto y comprueba especialmente:

- [ ]Existen al menos 500 palabras válidas.
- [ ]Todas tienen entre 7 y 10 letras.
- [ ]No contienen tildes.
- [ ]No existen palabras duplicadas.
- [ ]Las palabras están en mayúsculas.
- [ ]Las palabras utilizadas se eliminan del conjunto disponible.
- [ ]El contador de palabras restantes funciona.
- [ ]Se pueden realizar como máximo 7 fallos.
- [ ]Las letras repetidas no cuentan como nuevos fallos.
- [ ]Las entradas inválidas no modifican la puntuación ni los fallos.
- [ ]La puntuación utiliza exactamente la fórmula especificada.
- [ ]La puntuación se actualiza correctamente.
- [ ]Todas las apariciones de una letra se muestran correctamente.
- [ ]La partida termina al descubrir toda la palabra.
- [ ]La partida termina al alcanzar 7 fallos.
- [ ]Se muestra la palabra correcta al perder.
- [ ]Se muestra la puntuación al ganar y al perder.
- [ ]No se puede introducir una letra cuando la partida ha terminado.
- [ ]No se puede iniciar una nueva partida cuando no quedan palabras.
- [ ]La interfaz es responsive.
- [ ]No existen errores en la consola.
- [ ]El código está correctamente organizado y es mantenible.

**Prioriza siempre la funcionalidad, la robustez, la claridad del código y una buena experiencia de usuario.**

Hazlo bien ;)

El primer prompt nos ha dado el resultado completo, pero tiene varias deficiencias, malas practicas, errores de diseño que necesitan ser corregidas.

---

### 2. Segundo Prompt Completo

# Segundo prompt:

Prompt:

Hay cosas que estás haciendo bien y otras que la estas cagando.

La cosa es que en este caso:

No puedes hardcodear las palabras en el código deberías de tener un json con todas las palabras es imposible, que las coloques directamente en el código.

También estoy viendo que me estas mezclando funciones dentro de otras funciones. Cuando deberían de estar aparte porfavor, deberías de respetar, el orden y la serenidad del código.

La cosa es que en este caso la página del juego incumple todas las directrices de diseño de cualquier aplicación web realmente tiene muchos elementos en pantalla, ni tiene un estilo visual claro.

Obviamente deberías de intentar aplicar el Game Juice en este juego de navegador.

Es importante que separes la lógica de la vista...

Hazlo bien ;)!

Mejorado (Y enviado).

Actúa como un **developer senior especializado en HTML, CSS, JavaScript, React, Vue, Svelte y Bootstrap**, con especial atención a **arquitectura limpia, separación de responsabilidades, UI/UX y desarrollo de aplicaciones web modernas**.

Quiero que desarrolles el juego descrito a continuación. **No te limites a hacer que funcione: el código debe estar bien estructurado, ser mantenible y la interfaz debe tener un diseño profesional.**

## Reglas importantes de desarrollo

### 1\. Las palabras NO deben estar hardcodeadas en el código

El juego debe disponer de al menos **500 palabras**, pero **NO quiero que las palabras estén escritas directamente dentro de archivos JavaScript, componentes o funciones**.

Debes crear un archivo JSON independiente, por ejemplo:

```
/data/words.json
```

Este archivo debe contener todas las palabras del juego.

Por ejemplo:

```
[
  "ORDENADOR",
  "BICICLETA",
  "MARIPOSA"
]
```

El código deberá cargar las palabras desde ese JSON.

**No hagas esto:**

```
const words = [
    "ORDENADOR",
    "BICICLETA",
    "MARIPOSA"
];
```

Las palabras deben estar completamente separadas de la lógica de la aplicación.

El JSON debe contener **al menos 500 palabras reales**, todas de entre **7 y 10 letras**, en mayúsculas, sin tildes, sin espacios, sin caracteres especiales y sin duplicados.

---

### 2\. Separa completamente la lógica de la vista

Es especialmente importante que exista una separación clara entre:

- Datos.
- Lógica del juego.
- Funciones auxiliares.
- Estado.
- Componentes visuales.
- Estilos.

Los componentes de React deben encargarse principalmente de **mostrar la información y gestionar la interacción del usuario**.

La lógica del juego debe estar separada.

Por ejemplo, funciones como:

```
validarLetra()
calcularPuntuacion()
seleccionarPalabra()
comprobarLetra()
comprobarVictoria()
comprobarDerrota()
```

deben estar definidas como funciones independientes y en los archivos correspondientes.

**No mezcles funciones dentro de otras funciones innecesariamente.**

No quiero estructuras de este tipo:

```
function iniciarJuego() {

    function seleccionarPalabra() {
        ...
    }

    function calcularPuntuacion() {
        ...
    }

    function validarLetra() {
        ...
    }

}
```

Las funciones que representan responsabilidades independientes deben estar separadas.

Quiero que el código tenga **orden, serenidad y claridad**.

Cada función debe hacer una cosa concreta.

---

### 3\. Arquitectura limpia

Organiza el proyecto de forma que sea sencillo localizar cada responsabilidad.

Por ejemplo, puedes utilizar una estructura similar a:

```
src/
├── components/
├── hooks/
├── services/
├── utils/
├── data/
│   └── words.json
├── styles/
├── App.jsx
└── main.jsx
```

No es obligatorio utilizar exactamente estos nombres, pero sí debes mantener una separación clara.

Por ejemplo:

- `words.json` → datos.
- `services` → operaciones relacionadas con los datos.
- `utils` → funciones puras y reutilizables.
- `hooks` → gestión del estado y coordinación de la lógica.
- `components` → presentación e interacción.
- `styles` → estilos.

**No quiero un único componente enorme con toda la aplicación dentro.**

---

# Juego de adivinar palabras

El juego consistirá en adivinar una palabra seleccionada aleatoriamente entre las palabras disponibles.

El programa debe tener al menos **500 palabras almacenadas en el archivo JSON**.

Todas las palabras deben tener entre **7 y 10 letras**.

## Reglas

Disponemos como máximo de **7 fallos** para adivinar la palabra.

Si cometemos el número máximo de fallos, finalizará el juego quedando con la puntuación que tuviésemos en aquel momento.

La puntuación por cada letra acertada estará en función del número de fallos cometidos hasta ese momento.

La fórmula será:

```
Puntuación =
Número de letras acertadas ×
(Máximo de fallos permitidos - Número de fallos cometidos)
```

El máximo de fallos permitidos es:

```
7
```

Una letra que aparezca varias veces en la palabra debe considerarse **una única letra acertada** para el cálculo de la puntuación, aunque se revelen todas sus posiciones.

---

# Inicio de una partida

Al hacer click sobre el botón **"COMENZAR"**:

1. El programa seleccionará aleatoriamente una palabra del conjunto de palabras disponibles.
2. La palabra seleccionada se eliminará del conjunto de palabras disponibles.
3. Se actualizará el número de palabras restantes.
4. Se inicializará una nueva partida.
5. Se limpiarán las letras de la partida anterior.
6. Se pondrán a cero los fallos.
7. Se pondrá a cero la puntuación.
8. Se limpiarán las letras utilizadas.
9. Se habilitará el formulario de introducción de letras.

Si anteriormente se ha jugado, todos los datos de la partida anterior deberán reiniciarse correctamente.

Debe existir un control visible del número de palabras restantes.

Por ejemplo:

```
Palabras restantes: 487
```

Cuando no queden más palabras disponibles, no se podrá comenzar otra partida y deberá informarse claramente al usuario.

---

# Palabra

La palabra seleccionada deberá representarse mediante casillas o espacios correspondientes a cada letra.

Por ejemplo:

```
_ _ _ _ _ _ _ _ _
```

Si el usuario descubre una letra, deberá mostrarse en todas las posiciones correspondientes.

La palabra siempre se mostrará en **MAYÚSCULAS**, exactamente tal y como aparece en el JSON.

---

# Introducción de letras

El jugador deberá introducir las letras mediante un formulario compuesto por:

- La etiqueta **LETRA**.
- Un campo de texto.
- El botón **COMPROBAR**.

La entrada debe validarse.

Solamente se permitirán letras del alfabeto español:

```
A-Z
Ñ
```

tanto en mayúsculas como en minúsculas.

No se permitirán letras con tildes.

Tampoco:

- Números.
- Espacios.
- Símbolos.
- Caracteres especiales.
- Más de una letra.

Ejemplos válidos:

```
a
M
ñ
Z
```

Ejemplos inválidos:

```
á
é
123
AB
@
hola
```

La comparación debe ser independiente de mayúsculas y minúsculas.

Por ejemplo:

```
a
```

debe tratarse igual que:

```
A
```

Cuando la entrada no sea válida:

- No deberá procesarse.
- No deberá contar como fallo.
- No deberá modificar la puntuación.
- Deberá mostrarse un mensaje claro al usuario.
- El usuario deberá poder corregir la entrada inmediatamente.

La validación debe estar separada de la vista.

---

# Letras repetidas

El juego debe llevar un registro de las letras que el usuario ya ha introducido.

Si introduce una letra que ya había utilizado:

- No debe volver a procesarse.
- No debe sumar un fallo.
- No debe sumar puntos.
- No debe modificar la palabra.
- Debe informarse al usuario de que esa letra ya ha sido utilizada.

Debe existir una representación visual de las letras utilizadas, diferenciando claramente entre:

- Letras acertadas.
- Letras falladas.

---

# Fallos

Cada vez que el jugador introduzca una letra válida que no exista en la palabra, se incrementará el número de fallos.

Debe mostrarse claramente:

```
Fallos: 0 / 7
```

y actualizarse después de cada intento.

Cuando llegue a:

```
7 / 7
```

la partida terminará.

No se permitirán más intentos después de finalizar la partida.

---

# Victoria

Si el jugador descubre todas las letras de la palabra:

- La partida finalizará.
- El formulario quedará deshabilitado.
- No se permitirán más intentos.
- Se calculará la puntuación final.
- Se mostrará un mensaje de victoria.
- Se mostrará la palabra.
- Se mostrará la puntuación obtenida.
- Se mostrará el número de fallos.

Debe existir una ventana/modal o elemento visual equivalente que comunique claramente el resultado.

---

# Derrota

Si el jugador alcanza los 7 fallos sin descubrir la palabra:

- La partida finalizará.
- El formulario quedará deshabilitado.
- No se permitirán más intentos.
- Se mostrará la palabra correcta.
- Se mostrará la puntuación obtenida hasta ese momento.
- Se mostrará el número de fallos.

También debe utilizarse un elemento visual claro para comunicar el final de la partida.

---

# DISEÑO DE LA APLICACIÓN

Este punto es **MUY IMPORTANTE**.

La interfaz debe ser completamente rediseñada con criterios profesionales de **UI/UX**.

No quiero una página llena de elementos, cajas, tarjetas, contadores y botones compitiendo entre sí.

La interfaz debe tener:

- Una jerarquía visual clara.
- Un estilo visual coherente.
- Pocos elementos, pero bien organizados.
- Espacio en blanco suficiente.
- Una tipografía adecuada.
- Una paleta de colores coherente.
- Un elemento principal claramente identificable.
- Una experiencia de usuario intuitiva.
- Diseño responsive.

El elemento visual más importante de la pantalla debe ser **la palabra que el usuario está intentando descubrir**.

Los datos secundarios, como puntuación, fallos y palabras restantes, deben tener una presencia visual menor.

No quiero que todos los elementos tengan el mismo peso visual.

---

# Game Juice

Aplica conceptos de **Game Juice** para conseguir que el juego se sienta más satisfactorio al jugar.

El objetivo es que las acciones del jugador tengan **feedback inmediato y agradable**, sin convertir la aplicación en algo exagerado o infantil.

Por ejemplo:

### Cuando se acierta una letra

Debe existir algún tipo de feedback visual:

- Pequeña animación de la letra.
- Transición de la casilla.
- Cambio de color.
- Microanimación.
- Feedback visual positivo.

### Cuando se falla

Debe existir un feedback diferente:

- Pequeña animación.
- Cambio visual del contador.
- Feedback de error.
- Animación sutil.

### Al completar la palabra

La victoria debe sentirse especial.

Puedes utilizar:

- Animación de las letras.
- Transición visual.
- Celebración sutil.
- Modal de victoria.
- Microinteracciones.

### Al perder

Debe existir un feedback claro de derrota, pero sin resultar frustrante o excesivamente agresivo.

### Botones

Los botones deben tener estados claros:

- Normal.
- Hover.
- Focus.
- Active.
- Disabled.

Las interacciones deben sentirse fluidas.

**Importante:** Game Juice no significa llenar la pantalla de animaciones.

Utiliza animaciones y efectos únicamente cuando aporten feedback o mejoren la experiencia.

El resultado debe ser elegante y profesional.

---

# Jerarquía visual

La pantalla debe diseñarse pensando en qué necesita ver el jugador en cada momento.

La prioridad visual debería ser aproximadamente:

1. Palabra.
2. Campo para introducir letra.
3. Feedback de la acción.
4. Fallos y puntuación.
5. Letras utilizadas.
6. Palabras restantes.
7. Acciones secundarias.

No conviertas cada uno de estos elementos en una tarjeta gigante.

Utiliza composición, espacio, tipografía y contraste para crear la jerarquía.

---

# Responsive

La aplicación debe funcionar correctamente en:

- Desktop.
- Tablet.
- Móvil.

En pantallas pequeñas:

- Los elementos deben reorganizarse.
- No debe existir scroll horizontal.
- Los botones deben seguir siendo cómodos de pulsar.
- Las letras deben seguir siendo claramente visibles.
- El formulario debe resultar cómodo de utilizar.

---

# Accesibilidad

Respeta buenas prácticas de accesibilidad:

- Labels correctamente asociados.
- Navegación mediante teclado.
- Focus visible.
- Contraste suficiente.
- Botones correctamente etiquetados.
- Estados disabled claros.
- Mensajes de error comprensibles.
- No depender exclusivamente del color para transmitir información.

---

# Código

Quiero un código **ordenado, limpio y tranquilo de leer**.

Evita especialmente:

- Componentes gigantes.
- Funciones gigantes.
- Funciones anidadas innecesariamente.
- Lógica dentro del JSX.
- Datos hardcodeados.
- Código duplicado.
- Variables globales innecesarias.
- Funciones que hacen demasiadas cosas.
- Mezclar estilos, datos y lógica sin necesidad.

Si una función puede existir independientemente, debe existir independientemente.

Por ejemplo:

```
validateLetter()
```

debe ser una función independiente.

```
calculateScore()
```

debe ser una función independiente.

```
selectRandomWord()
```

debe ser una función independiente.

```
checkWin()
```

debe ser una función independiente.

No quiero que todas estas funciones estén metidas dentro de `App`, `Game` o dentro de otra función.

---

# Resultado final

Quiero que el resultado parezca una **aplicación web real**, no un ejercicio de programación.

Debe existir una diferencia clara entre:

```
DATOS
↓
LÓGICA
↓
ESTADO
↓
VISTA
↓
ESTILOS
```

La interfaz debe ser minimalista, moderna y coherente.

El juego debe tener suficiente **Game Juice** para resultar divertido y satisfactorio, pero sin abusar de las animaciones.

Y, sobre todo:

**No sacrifiques la arquitectura ni el diseño por conseguir que el juego funcione rápidamente.**

Antes de entregar el código, revisa que:

- Las palabras estén exclusivamente en `words.json`.
- Existan al menos 500 palabras válidas.
- La lógica esté separada de la vista.
- Las funciones independientes no estén anidadas.
- Los componentes no sean monolíticos.
- La interfaz no esté saturada.
- Exista una jerarquía visual clara.
- El diseño sea responsive.
- Exista feedback visual para las acciones del jugador.
- El Game Juice sea sutil y esté justificado.
- Se cumplan todas las reglas originales del juego.

**Hazlo bien ;)**

El segundo prompt nos ha dado una buena solución a uno de los problemas que le estabamos pidiendo, pero aun así existen aun otros errores que conviene arreglar aparte del estilo visual.

---

### 3. Tercer Prompt Completo

Tercer prompt:

La cosa es que en este caso:

No puedes hardcodear los mensajes ni de victoria, ni de error ni de nada. Deberías de tenerlos también un fichero .json, por supuesto.

También la cosa es que deberías tanto de crear un LanguageLoader (que por ahora utilizaremos Español) y claro. Cada idioma tendrá asignado su propio diccionado.

El usuario podrá seleccionar en todo momento que idioma tiene seleccionado. Por un desplegable con las banderas de los países.

No me gusta que en la página web, aparezca como tal "Reiniciar diccionario" el usuario no debe de saber que hay ni diccionarios ni nada.

Además, no tienes un pie de página ni nada. Realmente podrías continuar mejorando el estilo visual bastante más.

Cuando la partida esta iniciada no es raro que se continue viendo "NUEVA PARTIDA" no deberías de poner REINICIAR PARTIDA o algo así? Realmente piénsalo bien.

En este caso deberías de crear separadores en los componentes los tienes todos bajo la misma carpeta sin separación por carpetas ni nada.

Hazlo bien ;)!

Mejorado (Y enviado).

Actúa como un **Lead Frontend Architect y Diseñador UI/UX Senior** especializado en **React, Bootstrap 5 y
  JavaScript moderno (ES6+)**, con un estándar riguroso en **Clean Architecture, Internacionalización (i18n),
  Microinteracciones (Game Juice) y Component-Driven Development**.

    Tu objetivo es evolucionar el juego de adivinar palabras hacia una **aplicación web de nivel de producción**. No
  quiero prototipos ni código improvisado: el proyecto debe ser escalable, accesible, con una jerarquía visual pulida
  y cero acoplamiento entre capas.

    ---

    ## 1. Arquitectura Modular de Componentes (Separación por Dominio)

    Queda estrictamente prohibido colocar todos los componentes planos en una sola carpeta `components/`. Debes
  estructurarlos en subdirectorios según su responsabilidad:

    ```text
    src/
    ├── assets/                  # Iconos SVG, banderas, recursos visuales
    ├── components/
    │   ├── layout/              # Estructura general de la app
    │   │   ├── Header.jsx       # Título, selector de idioma y accesos rápidos
    │   │   └── Footer.jsx       # Pie de página semántico, créditos y versión
    │   ├── game/                # Componentes nucleares de la lógica visual del juego
    │   │   ├── WordDisplay.jsx  # Casillas animadas de las letras
    │   │   ├── LetterInput.jsx  # Formulario LETRA + COMPROBAR
    │   │   ├── ScoreBoard.jsx   # Puntuación, fallos restantes y palabras restantes
    │   │   ├── UsedLetters.jsx  # Historial de letras acertadas y falladas
    │   │   └── GameControls.jsx # Botón dinámico de acción principal y reset
    │   └── ui/                  # Componentes atómicos o de diseño reutilizables
    │       ├── Modal.jsx        # Diálogos de victoria, derrota y confirmación
    │       ├── Toast.jsx        # Feedback instantáneo de validación
    │       └── LanguageSelector.jsx # Dropdown de selección de idioma con banderas
    ├── locales/                 # Textos y microcopy traducibles (JSON)
    │   ├── es.json
    │   └── en.json              # Preparado para escalabilidad futura
    ├── data/                    # Palabras separadas por idioma (JSON)
    │   ├── words-es.json        # Al menos 500 palabras en español
    │   └── words-en.json        # Estructura lista para otros idiomas
    ├── services/                # Servicios desacoplados
    │   ├── languageLoader.js    # Carga de recursos y vinculación idioma ↔ diccionario
    │   └── wordService.js       # Selección y gestión del pool de palabras
    ├── hooks/
    │   ├── useGame.js           # Máquina de estados y reglas del juego
    │   └── useLanguage.js       # Hook / contexto de traducción y locale activo
    ├── utils/                   # Funciones puras e independientes
    │   ├── scoreCalculator.js
    │   ├── letterValidator.js
    │   └── wordSanitizer.js
    ├── styles/                  # Variables CSS, animaciones y Game Juice
    │   ├── variables.css
    │   ├── game-juice.css
    │   └── main.css
    ├── App.jsx
    └── main.jsx
  ──────
  ## 2. Internacionalización (i18n) y Cero Textos Hardcodeados

  Prohibido tener cadenas de texto literales en JSX, componentes, hooks o funciones.

  1. Archivos de localización (/locales/*.json):
      • Todos los textos de la interfaz, botones, títulos, labels, alertas, mensajes de error, modales de victoria,
      derrota y ayuda deben residir exclusivamente en archivos JSON independientes (ej. locales/es.json).
      • Los textos con valores dinámicos deben aceptar variables interpolables (ej. "scoreText": "Puntuación
      obtenida: {{score}}").
  2. Servicio LanguageLoader:
      • Crea un servicio/loader desacoplado que asocie cada idioma con:
          1. Su paquete de textos (locales/[lang].json).
          2. Su diccionario de palabras correspondiente (data/words-[lang].json).
      • El sistema debe iniciar en Español (es), pero su arquitectura debe permitir añadir nuevos idiomas sin tocar
      una sola línea de lógica del juego.
  3. Selector de Idioma con Banderas:
      • Integra en el Header un dropdown estilizado y accesible que muestre la bandera del país, el nombre del idioma
      y un indicador visual del idioma activo.
      • Si el usuario cambia de idioma en mitad de una partida, debe mostrarse un aviso de confirmación claro antes
      de resetear la partida con el nuevo conjunto de palabras y textos.

  ──────
  ## 3. Microcopy y Terminología Natural (Enfoque UI/UX)

  El usuario nunca debe ser expuesto a conceptos técnicos internos.

  • ❌ Prohibido utilizar términos como: "Diccionario", "Reiniciar diccionario", "Cargar JSON", "Array de palabras",
  "Resetear estado".
  • ✔️ Utiliza términos inmersivos y naturales:
      • "Palabras restantes" o "Palabras en juego".
      • "Empezar de nuevo", "Reiniciar partida", "Siguiente reto".
      • "Has descubierto todas las palabras de esta sesión".

  ──────
  ## 4. Estado Dinámico del Botón de Acción Principal (CTA)

  Es incoherente mostrar "NUEVA PARTIDA" cuando ya hay una partida en curso. El botón de acción principal debe
  reflejar exactamente el estado del ciclo de vida del juego:

  1. Antes de empezar (Estado inicial):
      • Texto: "COMENZAR" (estilo primario, destacado).
  2. Durante la partida activa:
      • Texto: "REINICIAR PARTIDA" (estilo sutil/outline). Si se pulsa, solicita una confirmación rápida o ejecuta un
      reinicio seguro para evitar pulsaciones accidentales.
  3. Al finalizar la partida (Victoria o Derrota):
      • Texto: "SIGUIENTE PALABRA" o "JUGAR OTRA VEZ" (color de llamada a la acción destacado y con foco accesible).
  4. Al agotarse las palabras disponibles (0 restantes):
      • Estado: Deshabilitado, con texto clarificador como "SESIÓN COMPLETADA".

  ──────
  ## 5. Diseño Visual, Footer y Jerarquía de Pantalla

  La aplicación debe sentirse como un producto web moderno, elegante y equilibrado:

  1. Header:
      • Logotipo/título minimalista y elegante.
      • Selector de idioma con banderas en la esquina superior derecha.
  2. Tablero Central:
      • El elemento con mayor peso visual y jerarquía absoluta debe ser la palabra oculta (WordDisplay).
      • Los contadores de fallos, puntuación y palabras restantes deben ser compactos, limpios y presentados como
      badges o tarjetas sutiles.
  3. Footer Semántico:
      • Debe incluir un pie de página (Footer.jsx) con información semántica: créditos del desarrollador, versión de
      la app, estado del sistema y un enlace o botón para consultar las reglas/instrucciones del juego.
  4. Game Juice Refinado:
      • Microanimaciones en la entrada de letras (pop al acertar, shake sutil al fallar o al ingresar una letra
      inválida/repetida).
      • Transiciones suaves en las casillas y badges de estado.
      • Sin saturar la pantalla: animaciones breves (150ms - 300ms) que comuniquen feedback sin entorpecer el ritmo
      del juego.

  ──────
  ## 6. Reglas Nucleares y Lógica del Juego (Inalterables)

  El motor del juego debe seguir cumpliendo estrictamente con los requisitos funcionales:

  • Archivo de datos (data/words-es.json):
      • Al menos 500 palabras reales en español.
      • Longitud estricta: entre 7 y 10 letras.
      • En MAYÚSCULAS, sin tildes, sin espacios, sin guiones ni duplicados.
  • Ciclo de partida:
      • Al comenzar, extraer aleatoriamente una palabra del pool disponible y removerla inmediatamente para no
      repetirla en la sesión.
  • Validación de entrada:
      • Solo permitir letras del alfabeto español (A-Z, Ñ), insensible a mayúsculas/minúsculas.
      • Rechazar sin penalizar números, tildes, caracteres especiales o entradas vacías.
  • Letras repetidas:
      • No penalizar ni sumar puntos si una letra ya fue introducida.
  • Sistema de fallos:
      • Máximo 7 fallos permitidos.
  • Fórmula de puntuación:

    Puntuación = Nº de letras únicas acertadas × (7 - Nº de fallos cometidos)

  • Cierre de partida:
      • Victoria al descubrir todas las letras.
      • Derrota al alcanzar 7 fallos, mostrando la palabra revelada.
      • Bloqueo inmediato del formulario de entrada al terminar la partida.

  ──────
  ## 7. Requisitos de Entrega

  Proporciona la solución completa lista para funcionar:

  1. Estructura de archivos y directorios respetando los subdirectorios indicados.
  2. Código íntegro de cada archivo (sin placeholders, sin funciones vacías ni comentarios de omisión).
  3. El archivo data/words-es.json con las 500+ palabras completas.
  4. El archivo locales/es.json con todos los textos estructurados.
  5. Instrucciones claras de instalación de dependencias y ejecución (npm run dev).
  6. Comprobación de calidad final verificando que no existan textos en duro en el JSX, que los componentes estén en
  sus carpetas respectivas, que el footer esté presente y que el botón cambie según el estado de la partida.

  En este caso el prompt ha mejorado bastante el proyecto, añadiendo separación de componentes, independencia de idiomas, evitar texto hardcodeado, pero todavía le falta un poco.

---

### 4. Cuarto Prompt Completo

Cuarto prompt:

La cosa es que en este caso:

1. Que es eso de "Desarrollado con arquitectura limpia y React" debes de poner © 2026 Adivina la palabra.

2. También en este caso no me gusta para nada que donde dice el idioma no aparezca realmente el icono de la flag es decir yo quiero que se vea tal cual la bandera su iconito que es con eso de 🇪🇸. Pero claro que se vea la bandera no las letras.

3. Hay cosas que están feas como "Pulsa COMENZAR para descubrir la palabra oculta" y debajo justo "Pulsa COMENZAR para activar la entrada de letras." no me gusta además no crees que sería mejor ocultar lo de las letras y cuando el usuario haga clic en comenzar que empiece?

4. Es innecesario mostrar la cantidad de palabras en juego, el usuario solo va a jugar no necesita saber cuantas hay.

5. En este caso, lo de "Listo para jugar" sobra demasiado.

6. No me gusta que aparezca "REINICIAR PARTIDA" Y "Nueva sesión" deberías de poner un botón para reiniciar la partida (lo que singifica que te da otra palabra).

7. En este caso los fallos cometidos se ve raro el / que este tan debajo.

8. En idioma inglés se ve raro en este caso, deberías de modificar y adaptar cuando se necesite para otro idioma.

Hazlo bien ;)!

(Mejorado y enviado):

Actúa como un **Lead Frontend Architect y Diseñador UI/UX Senior** con amplia experiencia en **React, Bootstrap 5,
  CSS3 avanzado y Sistemas de Diseño Multidioma (i18n)**.

    Tu objetivo es entregar el juego de adivinar palabras con un acabado visual **impecable, moderno y libre de
  fricciones de usuario**. Debes corregir problemas típicos de maquetación, desorden de botones, textos innecesarios
  y adaptar el motor de juego para que funcione de manera nativa y fluida tanto en **Español** como en **Inglés**.

    ---

    ## 1. Diseño Visual, Limpieza y Microcopy (Cero Ruido)

    1. **Pie de página (Footer) estricto:**
       - Debe ubicarse en `Footer.jsx` y mostrar única y exclusivamente:
         $$\text{© 2026 Adivina la palabra.}$$
       - Queda terminantemente prohibido incluir textos técnicos o de portafolio como *"Desarrollado con arquitectura
  limpia y React"*, nombres de librerías o frameworks.

    2. **Eliminación total de contadores y badges superfluos:**
       - **NO muestres** la cantidad de palabras restantes ni palabras en juego. El usuario solo quiere jugar; el
  control de palabras no repetidas debe ser estrictamente interno.
       - Elimina etiquetas de estado obvias o innecesarias como *"Listo para jugar"*, *"En espera"*, *"Estado:
  Activo"*, etc.

    3. **Eliminar instrucciones redundantes:**
       - Prohibido mostrar frases duplicadas o explicativas como *"Pulsa COMENZAR para descubrir la palabra oculta"*
  o *"Pulsa COMENZAR para activar la entrada de letras"*. La interfaz debe ser limpia e intuitiva por sí misma.

    4. **Corrección de maquetación en el marcador (`ScoreBoard`):**
       - El indicador de fallos no debe romper líneas ni desalinear el separador `/`.
       - Utiliza CSS Flexbox (`display: inline-flex; align-items: baseline; white-space: nowrap;`) para asegurar que
  `0 / 7` aparezca en una sola línea continua, con tipografía uniforme y alineación vertical perfecta.

    ---

    ## 2. Revelado Progresivo y Flujo de Partida Unificado

    No muestres formularios bloqueados ni botones redundantes compitiendo en pantalla:

    ### A. Estado Inicial (Antes de empezar)
    - **Pantalla despejada:** Título en la cabecera, selector de idioma y un contenedor central limpio.
    - **Ocultar la zona de juego:** La casilla de la palabra, el formulario de letras (`LETRA: [ ] [COMPROBAR]`), las
  letras usadas y los marcadores **no se muestran** hasta que comience el juego.
    - **Acción principal:** Un único botón central destacado: **"COMENZAR"**.

    ### B. Estado en Partida (Juego activo)
    - Se despliegan con una transición suave (`fade-in` / `slide-up`):
      - Las casillas de la palabra oculta.
      - El formulario de entrada de letras con el foco automático (`autofocus`).
      - Los marcadores compactos: Fallos (`0 / 7`) y Puntuación.
      - Las letras utilizadas divididas en aciertos y fallos.
    - **Botón de control único:**
      - **Prohibido tener dos botones simultáneos** como *"REINICIAR PARTIDA"* y *"Nueva sesión"*.
      - Debe haber un **único botón de control** claramente rotulado: **"NUEVA PALABRA"** (o *"REINICIAR"*), cuya
  pulsación seleccione inmediatamente una nueva palabra de la lista y reinicie los fallos y letras descubiertas sin
  recargar la página.

    ### C. Estado Final (Victoria o Derrota)
    - Se bloquea la entrada de letras.
    - Se muestra un modal limpio con el desenlace, la palabra resuelta y los puntos.
    - El botón de acción cambia a: **"SIGUIENTE PALABRA"**.

    ---

    ## 3. Selector de Idioma con Banderas Visuales Reales (SVGs)

    > **Nota técnica crítica:** En sistemas operativos como Windows, los emojis de banderas (ej. `🇪🇸`, `🇬🇧`) suelen
  renderizarse por defecto como letras regionales de texto plano (`ES`, `GB`).

    - Para evitar esto, el componente `LanguageSelector.jsx` **debe renderizar iconos gráficos reales (SVGs limpios o
  imágenes vectoriales)** de las banderas nacionales:
      - Bandera de España para Español.
      - Bandera de Reino Unido (Union Jack) o Estados Unidos para Inglés.
    - El selector debe ser un desplegable elegante y accesible ubicado en la esquina superior derecha del `Header`.

    ---

    ## 4. Adaptación Completa al Inglés y Motor i18n Dinámico

    El cambio de idioma no es solo traducir palabras sueltas; debe adaptar la lógica del juego:

    1. **Alfabeto dinámico según el idioma seleccionado:**
       - **Español (`es`):** Alfabeto `[A-ZÑ]`. Acepta la letra `Ñ`.
       - **Inglés (`en`):** Alfabeto estándar latino de 26 letras `[A-Z]`. La letra `Ñ` no existe en el alfabeto
  inglés y debe considerarse inválida si se introduce en este modo.
    2. **Textos y microcopy naturales (sin traducciones forzadas):**
       - En inglés, usa términos naturales de videojuegos de palabras:
         - Título: *"Word Guessing Game"* (o *"Word Guesser"*).
         - Entrada: Label *"LETTER"*, botón *"GUESS"* o *"CHECK"*.
         - Marcadores: *"Mistakes: 0 / 7"*, *"Score: 0"*.
         - Letras usadas: *"Correct letters"* / *"Wrong letters"*.
         - Botones de acción: *"START"*, *"NEW WORD"*, *"PLAY AGAIN"*.
    3. **Archivos de datos independientes:**
       - `data/words-es.json`: Al menos **500 palabras reales** en español (7-10 letras, mayúsculas, sin tildes).
       - `data/words-en.json`: Al menos **500 palabras reales** en inglés (7-10 letras, mayúsculas, sin caracteres
  especiales ni espacios).
    4. **Cero textos hardcodeados:**
       - Todos los textos de interfaz, modales, alertas y botones deben residir exclusivamente en `locales/es.json` y
  `locales/en.json`.

    ---

    ## 5. Arquitectura del Proyecto

    Estructura modular y limpia con separación de responsabilidades:

    ```text
    src/
    ├── assets/
    │   └── flags/               # Iconos SVG de las banderas (es.svg, en.svg)
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx       # Título y LanguageSelector (con banderas SVG)
    │   │   └── Footer.jsx       # Únicamente: © 2026 Adivina la palabra.
    │   ├── game/
    │   │   ├── WordDisplay.jsx  # Casillas de las letras
    │   │   ├── LetterInput.jsx  # Input + botón (solo visible en partida)
    │   │   ├── ScoreBoard.jsx   # Fallos (0 / 7 en una sola línea) y Puntos
    │   │   ├── UsedLetters.jsx  # Historial visual de aciertos y fallos
    │   │   └── GameControls.jsx # Botón de acción único y contextual
    │   └── ui/
    │       ├── Modal.jsx        # Diálogo de fin de partida (Victoria/Derrota)
    │       ├── Toast.jsx        # Feedback breve de validación
    │       └── LanguageSelector.jsx
    ├── locales/
    │   ├── es.json              # Traducciones naturales en español
    │   └── en.json              # Traducciones naturales en inglés
    ├── data/
    │   ├── words-es.json        # 500+ palabras en español (7-10 letras)
    │   └── words-en.json        # 500+ palabras en inglés (7-10 letras)
    ├── services/
    │   └── languageLoader.js    # Carga dinámica: idioma ↔ textos ↔ diccionario ↔ alfabeto
    ├── hooks/
    │   ├── useGame.js           # Máquina de estados del juego
    │   └── useLanguage.js       # Estado global del idioma y textos
    ├── utils/
    │   ├── scoreCalculator.js   # Puntuación = Letras únicas acertadas * (7 - Fallos)
    │   └── letterValidator.js   # Validador sensible al alfabeto del idioma activo
    ├── styles/
    │   ├── variables.css
    │   ├── game-juice.css       # Animaciones sutiles (pop, shake)
    │   └── main.css             # Estilos generales y correcciones tipográficas
    ├── App.jsx
    └── main.jsx
  ──────
  ## 6. Reglas Nucleares y Lógica

  • Límite de fallos: Máximo 7 fallos.
  • Cálculo de puntuación:

    Puntuación = Nº de letras únicas acertadas × (7 - Nº de fallos cometidos)

  • Control de entradas: Letras repetidas o caracteres no permitidos no suman fallos ni descuentan puntos.
  • Extracción de palabras: Cada palabra jugada se retira del pool disponible para no repetirse durante la sesión
  activa.
  ──────
  ## 7. Control de Calidad previo a la Entrega

  Verifica antes de entregar el código:

  [ ] El footer muestra estrictamente: © 2026 Adivina la palabra. (sin menciones técnicas).
  [ ] Las banderas en el selector de idioma son iconos gráficos visuales (SVG) y no caracteres de texto plano.
  [ ] No hay ningún contador visible de "Palabras restantes / en juego".
  [ ] No existen textos repetitivos como "Pulsa COMENZAR para...".
  [ ] La zona de juego está oculta hasta pulsar "COMENZAR".
  [ ] No existen badges innecesarios ("Listo para jugar").
  [ ] Hay un único botón de reinicio ("NUEVA PALABRA") que cambia la palabra directamente, sin botones duplicados de
  sesión.
  [ ] El separador / de los fallos (0 / 7) se muestra en una sola línea horizontal sin cortes ni saltos raros.
  [ ] Al cambiar a inglés, el alfabeto se adapta (sin Ñ), los textos son idiomáticos y se cargan las 500+ palabras en
  inglés.
  [ ] Ambos archivos de palabras (words-es.json y words-en.json) contienen al menos 500 palabras completas de 7 a 10
  letras.

  Con este prompt ha solucionado varias cosas como añadir las banderas en el selector de idiomas, la página de inicio esta más limpia, pero todavía continuan algunos errores.

---

### 5. Quinto Prompt / Último Prompt Completo

Quinto prompt:

  La cosa es que en este caso:

1. No me gusta que aparezca "REINICIAR PARTIDA" Y "Nueva sesión" deberías de poner un botón para reiniciar la partida (lo que singifica que te da otra palabra). También el usurio no necesita conocer la cantidad de palabras que hay en el diccionario!

2. En este caso los fallos cometidos se ve raro el / que este tan debajo.

3. La pagina principal podrías añadir un tutorial no crees es decir, para que no quede tan soso solo el botón de "Comenzar".

Anda,

Hazlo bien ;)!

ultimo:

La cosa es que en este caso:

1. No me gusta que aparezca "REINICIAR PARTIDA" Y "Nueva sesión" deberías de poner un botón para reiniciar la partida (lo que singifica que te da otra palabra). También el usurio no necesita conocer la cantidad de palabras que hay en el diccionario!

2. En este caso los fallos cometidos se ve raro el / que este tan debajo.

3. La pagina principal podrías añadir un tutorial no crees es decir, para que no quede tan soso solo el botón de "Comenzar".

Anda,

Hazlo bien ;)!

> **¿Qué hizo este prompt?:**  
> Este último prompt resolvió los detalles finales de UX, maquetación y diseño que quedaban pendientes:
> 1. **Tutorial en la pantalla principal:** Añadió el componente `StartScreen` antes de pulsar "Comenzar", incorporando un tutorial interactivo y visual de 5 pasos con iconos de Bootstrap Icons para guiar al usuario en la mecánica del juego sin que la pantalla inicial se vea vacía ni sosa.
> 2. **Corrección definitiva del separador `/`:** Ajustó la maquetación CSS en `ScoreBoard.jsx` aplicando un contenedor Flexbox en línea con `white-space: nowrap` y alineación vertical estricta, asegurando que el marcador de fallos `0 / 7` permanezca siempre alineado en una sola línea continua en cualquier dispositivo o resolución.
> 3. **Unificación de botones y ocultamiento del diccionario:** Eliminó la duplicidad confusa entre "REINICIAR PARTIDA" y "Nueva sesión", unificándolos en un único botón contextual en `GameControls.jsx` ("NUEVA PALABRA") que reinicia la partida con una nueva palabra tras una confirmación de seguridad. Asimismo, eliminó cualquier indicador o mención a la cantidad interna de palabras que componen el diccionario, manteniendo la interfaz 100% limpia para el usuario.

---

## 3. Autoevaluación Crítica y Reflexión Personal

### 1. Productividad vs. Comprensión
*¿En qué medida la IA aceleró tu ritmo de trabajo y qué porcentaje del código subido a tu repositorio serías capaz de explicar línea por línea sin ayuda?*

- **Impacto en la productividad:**  
  Gemini 3.8 Flash redujo los tiempos de desarrollo de forma exponencial. Construir manualmente este proyecto con React, Bootstrap, soporte completo de i18n, más de 1.500 palabras filtradas en dos idiomas, animaciones CSS personalizadas y separación de responsabilidades habría requerido fácilmente entre 15 y 20 horas de trabajo. Con el soporte de modelos generativos y meta-prompting, la aplicación completa y su arquitectura se completaron en apenas una fracción de ese tiempo. La generación masiva de datos estructurados (los JSON de palabras y traducciones) y el boilerplate de componentes representaron el mayor ahorro temporal.
- **Grado de comprensión del código (85 % - 90 %):**  
  A pesar de que el **0 %** del código fue escrito manualmente desde cero, soy capaz de explicar de forma autónoma aproximadamente el **85-90 %** del proyecto línea por línea. Esto se debe a que la metodología empleada no fue un simple "copiar y pegar a ciegas", sino una **auditoría continua**:
  - Comprendo con exactitud el flujo unidireccional de datos en React, la propagación de props y eventos entre `App.jsx`, `useGame.js` y los componentes hijos.
  - Puedo defender la fórmula matemática en `scoreCalculator.js` (`letrasUnicas * (7 - fallos)`).
  - Entiendo las expresiones regulares de validación en `letterValidator.js` y el uso del Context API en `useLanguage.jsx`.  
  El 10-15 % restante corresponde a sutilezas sintácticas de bajo nivel de librerías externas o configuraciones de empaquetado de Vite que habitualmente se delegan en la herramienta.

---

### 2. Fricciones y bloqueos
*¿En qué momentos la IA te hizo perder el tiempo, ofreció soluciones en bucle o te llevó por arquitecturas erróneas?*

El desarrollo con Gemini 3.8 Flash no estuvo exento de fricciones significativas:
1. **Tendencia al código monolítico y la duplicidad:** En las primeras iteraciones, el modelo tendía a concentrar la lógica, el estado y el JSX en un único archivo monstruoso o volvía a anidar funciones dentro de otras. Para romper esta tendencia fue necesario redactar directrices negativas estrictas (*"Queda terminantemente prohibido..."*).
2. **Alucinaciones de completitud en colecciones de datos:** En múltiples ocasiones la IA aseguraba haber incluido "500 palabras", cuando en realidad cortaba la respuesta con un comentario explicativo. Requirió prompts insistentes y la separación en ficheros JSON independientes para que generara los arrays íntegros.
3. **Resistencia a eliminar elementos de UI innecesarios:** El modelo mostraba una marcada inercia a colocar tarjetas, contadores técnicos ("Palabras en el array: 819") y botones redundantes ("Reiniciar partida", "Nueva partida", "Nueva sesión"). Hubo que reiterar varias veces que el usuario no debe conocer detalles de la base de datos interna.
4. **Bucle en el formato de visualización del marcador:** El separador `/` entre fallos y máximos fallos requirió insistencia explícita en reglas de maquetación CSS (`white-space: nowrap`), ya que la IA cambiaba componentes pero mantenía el mismo bug visual.
5. **Ceguera de entorno (Emojis en Windows):** La IA asumía que el uso de emojis Unicode (`🇪🇸`, `🇬🇧`) funcionaría universalmente, ignorando que el sistema operativo Windows no renderiza banderas con la tipografía por defecto.

---

### 3. Puntos ciegos
*Si tuvieras que defender este proyecto en una entrevista técnica o modificar una funcionalidad en vivo sin conexión a internet ni asistentes, ¿cuáles serían tus principales debilidades en el código actual?*

Si tuviese que afrontar una defensa técnica sin conexión:
1. **Sintaxis de memoria y velocidad de codificación pura:** Al delegar la escritura mecánica del código a Gemini 3.8 Flash, mi memoria muscular para recordar de memoria métodos exactos, estructuras complejas de reducers o selectores CSS avanzados se ve mermada. Requeriría más tiempo para escribir código sintácticamente perfecto a la primera sin la ayuda del linter o el autocompletado inteligente.
2. **Dependencia de la asistencia para la resolución de micro-bugs:** Ante un fallo inesperado de renderizado condicional en React o un bug sutil en el ciclo de vida de un hook, mi reflejo inmediato ha sido consultar o contrastar con la IA. Resolverlo en solitario exigiría volver al uso exhaustivo de `console.log`, puntos de interrupción en las DevTools del navegador y lectura directa de la documentación oficial.
3. **Mantenimiento de los estilos y animaciones (`game-juice.css`):** Aunque comprendo las transformaciones CSS (`scale`, `translate`, `keyframes`), diseñar animaciones fluidas desde cero sin un asistente que proporcione los valores óptimos de cubic-bezier y tiempos de transición es una de las áreas más lentas de ejecutar a mano.

---

### 4. Impacto en tu flujo de trabajo
*¿Cómo ha cambiado tu forma de razonar y resolver problemas de programación respecto a cuando programabas sin estas herramientas?*

El uso intensivo de Gemini 3.8 Flash ha provocado una evolución cualitativa en mi rol como futuro desarrollador web:
- **Transición de "Picapedrero de Código" a "Arquitecto y Revisor Crítico":**  
  Antes de usar IA, la mayor parte del tiempo mental y de la energía cognitiva se consumía en pelear con la sintaxis, recordar nombres de métodos de arrays, depurar comas faltantes y buscar soluciones repetitivas en foros. Con estas herramientas, el foco de atención se desplaza hacia la **definición clara de especificaciones, la arquitectura de componentes, la experiencia de usuario (UX), la modularidad y el control de calidad**.
- **Pensamiento analítico y precisión en los requerimientos:**  
  He aprendido que la IA es tan buena como las restricciones y especificaciones que se le proporcionan. Si el prompt es vago o ambiguo, el código resultante será mediocre y desestructurado. Para obtener un producto de calidad profesional es imprescindible descomponer los problemas en partes atómicas, definir contratos de interfaz y anticiparse a casos extremos (validaciones, estados de carga, fallos de renderizado).
- **Lectura crítica de código ajeno:**  
  El flujo de trabajo actual entrena intensamente la capacidad de auditar código. Cada respuesta de la IA debe someterse a escrutinio: verificar si cumple las reglas del negocio, si introduce vulnerabilidades o si incluye malas prácticas. En definitiva, la IA no sustituye el criterio técnico; al contrario, exige un criterio más sólido para distinguir una solución mediocre de una arquitectura escalable.
