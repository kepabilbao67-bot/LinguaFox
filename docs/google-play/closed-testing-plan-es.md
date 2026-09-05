# Plan Operativo de Prueba Cerrada (Closed Testing) — LinguaFox

Guía paso a paso para configurar y superar con éxito la fase obligatoria de prueba cerrada exigida por Google Play para cuentas personales de desarrollador creadas a partir de noviembre de 2023.

---

## 1. Requisitos Obligatorios de Google Play para Cuentas Personales

- **Número mínimo de testers activos:** Al menos **12 testers continuos** (Google recomienda registrar entre 15 y 20 testers para asegurar que el mínimo de 12 se mantenga activo todos los días).
- **Duración obligatoria:** Al menos **14 días consecutivos** con los evaluadores inscritos y participando en la prueba.
- **Acceso a producción:** Solo tras completar los 14 días con éxito, Google Play Console habilitará el botón para solicitar acceso a la pista de Producción (*Apply for production*).

---

## 2. Paso 1: Crear la Pista de Prueba Cerrada en Google Play Console

1. En el menú lateral izquierdo de Play Console, ve a **Pruebas** → **Prueba cerrada**.
2. Pulsa en **Crear pista** (o usa la pista por defecto *Prueba cerrada*).
3. Asigna un nombre a la pista (por ejemplo: `Prueba Inicial LinguaFox`).
4. Haz clic en **Crear pista**.

---

## 3. Paso 2: Crear la Lista de Testers

1. Dentro de la pista creada, ve a la pestaña **Evaluadores** (*Testers*).
2. En la sección *Evaluadores*, haz clic en **Crear lista de distribución de correo electrónico**.
3. Pon un nombre a la lista: `Testers LinguaFox`.
4. Añade las direcciones de correo de Google (`@gmail.com` o cuentas de Google Workspace) de tus 15-20 voluntarios/amigos/colaboradores.
5. Pulsa **Guardar cambios**.
6. Selecciona esa lista de correo para asociarla a la pista de prueba cerrada.

---

## 4. Paso 3: Crear el Lanzamiento de la Versión

1. En la misma pantalla de la pista, ve a la pestaña **Lanzamientos** y pulsa **Crear nuevo lanzamiento**.
2. **Subir el AAB:** Arrastra el archivo `LinguaFox-production-v1.0.0.aab` (una vez aprobada la clave de subida por Google Play).
3. **Nombre de la versión:** `1.0.0 (3)`.
4. **Notas de la versión:** Pega el texto preparado en [docs/google-play/release-notes-final-es.md](file:///c:/Users/foca-/OneDrive/Escritorio/01_PROYECTOS_ACTIVOS/LinguaFox/docs/google-play/release-notes-final-es.md).
5. Pulsa **Siguiente**, revisa las advertencias y haz clic en **Guardar** y **Iniciar lanzamiento a Prueba cerrada**.

---

## 5. Paso 4: Obtener el Enlace de Invitación para los Testers

1. Vuelve a la pestaña **Evaluadores** de la pista de prueba cerrada.
2. Al final de la página, en la sección *Cómo se unen los evaluadores a la prueba*, verás dos enlaces:
   - **Enlace para unirse en la Web** (`https://play.google.com/apps/testing/com.kepabilbao.linguafox`).
   - **Enlace para unirse en Android**.
3. Copia el enlace web.

---

## 6. Paso 5: Mensaje para Enviar a los Testers (Plantilla Lista para Copiar)

Envía este mensaje por WhatsApp, Telegram o correo a tus testers:

```text
¡Hola! Necesito tu ayuda como tester voluntario para el lanzamiento de mi aplicación educativa de idiomas "LinguaFox" en Google Play Store.

Solo requiere 3 sencillos pasos:
1. Abre este enlace con tu cuenta de Google:
   https://play.google.com/apps/testing/com.kepabilbao.linguafox
2. Pulsa en el botón azul "Convertirse en tester" ("Become a tester").
3. Haz clic en "Descárgala en Google Play" e instala la app en tu teléfono Android.

IMPORTANTE PARA AYUDARME:
- Mantén la app instalada en tu teléfono durante al menos 14 días consecutivos.
- Ábrela de vez en cuando (un par de minutos al día) para probar alguna lección o hablar con el tutor Fox.
- Si ves cualquier fallo o sugerencia, avísame.

¡Muchísimas gracias por tu apoyo!
```

---

## 7. Paso 6: Qué Comprobar Durante los 14 Días

1. En el panel principal de Play Console verás una tarjeta de cuenta atrás: **"Progreso de la prueba cerrada"**.
2. Google registrará los días transcurridos y el número de testers que han aceptado la invitación y mantienen la app instalada.
3. Si un tester desinstala la app o abandona la prueba, el contador de testers activos bajará; asegúrate de tener al menos 15 testers aceptados para tener un margen seguro por encima de 12.

---

## 8. Paso 7: Qué Hacer al Cumplir los 14 Días

1. Cuando la tarjeta de Google Play marque los 14 días completados con el mínimo de testers requerido, se desbloqueará el botón **"Solicitar acceso a producción"** (*Apply for production*).
2. Google te hará un breve cuestionario de 4 preguntas sobre la prueba (qué comentarios recibiste, cómo corregiste los errores y por qué tu app está lista para el público general).
3. Rellenadas esas preguntas, Google revisará la solicitud y abrirá la pista de Producción pública para publicar LinguaFox en la tienda oficial.
