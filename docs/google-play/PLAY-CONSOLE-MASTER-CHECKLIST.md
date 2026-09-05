# Lista Maestra de Configuración en Google Play Console — LinguaFox

Guía secuencial optimizada para que Kepa solo tenga que realizar los clics humanos inevitables en Google Play Console. Todo el material técnico y textual ha sido generado, auditado y validado previamente por Antigravity.

---

## FASE 0: Desbloqueo Previo de Clave de Firma (En Progreso)

### [ ] 0.1 Esperar Aprobación de la Clave de Subida
- **VALOR EXACTO:** Certificado PEM generado con huella SHA-1 `59:62:9D:4E:...` y SHA-256 `37:38:1D:5F:...`
- **ARCHIVO:** `LinguaFox-upload-certificate.pem`
- **RUTA:** `C:\Users\foca-\Downloads\LinguaFox-upload-certificate.pem`
- **ESTADO:** **SOLICITUD ENVIADA A GOOGLE PLAY / PENDIENTE DE RESOLUCIÓN POR GOOGLE**
- **BLOQUEO:** Google suele tardar entre 24 y 48 horas en procesar el restablecimiento de clave de subida.
- **ACCIÓN DE ANTIGRAVITY:** Certificado extraído directamente del keystore oficial de EAS y validado.
- **ACCIÓN HUMANA DE KEPA:** Ninguna en este momento (no cancelar la solicitud en curso).
- **SIGUIENTE PASO:** En cuanto Google apruebe el cambio, el AAB actual podrá ser subido sin error de firma.

---

## FASE 1: Ficha Principal de la Tienda (Completamente Desbloqueada)

### [ ] 1.1 Introducir Metadatos de la Aplicación
- **VALOR EXACTO:** Nombre: `LinguaFox` | Descripción corta (78 car): `Aprende idiomas a tu ritmo con lecciones interactivas, práctica y tutor local.` | Descripción completa: 2.140 car.
- **ARCHIVO:** [docs/google-play/store-listing-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/store-listing-final-es.md)
- **RUTA:** `docs/google-play/store-listing-final-es.md`
- **ESTADO:** **LISTO PARA COPIAR Y PEGAR**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Texto redactado, validado en longitud, sin reclamos falsos de IA/micrófono.
- **ACCIÓN HUMANA DE KEPA:** Copiar y pegar los 3 textos en **Presencia en la tienda** → **Ficha de la tienda principal**.
- **SIGUIENTE PASO:** Subir los recursos gráficos de la tienda.

### [ ] 1.2 Subir Icono de Alta Resolución
- **VALOR EXACTO:** 512 x 512 px, PNG 32-bit, 250 KB
- **ARCHIVO:** `icon-play-512.png`
- **RUTA:** [assets/store/google-play/icon-play-512.png](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/assets/store/google-play/icon-play-512.png)
- **ESTADO:** **LISTO FÍSICAMENTE**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Verificadas dimensiones y formato.
- **ACCIÓN HUMANA DE KEPA:** Arrastrar el archivo a la casilla del icono en la ficha de la tienda.
- **SIGUIENTE PASO:** Subir el gráfico de funciones.

### [ ] 1.3 Subir Gráfico de Funciones (Feature Graphic)
- **VALOR EXACTO:** 1024 x 500 px, PNG 24-bit, 227 KB
- **ARCHIVO:** `feature-graphic-1024x500.png`
- **RUTA:** [assets/store/google-play/feature-graphic-1024x500.png](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/assets/store/google-play/feature-graphic-1024x500.png)
- **ESTADO:** **LISTO FÍSICAMENTE**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Verificadas dimensiones y formato exactos.
- **ACCIÓN HUMANA DE KEPA:** Arrastrar el archivo al campo *Gráfico de funciones*.
- **SIGUIENTE PASO:** Subir capturas de pantalla de móvil.

