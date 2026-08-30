import type { Unit } from '@/types/learning';

export const UNIT_9: Unit = {
  "id": "u9",
  "level": "C1",
  "title": "Expresiones Idiomáticas",
  "description": "Habla como un nativo con idioms",
  "color": "#e84393",
  "lessons": [
    {
      "id": "u9l1",
      "unitId": "u9",
      "title": "Idioms del Día a Día",
      "description": "Idioms del Día a Día en inglés",
      "icon": "🎯",
      "language": "en",
      "level": "C1",
      "words": [
        {
          "id": "break-the-ice",
          "source": "break the ice",
          "translation": "romper el hielo"
        },
        {
          "id": "hit-the-nail-on-the-head",
          "source": "hit the nail on the head",
          "translation": "dar en el clavo"
        },
        {
          "id": "a-piece-of-cake",
          "source": "a piece of cake",
          "translation": "pan comido"
        },
        {
          "id": "cost-an-arm-and-a-leg",
          "source": "cost an arm and a leg",
          "translation": "costar un ojo de la cara"
        },
        {
          "id": "once-in-a-blue-moon",
          "source": "once in a blue moon",
          "translation": "de higos a brevas"
        },
        {
          "id": "under-the-weather",
          "source": "under the weather",
          "translation": "sentirse mal / pachucho"
        }
      ],
      "vocab": [
        {
          "en": "break the ice",
          "es": "romper el hielo"
        },
        {
          "en": "hit the nail on the head",
          "es": "dar en el clavo"
        },
        {
          "en": "a piece of cake",
          "es": "pan comido"
        },
        {
          "en": "cost an arm and a leg",
          "es": "costar un ojo de la cara"
        },
        {
          "en": "once in a blue moon",
          "es": "de higos a brevas"
        },
        {
          "en": "under the weather",
          "es": "sentirse mal / pachucho"
        }
      ],
      "exercises": [
        {
          "id": "u9l1e1",
          "type": "multipleChoice",
          "prompt": "¿Qué significa \"a piece of cake\"?",
          "question": "The exam was a piece of cake",
          "audioText": "The exam was a piece of cake",
          "options": [
            "Fue pan comido",
            "Fue un desastre",
            "Fue largo",
            "Fue aburrido"
          ],
          "answer": "Fue pan comido"
        },
        {
          "id": "u9l1e2",
          "type": "fillBlank",
          "prompt": "Completa el idiom",
          "sentence": "That new car must have cost ___.",
          "audioText": "That new car must have cost an arm and a leg",
          "options": [
            "an arm and a leg",
            "a piece of cake",
            "the ice",
            "a blue moon"
          ],
          "answer": "an arm and a leg",
          "translation": "Ese coche nuevo debe haber costado un ojo de la cara."
        },
        {
          "id": "u9l1e3",
          "type": "translate",
          "prompt": "Traduce usando el idiom correcto",
          "sourceText": "El chiste rompió el hielo en la reunión",
          "audioText": "The joke broke the ice at the meeting",
          "wordBank": [
            "The",
            "joke",
            "broke",
            "the",
            "ice",
            "at",
            "meeting",
            "hit",
            "nail"
          ],
          "answerWords": [
            "The",
            "joke",
            "broke",
            "the",
            "ice",
            "at",
            "the",
            "meeting"
          ]
        },
        {
          "id": "u9l1e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "I only see her once in a blue moon",
          "options": [
            "I only see her once in a blue moon",
            "She hit the nail on the head",
            "I feel under the weather today",
            "That was a piece of cake"
          ],
          "answer": "I only see her once in a blue moon"
        },
        {
          "id": "u9l1e5",
          "type": "speak",
          "prompt": "Pronuncia este idiom",
          "audioText": "You hit the nail on the head with that comment",
          "translation": "Diste en el clavo con ese comentario"
        },
        {
          "id": "u9l1e6",
          "type": "match",
          "prompt": "Empareja los idioms con su significado",
          "pairs": [
            {
              "en": "a piece of cake",
              "es": "pan comido"
            },
            {
              "en": "break the ice",
              "es": "romper el hielo"
            },
            {
              "en": "under the weather",
              "es": "sentirse mal"
            },
            {
              "en": "once in a blue moon",
              "es": "de higos a brevas"
            }
          ]
        }
      ]
    },
    {
      "id": "u9l2",
      "unitId": "u9",
      "title": "Idioms de Trabajo",
      "description": "Idioms de Trabajo en inglés",
      "icon": "🏢",
      "language": "en",
      "level": "C1",
      "words": [
        {
          "id": "think-outside-the-box",
          "source": "think outside the box",
          "translation": "pensar de forma creativa"
        },
        {
          "id": "get-the-ball-rolling",
          "source": "get the ball rolling",
          "translation": "poner las cosas en marcha"
        },
        {
          "id": "back-to-square-one",
          "source": "back to square one",
          "translation": "volver al punto de partida"
        },
        {
          "id": "the-bottom-line",
          "source": "the bottom line",
          "translation": "lo fundamental / en resumen"
        },
        {
          "id": "cut-corners",
          "source": "cut corners",
          "translation": "tomar atajos / hacer chapuzas"
        }
      ],
      "vocab": [
        {
          "en": "think outside the box",
          "es": "pensar de forma creativa"
        },
        {
          "en": "get the ball rolling",
          "es": "poner las cosas en marcha"
        },
        {
          "en": "back to square one",
          "es": "volver al punto de partida"
        },
        {
          "en": "the bottom line",
          "es": "lo fundamental / en resumen"
        },
        {
          "en": "cut corners",
          "es": "tomar atajos / hacer chapuzas"
        }
      ],
      "exercises": [
        {
          "id": "u9l2e1",
          "type": "multipleChoice",
          "prompt": "¿Qué significa \"cut corners\"?",
          "question": "cut corners",
          "audioText": "cut corners",
          "options": [
            "tomar atajos",
            "cortar esquinas",
            "ser creativo",
            "empezar de nuevo"
          ],
          "answer": "tomar atajos"
        },
        {
          "id": "u9l2e2",
          "type": "fillBlank",
          "prompt": "Completa con el idiom correcto",
          "sentence": "Let's ___ and start the project today.",
          "audioText": "Let's get the ball rolling and start the project today",
          "options": [
            "get the ball rolling",
            "cut corners",
            "think outside the box",
            "go back to square one"
          ],
          "answer": "get the ball rolling",
          "translation": "Pongamos las cosas en marcha y empecemos el proyecto hoy."
        },
        {
          "id": "u9l2e3",
          "type": "translate",
          "prompt": "Traduce usando el idiom",
          "sourceText": "Necesitamos pensar de forma creativa",
          "audioText": "We need to think outside the box",
          "wordBank": [
            "We",
            "need",
            "to",
            "think",
            "outside",
            "the",
            "box",
            "cut",
            "corners"
          ],
          "answerWords": [
            "We",
            "need",
            "to",
            "think",
            "outside",
            "the",
            "box"
          ]
        },
        {
          "id": "u9l2e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "The bottom line is we need more funding",
          "options": [
            "The bottom line is we need more funding",
            "We need to think outside the box",
            "Let us get the ball rolling",
            "We are back to square one"
          ],
          "answer": "The bottom line is we need more funding"
        },
        {
          "id": "u9l2e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "After the failure, we were back to square one",
          "translation": "Después del fracaso, volvimos al punto de partida"
        },
        {
          "id": "u9l2e6",
          "type": "match",
          "prompt": "Empareja los idioms de trabajo",
          "pairs": [
            {
              "en": "think outside the box",
              "es": "ser creativo"
            },
            {
              "en": "get the ball rolling",
              "es": "poner en marcha"
            },
            {
              "en": "cut corners",
              "es": "tomar atajos"
            },
            {
              "en": "the bottom line",
              "es": "lo fundamental"
            }
          ]
        }
      ]
    }
  ]
};
