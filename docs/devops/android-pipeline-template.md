# Plantilla de Pipeline CI/CD Android Release — LinguaFox & AjedrezPro

Esta documentación establece la arquitectura estándar de integración y despliegue continuo (CI/CD) para aplicaciones móviles Android desarrolladas con Expo (SDK 57) / React Native en la organización.

El pipeline automatiza el ciclo:
**Código validado → GitHub Actions → Expo Prebuild → Reconstrucción Keystore → AAB Release Firmado → Verificación Criptográfica SHA-256 → Artifact → Google Play Internal Testing**.

---

## 1. Componentes Reutilizables (Compartidos)

Los siguientes módulos son **100% reutilizables** y pueden copiarse directamente a cualquier nuevo proyecto (como **AjedrezPro**):

1. **Expo Config Plugin (`plugins/with-release-signing.js`)**:
   - Intercepta la generación del archivo nativo `android/app/build.gradle` durante `expo prebuild`.
   - Inyecta de forma segura el bloque `signingConfigs.release` consumiendo variables de entorno.
   - Reemplaza de forma infalible `signingConfig signingConfigs.debug` por `signingConfig signingConfigs.release` en `buildTypes.release`.

2. **Script de Verificación Post-Prebuild (`scripts/configure-android-signing.js`)**:
   - Valida antes de la compilación con Gradle que `android/app/build.gradle` contenga la configuración de firma Release requerida, bloqueando la compilación si detecta cualquier desalineación.

3. **Estructura del Workflow de GitHub Actions (`.github/workflows/build-android.yml`)**:
   - Secuencia estandarizada:
     - `checkout`
     - Node 20 + Java 17 Temurin + Android SDK
     - `npm ci`
     - `npm test` + `npm run lint` + `npx tsc --noEmit`
     - `npx expo prebuild --platform android --clean`
     - Reconstrucción de la keystore desde secreto Base64
     - Compilación `./gradlew bundleRelease`
     - Verificación estricta de la huella digital SHA-256 del AAB antes de la publicación
     - Limpieza garantizada de la keystore (`if: always()`)
     - Generación del artefacto AAB descargable
     - Subida a Google Play Internal Testing con `r0adkll/upload-google-play@v1`.

4. **Reglas de Seguridad en `.gitignore`**:
   - Exclusión de `credentials.json`, `credentials/`, `*.keystore`, `*.jks`, `artifacts/` para blindar el repositorio contra filtraciones accidentales de credenciales.

---

## 2. Componentes Específicos por Aplicación (NO Compartir)

Cada aplicación debe mantener de forma **estrictamente aislada** los siguientes elementos:

| Parámetro | LinguaFox | AjedrezPro |
| :--- | :--- | :--- |
| **Application ID / Package** | `com.kepabilbao.linguafox` | `com.kepabilbao.ajedrezpro` (o el package oficial de AjedrezPro) |
| **Keystore de Firma** | Keystore EAS de LinguaFox | **Keystore propia e independiente de AjedrezPro** *(¡NUNCA reutilizar la misma clave de producción!)* |
| **Alias de la Keystore** | `4f35f0d45175cfb1d4670be98e6f46cb` | Alias generado específicamente para AjedrezPro |
| **SHA-256 esperado** | `37:38:1D:5F:F3:92:27:...` | SHA-256 de la keystore de AjedrezPro |
| **GitHub Secrets** | Configurados en repo `LinguaFox` | Configurados en repo `AjedrezPro` |
| **VersionCode** | Independiente (actualmente `4`) | Independiente (según historial de AjedrezPro en Play Store) |
| **App en Play Console** | Entrada "LinguaFox" | Entrada "AjedrezPro" |
| **Permisos de Service Account** | Permiso sobre `com.kepabilbao.linguafox` | Permiso sobre el paquete de AjedrezPro |
| **Metadata de la Tienda** | Textos e imágenes de LinguaFox | Textos e imágenes de AjedrezPro |

---

## 3. Configuración de Google Play Developer API (Service Account)

Para activar la subida automática a la pista de **Internal Testing** en GitHub Actions:

### Paso A: Crear Service Account en Google Cloud
1. Entra en [Google Play Console](https://play.google.com/console) → **Configuración** → **Acceso a la API**.
2. Haz clic en **Vincular proyecto de Google Cloud** (o selecciona el proyecto existente).
3. En la sección **Cuentas de servicio**, haz clic en **Crear cuenta de servicio** y sigue el enlace a Google Cloud Console.
4. En Google Cloud Console, crea una cuenta de servicio (ejemplo: `github-actions-publisher@tu-proyecto.iam.gserviceaccount.com`).
5. Genera una clave en formato **JSON** y descárgala en tu ordenador de forma segura.

### Paso B: Conceder Permisos en Google Play Console
1. Vuelve a Google Play Console → **Acceso a la API**.
2. En la lista de cuentas de servicio, localiza la recién creada y pulsa **Gestionar permisos de Play Console** (o **Invitar usuario**).
3. En la pestaña **Permisos de la aplicación**:
   - Selecciona la app (`LinguaFox` o `AjedrezPro`).
   - Concede permisos para:
     - *Gestionar pistas de prueba y editar listas de testers*.
     - *Lanzar versiones a pistas de prueba cerrada / interna*.
     - *Crear, editar y eliminar versiones borrador*.
4. Guarda los cambios.

### Paso C: Añadir el Secreto a GitHub
1. En el repositorio de GitHub (`kepabilbao67-bot/LinguaFox`), ve a **Settings** → **Secrets and variables** → **Actions**.
2. Crea un nuevo secreto:
   - **Nombre:** `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
   - **Valor:** Pega el contenido completo del archivo JSON descargado en el Paso A.
3. En la siguiente ejecución del workflow, el paso de Google Play detectará el secreto y publicará el AAB directamente en la pista **Internal Testing**.

---

## 4. Checklist para Replicar en AjedrezPro

1. [ ] Crear la carpeta `plugins/` en AjedrezPro y copiar `with-release-signing.js`.
2. [ ] Crear `scripts/configure-android-signing.js`.
3. [ ] Añadir `"./plugins/with-release-signing.js"` a `plugins` en el `app.json` de AjedrezPro.
4. [ ] Exportar la keystore de AjedrezPro (desde EAS mediante `eas credentials` o local) y codificarla en Base64:
   ```bash
   # En Windows PowerShell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("ruta/a/ajedrezpro-keystore.jks")) | Set-Clipboard
   ```
5. [ ] Configurar los 4 secretos en el repositorio de AjedrezPro:
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
6. [ ] Adaptar `.github/workflows/build-android.yml` con:
   - El `EXPECTED_SHA256` correspondiente a la keystore de AjedrezPro.
   - El `packageName` de AjedrezPro en el paso de Google Play.
   - El nombre del artefacto: `AjedrezPro-Release.aab`.
7. [ ] Conceder acceso a la Service Account de Google Play a la app de AjedrezPro y configurar el secreto `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`.