### [ ] 1.4 Subir Capturas de Pantalla de Móvil (Mínimo 2)
- **VALOR EXACTO:** Entre 320 px y 3.840 px, relación 9:16 o 16:9
- **CARPETA PREPARADA:** [docs/google-play/final-upload-assets/](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/final-upload-assets/)
- **ARCHIVOS ACTUALES:** `01-portada-promocional.png` (1 captura disponible)
- **ESTADO:** **FALTAN 2-4 CAPTURAS REALES DE LA APP** (Google exige al menos 2)
- **BLOQUEO:** Google Play no permite guardar la ficha sin al menos 2 capturas de teléfono.
- **ACCIÓN DE ANTIGRAVITY:** Carpeta unificada creada con icono, feature graphic y captura promocional listos.
- **ACCIÓN HUMANA DE KEPA:** Abrir la app en el móvil, hacer 2-4 capturas (Home, Lección, Chat, Progreso) y guardarlas en `docs/google-play/final-upload-assets/`.
- **SIGUIENTE PASO:** Subir todas las capturas a Play Console y guardar la ficha.

---

## FASE 2: Contenido de la Aplicación y Políticas (Completamente Desbloqueada)

### [ ] 2.1 Enlazar la Política de Privacidad
- **VALOR EXACTO:** `https://kepabilbao67-bot.github.io/LinguaFox/privacy.html`
- **ARCHIVO:** [docs/google-play/privacy-review-final.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/privacy-review-final.md)
- **ESTADO:** **VERIFICADA Y ACTIVA (HTTP 200 OK)**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Verificación de respuesta HTTP remota y auditoría de coherencia legal con el código.
- **ACCIÓN HUMANA DE KEPA:** Pegar la URL en **Políticas** → **Contenido de la aplicación** → **Política de privacidad**.
- **SIGUIENTE PASO:** Rellenar la sección de Acceso a la aplicación.

### [ ] 2.2 Declarar Acceso a la Aplicación (App Access)
- **VALOR EXACTO:** *"Todas las funciones están disponibles sin restricciones ni credenciales de inicio de sesión"*
- **ARCHIVO:** [docs/google-play/app-access-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/app-access-final-es.md)
- **ESTADO:** **LISTO**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Verificado que la app no tiene login ni áreas privadas bloqueadas.
- **ACCIÓN HUMANA DE KEPA:** Marcar la opción y pulsar **Guardar**.
- **SIGUIENTE PASO:** Declarar Anuncios.

### [ ] 2.3 Declarar Anuncios (Ads)
- **VALOR EXACTO:** *"No, mi aplicación no contiene anuncios"*
- **ARCHIVO:** [docs/google-play/app-content-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/app-content-final-es.md)
- **ESTADO:** **LISTO**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Verificado en dependencias (cero AdMob/redes de anuncios).
- **ACCIÓN HUMANA DE KEPA:** Marcar *No* y pulsar **Guardar**.
- **SIGUIENTE PASO:** Cumplimentar Cuestionario IARC.

### [ ] 2.4 Cuestionario de Clasificación de Contenido (IARC)
- **VALOR EXACTO:** Correo: `pedrobilbao93@gmail.com` | Categoría: Educación | Responder **NO** a todas las preguntas de violencia, sexo, drogas, apuestas, UGC y ubicación.
- **ARCHIVO:** [docs/google-play/content-rating-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/content-rating-final-es.md)
- **ESTADO:** **LISTO** (Calificación esperada: PEGI 3 / Everyone).
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Mapeo exhaustivo de respuestas frente al contenido real de las lecciones.
- **ACCIÓN HUMANA DE KEPA:** Rellenar el cuestionario siguiendo la tabla y hacer clic en **Enviar**.
- **SIGUIENTE PASO:** Declarar Público Objetivo.

### [ ] 2.5 Declarar Público Objetivo y Familias
- **VALOR EXACTO:** Marcar: **13-15**, **16-17**, **18 y más** | ¿Atrae involuntariamente a niños?: **NO**.
- **ARCHIVO:** [docs/google-play/target-audience-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/target-audience-final-es.md)
- **ESTADO:** **LISTO**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Análisis de políticas de familias para evitar revisiones excesivas.
- **ACCIÓN HUMANA DE KEPA:** Marcar casillas indicadas y pulsar **Guardar**.
- **SIGUIENTE PASO:** Cuestionario de Seguridad de los Datos.

