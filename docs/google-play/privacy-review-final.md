# Auditoría y Revisión Final de Privacidad — LinguaFox

## 1. Estado del Documento de Privacidad

- **Archivo fuente local:** [docs/privacy.html](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/privacy.html)
- **URL pública HTTPS:** `https://kepabilbao67-bot.github.io/LinguaFox/privacy.html`
- **Estado HTTP verificado:** **200 OK** (Longitud: 8.818 bytes)
- **Fecha de última actualización declarada:** 27 de agosto de 2026
- **Responsable declarado:** Desarrollador independiente
- **Email de contacto para privacidad:** `pedrobilbao93@gmail.com`

---

## 2. Puntos Clave Auditados Frente al Código Real

| Sección en Política | Código Real de LinguaFox | Coherencia | Evidencia en Código |
| :--- | :--- | :---: | :--- |
| **Identificación personal** | No se solicita nombre, email, teléfono ni registro | **100% Coherente** | Cero pantallas de login/registro |
| **Almacenamiento de progreso** | Guardado local en AsyncStorage / MMKV | **100% Coherente** | [src/utils/progress-storage.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/utils/progress-storage.ts) |
| **Rachas y tiempo** | `user.streak.data` y `user.last.timestamp` | **100% Coherente** | [src/services/streak.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/services/streak.ts) |
| **Micrófono y audio** | No solicita permiso `RECORD_AUDIO`, no graba | **100% Coherente** | `AndroidManifest.xml` sin permiso de micrófono |
| **Síntesis de voz (TTS)** | Utiliza el motor nativo del dispositivo (`expo-speech`) | **100% Coherente** | [src/services/speech.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/services/speech.ts) |
| **Tutor conversacional** | Lógica pedagógica local determinista | **100% Coherente** | [src/services/tutor-reply.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/services/tutor-reply.ts) (0 llamadas a red) |
| **Analítica / Telemetría** | No contiene Firebase Analytics, Amplitude ni Mixpanel | **100% Coherente** | `package.json` sin librerías de tracking |
| **Publicidad y pagos** | Sin anuncios ni compras dentro de la app | **100% Coherente** | Cero SDKs de anuncios (AdMob, etc.) |

---

## 3. Conformidad con Requisitos de Google Play

1. **Accesibilidad pública sin barreras:** La URL es accesible públicamente sin autenticación, muros de pago ni geobloqueos.
2. **Identificación explícita de la app:** La página menciona específicamente a `LinguaFox` en el título, encabezado y cuerpo.
3. **Mecanismo de eliminación de datos:** Se explica de forma clara que el usuario puede borrar sus datos locales mediante **Ajustes de Android → Aplicaciones → LinguaFox → Borrar datos** o desinstalando la aplicación.
4. **Declaración sobre menores:** Se certifica que no se recogen deliberadamente datos personales de menores.

---

## 4. Conclusión

**APTA PARA GOOGLE PLAY: SÍ**  
La política es plenamente verídica, no contiene declaraciones falsas ni omisiones y cumple con todas las directivas de Play Console para aplicaciones educativas.
