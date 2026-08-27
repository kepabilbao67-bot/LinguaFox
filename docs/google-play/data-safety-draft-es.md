# Borrador de Seguridad de los Datos (Data Safety) — LinguaFox

Guía estructurada para responder el formulario de **Seguridad de los datos** en Google Play Console para la versión 1.0.0 de LinguaFox.

---

## 1. Resumen de Tratamiento de Datos en LinguaFox V1

### A. Datos Almacenados Localmente
- **Dónde residen:** En el almacenamiento interno y aislado de la aplicación en el dispositivo (`AsyncStorage` / `MMKV`).
- **Qué datos son:**
  1. Idioma nativo e idioma objetivo seleccionados.
  2. Estado del onboarding (completado: sí/no).
  3. Progreso de lecciones (completadas, puntuaciones, respuestas).
  4. Métricas de gamificación (XP acumulado, estrellas, racha de días).
  5. Preferencias de interfaz (activación de subtítulos).
  6. Historial de mensajes con el tutor pedagógico local.
- **Transmisión a servidores:** **NINGUNA.** LinguaFox no envía ninguno de estos datos a servidores propios ni de terceros.

### B. Ausencia de Datos Recopilados o Compartidos por el Desarrollador
- **Cuentas de usuario:** No se solicitan nombres, correos, contraseñas ni perfiles.
- **Identificadores personales:** Cero recopilación de números de teléfono, direcciones o identificadores de hardware.
- **Publicidad y Monetización:** Cero SDKs publicitarios, cero compras integradas.
- **Analítica y Telemetría:** Cero integración con Firebase Analytics, Amplitude, Mixpanel o similares.

### C. Factores del Sistema Operativo y Terceros (A tener en cuenta)
1. **Motor de Síntesis de Voz (Text-to-Speech / TTS):**
   - LinguaFox envía fragmentos de texto al motor TTS predeterminado del sistema operativo (`expo-speech` → Android TTS).
   - Según el proveedor del motor de voz configurado por el usuario (ej. Google Speech Services, Samsung TTS), el motor puede resolver la síntesis de forma offline o mediante conexión de red del proveedor, sujeto a sus propios términos de servicio.
2. **Copias de Seguridad del Sistema Operativo (Android Auto Backup):**
   - El sistema Android puede respaldar los datos locales de la aplicación en la cuenta de Google Drive del usuario si este tiene activada la copia de seguridad del dispositivo. LinguaFox no gestiona ni almacena directamente estas copias.
3. **Servicios de Google Play Store:**
   - La descarga, instalación y métricas básicas de distribución están gestionadas directamente por Google Play conforme a la política de privacidad de Google.

---

## 2. Respuestas Propuestas para el Cuestionario de Play Console

### Sección 1: Recopilación y uso compartido de datos
- **¿Tu aplicación recopila o comparte alguno de los tipos de datos de usuario obligatorios?**
  - *Respuesta sugerida:* **No**.
  - *Justificación técnica:* LinguaFox no extrae datos del dispositivo ni los transmite a servidores externos. Todos los datos de progreso son procesados y conservados estrictamente en el almacenamiento local del dispositivo.

### Sección 2: Prácticas de seguridad
- **¿Los datos que recopila tu aplicación se cifran en tránsito?**
  - *Respuesta sugerida:* **No aplicable / Sí** (según si Play Console pregunta si no se recopilan datos). LinguaFox no transfiere datos de usuario por red.
- **¿Proporcionas una forma para que los usuarios soliciten que se eliminen sus datos?**
  - *Respuesta sugerida:* **Sí**.
  - *Mecanismo:* Los datos se eliminan completamente desde los Ajustes del dispositivo (**Ajustes → Aplicaciones → LinguaFox → Almacenamiento → Borrar datos**) o mediante la desinstalación de la aplicación.

### Sección 3: Tipos de datos específicos
- **Ubicación:** No se recopila.
- **Información personal (Nombre, Correo, etc.):** No se recopila.
- **Información financiera:** No se recopila.
- **Salud y fitness:** No se recopila.
- **Mensajes:** No se recopila (los mensajes del chat local no se envían a ningún servidor).
- **Fotos y vídeos:** No se recopila.
- **Archivos de audio / Micrófono:** No se recopila (la app no solicita permiso de micrófono ni graba voz).
- **Archivos y documentos:** No se recopila.
- **Calendario / Contactos:** No se recopila.
- **Actividad en la aplicación:** No se recopila (sin telemetría externa).
- **Navegación web:** No se recopila.
- **Información y rendimiento de la aplicación (Diagnósticos/Crashes):** No se recopilan mediante SDKs de terceros propios.
- **Identificadores de dispositivo u otros:** No se recopilan.

---

## 3. Puntos Críticos que Deben Confirmarse Manualmente Antes del Envío

1. **Alojamiento Público de la Política de Privacidad:** La URL HTTPS donde se publique `docs/privacy.html` debe estar operativa e introducida en la ficha de la tienda antes de guardar la sección de Seguridad de los datos.
2. **Coherencia con Declaraciones de Permisos:** Confirmar que no se hayan añadido permisos sensibles en futuras versiones (`RECORD_AUDIO`, `ACCESS_FINE_LOCATION`, etc.).
3. **Declaración sobre Menores:** Si la app se clasifica para público que incluya menores, Google Play exige declarar que la aplicación cumple con las directivas para familias y que no se recopila información personal identificable.