### [ ] 2.6 Cuestionario de Seguridad de los Datos (Data Safety)
- **VALOR EXACTO:** ¿Recopila o comparte datos?: **NO** | Eliminación de datos: **SÍ** (a través de los ajustes del sistema o desinstalación).
- **ARCHIVO:** [docs/google-play/data-safety-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/data-safety-final-es.md)
- **ESTADO:** **LISTO CON EVIDENCIA TÉCNICA**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Auditoría de red (`fetch`), almacenamiento local (`AsyncStorage`) y dependencias.
- **ACCIÓN HUMANA DE KEPA:** Marcar las respuestas guiadas y pulsar **Guardar**.
- **SIGUIENTE PASO:** Declaraciones Especiales (Gobierno, Noticias, Salud, Finanzas, ID de Publicidad).

### [ ] 2.7 Declaraciones Especiales y Directivas Restantes
- **VALOR EXACTO:** Noticias: NO | Gubernamental: NO | Salud: NO | Finanzas: NO | ID de publicidad: NO.
- **ARCHIVO:** [docs/google-play/app-content-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/app-content-final-es.md)
- **ESTADO:** **LISTO**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Mapeadas todas las secciones complementarias.
- **ACCIÓN HUMANA DE KEPA:** Completar cada tarjeta marcando *No* y guardar.
- **SIGUIENTE PASO:** Pasar a la fase de Prueba Cerrada.

---

## FASE 3: Lanzamiento en Prueba Cerrada (Dependiente de Aprobación de Clave)

### [ ] 3.1 Subir el AAB de Producción
- **VALOR EXACTO:** Paquete `com.kepabilbao.linguafox` | VersionCode `3` | Tamaño: `75.38 MB`
- **ARCHIVO:** `LinguaFox-production-v1.0.0.aab`
- **RUTA:** `C:\Users\foca-\Downloads\LinguaFox-production-v1.0.0.aab`
- **ESTADO:** **DESCARGADO E INSPECCIONADO FÍSICAMENTE**
- **BLOQUEO:** Esperar confirmación del cambio de clave de subida por Google Play.
- **ACCIÓN DE ANTIGRAVITY:** Verificados paquete, código de versión y firma criptográfica.
- **ACCIÓN HUMANA DE KEPA:** Una vez aprobada la clave por Google, subir el archivo a **Pruebas** → **Prueba cerrada** → **Crear lanzamiento**.
- **SIGUIENTE PASO:** Incluir notas de la versión.

### [ ] 3.2 Añadir Notas de Versión
- **VALOR EXACTO:** 494 caracteres explicando las funciones de la versión 1.0.0
- **ARCHIVO:** [docs/google-play/release-notes-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/release-notes-final-es.md)
- **ESTADO:** **LISTO**
- **BLOQUEO:** Ninguno.
- **ACCIÓN DE ANTIGRAVITY:** Redactadas notas de lanzamiento en español dentro del límite de 500 caracteres.
- **ACCIÓN HUMANA DE KEPA:** Pegar el texto en el campo *Notas de la versión*.
- **SIGUIENTE PASO:** Iniciar lanzamiento en prueba cerrada.

### [ ] 3.3 Registrar Testers y Distribuir Enlace
- **VALOR EXACTO:** Mínimo 12 testers activos durante 14 días (recomendado registrar 15-20 correos).
- **ARCHIVO:** [docs/google-play/closed-testing-plan-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/closed-testing-plan-es.md)
- **ESTADO:** **PLAN OPERATIVO Y MENSAJE DE DIFUSIÓN LISTOS**
- **BLOQUEO:** Ninguno una vez lanzado el release.
- **ACCIÓN DE ANTIGRAVITY:** Plantilla de mensaje para testers y checklist de seguimiento diario redactados.
- **ACCIÓN HUMANA DE KEPA:** Añadir correos de evaluadores y enviarles el mensaje prediseñado.
- **SIGUIENTE PASO:** Al cumplirse los 14 días, pulsar *"Solicitar acceso a producción"*.
