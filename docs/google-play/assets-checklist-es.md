# Requisitos y Lista de Recursos Gráficos para Google Play Store — LinguaFox

Especificaciones técnicas y recomendaciones de diseño para los activos visuales requeridos en la ficha principal de Google Play Console.

---

## 1. Icono de la Aplicación para la Tienda
- **Dimensiones exactas:** 512 x 512 píxeles.
- **Formato:** PNG de 32 bits (con canal alfa).
- **Peso máximo:** 1024 KB (1 MB).
- **Diseño:** Logotipo oficial de LinguaFox centrado, con bordes limpios y sin esquinas redondeadas previas (Google Play aplica automáticamente el radio de curvatura y la sombra).
- **Estado en repositorio:** Base disponible en `assets/images/icon.png` (adaptable a 512x512).

---

## 2. Gráfico de Funciones (Feature Graphic / Banner de Cabecera)
- **Dimensiones exactas:** 1024 x 500 píxeles.
- **Formato:** JPG o PNG de 24 bits (sin canal alfa).
- **Peso máximo:** 15 MB.
- **Recomendaciones de diseño:**
  - Fondo coherente con la paleta de colores de LinguaFox (tonos oscuros/índigo con acentos vibrantes).
  - Logotipo e ilustración del zorro Fox a un lado.
  - Texto de propuesta de valor conciso y legible (ej. *"Aprende inglés a tu ritmo con lecciones interactivas"*).
  - Dejar un margen de seguridad del 15% en los bordes para evitar recortes en diferentes dispositivos.

---

## 3. Capturas de Pantalla para Teléfono (Móvil)
- **Cantidad requerida por Google Play:** Mínimo 2 capturas (se recomiendan entre 4 y 6 capturas de alta resolución).
- **Dimensiones estándar recomendadas:** `1080 x 2400 px` o `1080 x 1920 px` (relación de aspecto vertical 9:16 o 9:20).
- **Formato:** PNG o JPEG de 24 bits (sin canal alfa).
- **Peso máximo por imagen:** 8 MB.

### Capturas Sugeridas para el Lanzamiento V1:
1. **Captura 1 (Home & Progreso):** Pantalla principal mostrando el nivel, unidades didácticas, racha de días y estrellas acumuladas.
2. **Captura 2 (Lección Interactiva):** Vista de una lección práctica con pronunciación y ejemplos claros.
3. **Captura 3 (Quiz & Corrección Pedagógica):** Ejercicio de autoevaluación mostrando la tarjeta `ErrorExplanationCard` con la explicación didáctica del error.
4. **Captura 4 (Práctica de Escucha):** Pantalla de práctica de escucha de personajes con visualizador de ondas y subtítulos.
5. **Captura 5 (Tutor Fox Local):** Chat interactivo con Fox mostrando sugerencias rápidas y explicaciones en español.

---

## 4. Capturas de Pantalla para Tabletas (Recomendado)
*Dado que `app.json` declara soporte para tabletas (`supportsTablet: true`), aportar capturas específicas mejora el posicionamiento en pantallas grandes.*

- **Tableta de 7 pulgadas:** Mínimo 1 captura (ej. `1200 x 1920 px` o `1920 x 1200 px`).
- **Tableta de 10 pulgadas:** Mínimo 1 captura (ej. `1600 x 2560 px` o `2560 x 1600 px`).

---

## 5. Lista de Verificación (Checklist de Archivos Listos)
- [ ] Icono de alta resolución `icon-512x512.png` exportado y verificado.
- [ ] Gráfico de funciones `feature-graphic-1024x500.png` preparado.
- [ ] 5 capturas de pantalla de móvil reales tomadas directamente de la app en ejecución.
- [ ] Sin marcos de dispositivos obsoletos ni marcas de agua ajenas.
