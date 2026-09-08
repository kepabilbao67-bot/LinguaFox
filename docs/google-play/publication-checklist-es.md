# Lista de Pasos para la Publicación en Google Play — LinguaFox

Guía secuencial para el proceso completo de lanzamiento de LinguaFox en Google Play Console desde el estado actual.

---

## Fase 1: Requisitos Previos al Acceso a Play Console
- [x] **Código consolidado y auditado:** Rama `stabilization/linguafox-baseline` limpia, sin errores de compilación, linter ni pruebas.
- [x] **APK de previsualización probado:** Binario local generado y verificado estáticamente.
- [x] **Documentación legal redactada:** Política de privacidad interna en la app y página HTML estática (`docs/privacy.html`) preparadas.
- [x] **Alojamiento público de la Política de Privacidad:** Publicada en `https://kepabilbao67-bot.github.io/LinguaFox/privacy.html` (Verificada con respuesta HTTP 200).
- [ ] **Recursos gráficos generados:** Icono de 512x512 px, Feature Graphic de 1024x500 px y capturas de pantalla reales preparadas.

---

## Fase 2: Configuración de la Ficha en Google Play Console

### 1. Ficha Principal de la Tienda
- [ ] **Nombre de la app:** `LinguaFox`
- [ ] **Descripción corta:** Usar el texto preparado en `store-listing-es.md` (78 caracteres).
- [ ] **Descripción completa:** Copiar el texto estructurado de `store-listing-es.md`.
- [ ] **Recursos gráficos:** Subir icono (512x512), gráfico de funciones (1024x500) y capturas de pantalla de móvil.
- [ ] **Categoría:** Educación.
- [ ] **Datos de contacto públicos:** `pedrobilbao93@gmail.com`.

### 2. Política de Privacidad
- [ ] Introducir la URL pública HTTPS de la política en el campo correspondiente de la consola.

### 3. Acceso a Aplicaciones
- [ ] Seleccionar: *"Todas las funciones están disponibles sin restricciones ni credenciales de inicio de sesión"*.

### 4. Anuncios
- [ ] Seleccionar: *"No, mi aplicación no contiene anuncios"*.

### 5. Compras Integradas
- [ ] Confirmar que no hay productos integrados ni suscripciones configuradas.

### 6. Clasificación de Contenido (IARC)
- [ ] Completar el cuestionario IARC siguiendo las respuestas de `content-rating-draft-es.md`.
- [ ] Obtener y guardar el certificado IARC generado (PEGI 3 / ESRB Everyone).

### 7. Público Objetivo y Contenido
- [ ] Seleccionar el rango de edad previsto (13 años o más / Todo público).
- [ ] Declarar si la app atrae involuntariamente a niños según las directivas de Play Console.

### 8. Seguridad de los Datos (Data Safety)
- [ ] Rellenar el cuestionario siguiendo el borrador de `data-safety-draft-es.md`.
- [ ] Declarar que la app **no recopila ni comparte datos con servidores externos**.
- [ ] Declarar que los datos de usuario se gestionan localmente y se eliminan mediante los ajustes del sistema o al desinstalar.

### 9. Declaraciones Gubernamentales y Especiales
- [ ] Confirmar que la app no es una aplicación gubernamental, ni de noticias, ni de rastreo COVID-19.

---

## Fase 3: Compilación del Paquete de Producción (Android App Bundle / AAB)
- [x] Configuración del pipeline automático en GitHub Actions (`.github/workflows/build-android.yml`).
- [x] Keystore oficial EAS integrada mediante secretos cifrados en GitHub.
- [x] Inyección automática de firma Release (`signingConfigs.release`) mediante Config Plugin Expo.
- [x] `versionCode: 4` e incremento continuo asegurado.
- [x] Verificación criptográfica automática del certificado SHA-256 (`37:38:1D:5F:...`).
- [x] Generación del artefacto `LinguaFox-Release.aab`.

---

## Fase 4: Creación de la Versión y Envío a Revisión
- [ ] Subida a **Internal Testing**:
  - Automática mediante GitHub Actions una vez configurado el secreto `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`.
  - O manual descargando el artefacto `LinguaFox-Release.aab` desde GitHub Actions.
- [ ] Pegar las notas de la versión en español desde `docs/google-play/release-notes-1.0.1-es.md`.
- [ ] Probar la versión con el grupo de probadores internos.
- [ ] Promocionar a Producción cuando Kepa dé la autorización explícita.

