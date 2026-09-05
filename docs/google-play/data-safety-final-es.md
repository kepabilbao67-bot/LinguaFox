# Cuestionario Final de Seguridad de los Datos (Data Safety) — LinguaFox

Formulario detallado para cumplimentar la sección **Seguridad de los datos** en Google Play Console con evidencia auditable de código.

---

## 1. Declaración General

**PREGUNTA GOOGLE:**  
¿Tu aplicación recopila o comparte alguno de los tipos de datos de usuario obligatorios?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
La aplicación opera bajo arquitectura 100% *offline-first*. Ningún dato de usuario (progreso, respuestas, estrellas, XP ni historial de chat) sale del almacenamiento local del dispositivo hacia servidores externos.  
**ARCHIVO/LÍNEA:**  
- [src/services/tutor-reply.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/services/tutor-reply.ts) (Líneas 145-210) — Pruebas en [src/services/__tests__/tutor-reply.test.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/services/__tests__/tutor-reply.test.ts#L86-L90): `expect(globalThis.fetch).not.toHaveBeenCalled();`  
- [src/utils/progress-storage.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/utils/progress-storage.ts) (Líneas 1-80): Todo persiste en `AsyncStorage.setItem()` local.  
**RIESGO:**  
Bajo / Nulo. Cumple estrictamente con la política de Google Play al no transferir datos fuera del dispositivo.

---

## 2. Cuestionario Específico por Categoría de Datos

### A. Ubicación
**PREGUNTA GOOGLE:**  
¿La aplicación recopila o comparte datos de ubicación aproximada o precisa?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No se incluye ninguna API de geolocalización (`expo-location` o similar) ni permisos en el manifest.  
**ARCHIVO/LÍNEA:**  
[android/app/src/main/AndroidManifest.xml](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/android/app/src/main/AndroidManifest.xml) (Sin `ACCESS_FINE_LOCATION` ni `ACCESS_COARSE_LOCATION`).  
**RIESGO:**  
Nulo.

---

### B. Información Personal (Nombre, Correo, ID de Usuario)
**PREGUNTA GOOGLE:**  
¿La aplicación recopila información personal como nombre, dirección de correo electrónico, números de teléfono o identificadores personales?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No hay pantallas de registro, login, formularios de contacto ni campos de entrada de datos personales.  
**ARCHIVO/LÍNEA:**  
[src/components/screens/onboarding-screen.tsx](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/components/screens/onboarding-screen.tsx): Solo selecciona idioma nativo e idioma objetivo.  
**RIESGO:**  
Nulo.

---

### C. Información Financiera
**PREGUNTA GOOGLE:**  
¿La aplicación recopila información sobre tarjetas de crédito, cuentas bancarias o historial de compras?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No hay compras integradas (*In-App Purchases*), suscripciones ni pasarelas de pago (Stripe, Google Play Billing, etc.).  
**ARCHIVO/LÍNEA:**  
[package.json](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/package.json): Sin dependencias como `react-native-iap` o `expo-in-app-purchases`.  
**RIESGO:**  
Nulo.

---

### D. Salud y Fitness
**PREGUNTA GOOGLE:**  
¿La aplicación recopila datos de salud o actividad física?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
La app es exclusivamente didáctica para aprendizaje de idiomas.  
**ARCHIVO/LÍNEA:**  
N/A.  
**RIESGO:**  
Nulo.

---

### E. Mensajes
**PREGUNTA GOOGLE:**  
¿La aplicación recopila mensajes de texto, correos o mensajes de chat de los usuarios?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
Los mensajes del chat didáctico con Fox o los personajes temáticos se procesan y almacenan únicamente en memoria o almacenamiento local del dispositivo. No se transmiten a servidores externos ni a APIs de terceros.  
**ARCHIVO/LÍNEA:**  
[src/components/screens/chat-screen.tsx](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/components/screens/chat-screen.tsx#L90-L120).  
**RIESGO:**  
Nulo.

---

### F. Fotos y Vídeos
**PREGUNTA GOOGLE:**  
¿La aplicación recopila o comparte fotos o vídeos del usuario?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No se solicitan permisos de cámara ni de galería de fotos.  
**ARCHIVO/LÍNEA:**  
[android/app/src/main/AndroidManifest.xml](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/android/app/src/main/AndroidManifest.xml) (Sin `CAMERA` ni `READ_MEDIA_IMAGES`).  
**RIESGO:**  
Nulo.

---

### G. Archivos de Audio y Grabaciones
**PREGUNTA GOOGLE:**  
¿La aplicación recopila grabaciones de voz, audio o sonido?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
LinguaFox no incluye reconocimiento de voz por micrófono. Solo utiliza síntesis de voz (*Text-to-Speech*) como salida de audio.  
**ARCHIVO/LÍNEA:**  
[src/services/speech.ts](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/src/services/speech.ts): Usa únicamente `Speech.speak()` de `expo-speech`. Manifest sin `RECORD_AUDIO`.  
**RIESGO:**  
Nulo.

---

### H. Archivos y Documentos
**PREGUNTA GOOGLE:**  
¿La aplicación recopila archivos o documentos del usuario?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No lee archivos privados del usuario.  
**ARCHIVO/LÍNEA:**  
[android/app/src/main/AndroidManifest.xml](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/android/app/src/main/AndroidManifest.xml).  
**RIESGO:**  
Nulo.

---

### I. Actividad en la Aplicación
**PREGUNTA GOOGLE:**  
¿La aplicación recopila interacciones, clics, historial de navegación dentro de la app u otra actividad con fines de analítica?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No se recopila telemetría ni analítica con SDKs de terceros. El progreso se guarda localmente para el propio usuario.  
**ARCHIVO/LÍNEA:**  
[package.json](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/package.json): Sin Google Analytics, Firebase Analytics, Segment, Amplitude.  
**RIESGO:**  
Nulo.

---

### J. Información y Rendimiento de la Aplicación (Diagnósticos)
**PREGUNTA GOOGLE:**  
¿La aplicación recopila registros de fallos, diagnósticos u otros datos de rendimiento mediante SDKs propios?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No se incluye Sentry, Crashlytics, Bugsnag ni SDKs de reporte de errores. (Google Play Console recopila métricas técnicas del SO de forma independiente a la app).  
**ARCHIVO/LÍNEA:**  
[package.json](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/package.json).  
**RIESGO:**  
Nulo.

---

### K. Identificadores de Dispositivo u Otros
**PREGUNTA GOOGLE:**  
¿La aplicación recopila identificadores de dispositivo, ID de publicidad (AAID) u otros identificadores persistentes?  
**RESPUESTA:**  
**NO**  
**EVIDENCIA:**  
No se utiliza el identificador de publicidad de Google (`AD_ID`), no se incluye el permiso `com.google.android.gms.permission.AD_ID` y no se recogen UUIDs de hardware.  
**ARCHIVO/LÍNEA:**  
[android/app/src/main/AndroidManifest.xml](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/android/app/src/main/AndroidManifest.xml).  
**RIESGO:**  
Nulo.

---

## 3. Prácticas de Seguridad y Eliminación

**PREGUNTA GOOGLE:**  
¿Los datos recopilados por la aplicación se cifran en tránsito mediante HTTPS/TLS?  
**RESPUESTA:**  
**No aplicable / Sí** (según el flujo de Play Console, ya que la app no transmite datos).  
**EVIDENCIA:**  
No hay tráfico de datos de usuario. La URL de la política de privacidad utiliza exclusivamente HTTPS.  
**ARCHIVO/LÍNEA:**  
[docs/privacy.html](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/privacy.html).  
**RIESGO:**  
Nulo.

**PREGUNTA GOOGLE:**  
¿Proporcionas un mecanismo para que los usuarios soliciten o realicen la eliminación de sus datos?  
**RESPUESTA:**  
**SÍ**  
**EVIDENCIA:**  
El usuario puede restablecer o eliminar completamente sus datos desde el sistema operativo (**Ajustes → Aplicaciones → LinguaFox → Almacenamiento → Borrar datos**) o simplemente desinstalando la aplicación.  
**ARCHIVO/LÍNEA:**  
Documentado en la sección 4 y 8 de la Política de Privacidad ([docs/privacy.html](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/privacy.html#L143-L149)).  
**RIESGO:**  
Nulo.
