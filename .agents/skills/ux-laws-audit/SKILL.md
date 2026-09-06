---
name: ux-laws-audit
description: Evaluates screens, flows, and components against the 18 Laws of UX and cognitive psychology principles (Fitts, Hick, Jakob, Miller, Proximity, Similarity, Common Region, Von Restorff, Peak-End, Doherty, Zeigarnik, Goal-Gradient, Occam, Tesler, Pareto, Postel, etc.).
---

# UX Laws & Cognitive Interface Audit Skill

Procedimiento estandarizado y verificable para auditar pantallas, flujos y componentes bajo los principios fundamentales de psicología cognitiva y ergonomía digital (Laws of UX).

## 1. Entrada (Input)
- **Pantalla, flujo o componente bajo revisión**: Ruta del archivo TSX (e.g. `src/components/screens/home-screen.tsx`, `quiz-screen.tsx`, etc.).
- **Nivel de usuario objetivo**: Estudiante de idiomas (A1–C2), público general y niños (Kids Mode).
- **Entorno de ejecución**: Dispositivo móvil táctil (iOS / Android) y Web accesible.

---

## 2. Proceso de Evaluación (Process)

El auditor o agente debe contrastar sistemáticamente la vista contra las 18 leyes cognitivas:

1. **Fitts's Law**:
   - Touch targets de acciones principales >= 44x44 dp.
   - Separación entre botones destructivos y primarios >= 12 dp.
   - Colocación accesible para pulgares (zona inferior / central en móvil).
2. **Hick's Law**:
   - Límite de opciones directas simultáneas (<= 5-7 por nivel visual).
   - Progressive disclosure para configuraciones avanzadas.
   - CTA principal identificable en menos de 2 segundos.
3. **Jakob's Law**:
   - Uso de convenciones familiares (atrás en esquina superior izquierda, tabs inferiores, modales de confirmación estándar, audio play/pause).
4. **Miller's Law / Working Memory**:
   - Chunking de información en unidades pequeñas (3-5 elementos por bloque).
   - Sin exigir memorización entre pantallas cuando el contexto puede mantenerse visible.
5. **Law of Proximity**:
   - Etiquetas junto a sus campos, descripciones inmediatamente bajo su título.
   - Espaciado entre grupos no relacionados mayor que el espaciado intra-grupo.
6. **Law of Similarity**:
   - Botones primarios comparten tono, forma y elevación.
   - Estados deshabilitados, seleccionados y activos visualmente coherentes en toda la app.
7. **Law of Common Region**:
   - Uso intencionado de cards o paneles para delimitar dominios funcionales.
   - Evitar "carditis" (anidamiento excesivo de cajas dentro de cajas).
8. **Aesthetic-Usability Effect**:
   - Estética premium que eleve la confianza sin maquillar fallos funcionales ni retrasar la interacción.
9. **Von Restorff Effect**:
   - Máximo 1 acción hiper-destacada por pantalla (el CTA primario no compite con otros 3 botones iguales).
10. **Serial Position Effect**:
    - Opciones críticas ubicadas al inicio (primacía) o al final (recencia).
11. **Peak-End Rule**:
    - Final de lección, logro, racha o victoria celebrado con feedback háptico, visual y emocional gratificante.
12. **Zeigarnik Effect**:
    - Indicadores claros de tarea incompleta ("3/5 lecciones listas", "1 reto pendiente") sin manipulación ni ansiedad artificial.
13. **Goal-Gradient Effect**:
    - El progreso se vuelve más visible y motivador conforme el alumno se acerca a la meta (barras de XP, coronas de nivel).
14. **Doherty Threshold**:
    - Feedback táctil/visual inmediato (< 100 ms) en cada pulsación (haptics, cambio de opacidad o escala con spring).
    - Spinners o esqueletos visibles ante cualquier operación asíncrona.
15. **Occam's Razor**:
    - Eliminar pantallas intermedias, botones redundantes o configuraciones innecesarias si la solución directa es más limpia.
16. **Tesler's Law**:
    - El sistema asume la complejidad (detección de idioma, guardado automático, persistencia resiliente, selección de siguiente lección automática).
17. **Pareto Principle**:
    - El 20% de acciones que generan el 80% del valor de aprendizaje (Continuar Lección, Conversación IA, Repaso) ocupan el lugar preferente.
18. **Postel's Law**:
    - Tolerancia con entradas del usuario (trim de espacios, normalización de tildes en respuestas escritas) y salidas rigurosas y consistentes.

---

## 3. Validaciones & Severidades (Validations)

Cada hallazgo se clasifica en una de 4 categorías de severidad:
- **`CRITICAL`**: Bloquea la acción principal, genera pérdida de progreso o imposibilita el uso táctil (touch target < 28 dp en CTA obligatorio).
- **`HIGH`**: Sobrecarga cognitiva severa (violación de Hick/Miller con > 10 opciones simultáneas sin jerarquía) o falta de feedback perceptible (Doherty).
- **`MEDIUM`**: Inconsistencia visual de similitud o proximidad débil que confunde la relación entre elementos.
- **`LOW`**: Micro-optimizaciones cosméticas o espaciado menor que no altera la tasa de éxito.

---

## 4. Salida (Output)

La skill genera un dictamen estructurado:
- **Veredicto global**: `PASS` | `PARTIAL` | `FAIL`
- **Métrica de tiempo hasta CTA**: <= 2s | > 2s
- **Tabla de hallazgos ordenados por impacto**:
  - `LAW`: Ley de UX violada o destacada.
  - `PROBLEMA`: Descripción precisa del síntoma.
  - `SEVERIDAD`: CRITICAL / HIGH / MEDIUM / LOW.
  - `IMPACTO`: Efecto en el usuario y tasa de abandono.
  - `CORRECCIÓN`: Solución en código sugerida o aplicada.
  - `EVIDENCIA`: Fragmento de código o captura relevante.
