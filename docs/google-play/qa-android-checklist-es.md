# Protocolo y Lista de Verificación de QA en Dispositivos Android — LinguaFox

Guía exhaustiva para la prueba de calidad física en dispositivos reales Android con el APK generado (`LinguaFox-8ef4433-preview-local.apk`).

---

## 1. Preparación del Entorno de Prueba
- **Dispositivo de prueba:** Teléfono o tablet Android con Android 7.0 (API 24) o superior (idealmente Android 12, 13, 14 o 15).
- **Herramientas recomendadas:** `adb` (Android Debug Bridge) para instalación y monitorización de `logcat`.

---

## 2. Matriz de Pruebas Funcionales (Checklist)

### 1. Instalación y Primer Arranque
- [ ] **Instalación:** El archivo APK se instala correctamente vía `adb install -r <ruta-apk>` o mediante el explorador de archivos sin advertencias bloqueantes de paquetes corruptos.
- [ ] **Apertura y Splash Screen:** La pantalla de bienvenida / icono de splash se muestra nítida y se oculta de forma fluida una vez hidratado el estado de la app, sin pantallas blancas o parpadeos.

### 2. Flujo de Onboarding y Configuración Inicial
- [ ] **Proceso de bienvenida:** Las pantallas de bienvenida explican la propuesta didáctica y permiten avanzar paso a paso.
- [ ] **Selección de idioma:** Se puede elegir el idioma nativo y el idioma a aprender sin bloqueos.
- [ ] **Finalización de onboarding:** Al completar el onboarding, la app navega automáticamente a la pantalla principal (`HomeScreen`) y marca el estado de onboarding como completado en el almacenamiento local.

### 3. Pantalla Principal (Home) y Navegación
- [ ] **Nivel y lecciones:** Se muestran las unidades didácticas y lecciones disponibles con sus títulos y estado correspondiente.
- [ ] **Cabecera e indicadores:** Los contadores de racha de días, nivel y estrellas se renderizan correctamente con la tipografía y colores del tema.
- [ ] **Acceso a Política de Privacidad:** En el pie de la Home aparece el enlace "Política de privacidad", con área táctil cómoda y accesible.

### 4. Lecciones Interactivas
- [ ] **Carga de contenido:** Al pulsar una lección, se cargan los textos, conceptos y ejemplos correspondientes.
- [ ] **Reproducción de audio (TTS):** Los botones con icono de audio pronuncian las frases en inglés utilizando el sintetizador de voz del dispositivo.
- [ ] **Botón Volver:** Permite regresar a la Home en cualquier punto de la lección conservando el estado.

### 5. Quizzes, Evaluación y Corrección de Errores
- [ ] **Interacción con opciones:** Los botones de opciones responden al toque visualmente con estados de selección.
- [ ] **Respuesta correcta:** Se incrementa la puntuación y se valida visualmente el acierto.
- [ ] **Respuesta incorrecta:** Se despliega la tarjeta de explicación pedagógica (`ErrorExplanationCard`) con el porqué del error y el ejemplo correcto.
- [ ] **Pantalla de resultados:** Al finalizar el quiz, se muestran los aciertos, el XP ganado y las estrellas obtenidas. El botón de continuar actualiza el progreso en la Home.

### 6. Práctica de Escucha (Modo Escucha)
- [ ] **Entrada al modo escucha:** Se accede desde el selector de personajes o detalle del personaje con el botón *"Escuchar"*.
- [ ] **Reproducción de voz:** Al tocar *"Escuchar"*, el personaje pronuncia su frase en inglés mediante TTS.
- [ ] **Subtítulos:** El conmutador de subtítulos oculta y muestra el texto de transcripción en pantalla instantáneamente.
- [ ] **Cierre:** El botón *"Terminar práctica"* y la flecha de retorno devuelven al usuario al chat o pantalla anterior de forma limpia.

### 7. Personajes y Chat con Tutor Fox Local
- [ ] **Selector de personajes:** El grid muestra a los personajes con su avatar, nombre, enfoque de vocabulario y dificultad.
- [ ] **Conversación local:** Se pueden enviar mensajes predefinidos mediante los chips de sugerencias o escribiendo texto en el campo de entrada.
- [ ] **Respuestas del tutor:** Fox y los personajes responden de forma pedagógica sin latencias de red ni llamadas externas.
- [ ] **Nueva conversación:** El botón *"Nueva conversación"* reinicia el historial local del chat correctamente.

### 8. Política de Privacidad Integrada
- [ ] **Apertura:** Al pulsar el enlace de privacidad en la Home, se abre `/privacy` instantáneamente.
- [ ] **Lectura completa:** El documento muestra los 10 apartados formateados, el correo `pedrobilbao93@gmail.com` seleccionable y la fecha actualizada.
- [ ] **Navegación de retorno:** El botón *"Volver"* regresa a la Home con suavidad.

---

## 3. Pruebas de Resiliencia, Sistema y Dispositivo

### 9. Prueba Offline / Modo Avión (Crítica)
- [ ] **Comportamiento sin conexión:** Con el teléfono en Modo Avión (sin Wi-Fi ni datos móviles), la aplicación:
  - Abre normalmente sin pantallas de error ni cuelgues.
  - Permite completar lecciones, quizzes y chats locales.
  - Guarda el progreso localmente.
  - Reproduce TTS si el motor de voz del sistema dispone de datos de voz descargados.

### 10. Persistencia de Datos y Ciclo de Vida
- [ ] **Cierre forzado:** Tras completar lecciones y ganar XP, forzar el cierre de la app desde la vista de aplicaciones recientes de Android y volver a abrirla: el progreso, rachas y estrellas deben permanecer intactos.
- [ ] **Reinicio del dispositivo:** Apagar y encender el teléfono: los datos en `AsyncStorage` se conservan al 100%.
- [ ] **Bloqueo de pantalla:** Bloquear el teléfono mientras se realiza un quiz y desbloquear: la pantalla reanuda exactamente donde estaba sin reiniciar la actividad.

### 11. Comportamiento Físico y Accesibilidad
- [ ] **Botón / Gesto Atrás de Android:** Al usar el botón atrás del sistema o el gesto de deslizamiento desde el borde, la app retrocede una pantalla y no se cierra inesperadamente salvo en la Home.
- [ ] **Orientación de pantalla:** La aplicación se mantiene estable en orientación vertical (portrait) según lo configurado en `app.json`.
- [ ] **Safe Area e Insets:** En dispositivos con notch, isla de cámara o barra de navegación por gestos, ningún botón ni texto queda solapado ni cortado.
- [ ] **Sin solicitud de permisos:** Comprobar en **Ajustes → Aplicaciones → LinguaFox → Permisos** que la aplicación **no tiene ni solicita permisos de micrófono, cámara ni ubicación**.

### 12. Monitoreo de Logcat (adb)
- [ ] **Filtrado de errores:** Ejecutar `adb logcat *:E` durante toda la sesión de pruebas:
  - 0 excepciones no controladas (`FATAL EXCEPTION`).
  - 0 fugas de memoria o advertencias de colapso de UI Thread.
