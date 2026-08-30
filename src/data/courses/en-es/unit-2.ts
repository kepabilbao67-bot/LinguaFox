import type { Unit } from '@/types/learning';

export const UNIT_2: Unit = {
  "id": "u2",
  "level": "A1",
  "title": "Familia y Personas",
  "description": "Vocabulario de la familia",
  "color": "#1cb0f6",
  "lessons": [
    {
      "id": "u2l1",
      "unitId": "u2",
      "title": "La Familia",
      "description": "La Familia en inglés",
      "icon": "👨‍👩‍👧",
      "language": "en",
      "level": "A1",
      "words": [
        {
          "id": "mother",
          "source": "mother",
          "translation": "madre"
        },
        {
          "id": "father",
          "source": "father",
          "translation": "padre"
        },
        {
          "id": "sister",
          "source": "sister",
          "translation": "hermana"
        },
        {
          "id": "brother",
          "source": "brother",
          "translation": "hermano"
        },
        {
          "id": "child",
          "source": "child",
          "translation": "niño/a"
        }
      ],
      "vocab": [
        {
          "en": "mother",
          "es": "madre",
          "ipa": "/ˈmʌðər/"
        },
        {
          "en": "father",
          "es": "padre",
          "ipa": "/ˈfɑːðər/"
        },
        {
          "en": "sister",
          "es": "hermana",
          "ipa": "/ˈsɪstər/"
        },
        {
          "en": "brother",
          "es": "hermano",
          "ipa": "/ˈbrʌðər/"
        },
        {
          "en": "child",
          "es": "niño/a",
          "ipa": "/tʃaɪld/"
        }
      ],
      "exercises": [
        {
          "id": "u2l1e1",
          "type": "multipleChoice",
          "prompt": "Selecciona la traducción correcta",
          "question": "mother",
          "audioText": "mother",
          "options": [
            "padre",
            "madre",
            "hermana",
            "hijo"
          ],
          "answer": "madre"
        },
        {
          "id": "u2l1e2",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "brother",
          "options": [
            "brother",
            "mother",
            "father",
            "sister"
          ],
          "answer": "brother"
        },
        {
          "id": "u2l1e3",
          "type": "match",
          "prompt": "Empareja las palabras",
          "pairs": [
            {
              "en": "mother",
              "es": "madre"
            },
            {
              "en": "father",
              "es": "padre"
            },
            {
              "en": "sister",
              "es": "hermana"
            },
            {
              "en": "brother",
              "es": "hermano"
            }
          ]
        },
        {
          "id": "u2l1e4",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Mi hermana",
          "audioText": "my sister",
          "wordBank": [
            "my",
            "sister",
            "brother",
            "your"
          ],
          "answerWords": [
            "my",
            "sister"
          ]
        },
        {
          "id": "u2l1e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "my father and mother",
          "translation": "mi padre y madre"
        }
      ]
    },
    {
      "id": "u2l2",
      "unitId": "u2",
      "title": "Descripciones",
      "description": "Descripciones en inglés",
      "icon": "🧑",
      "language": "en",
      "level": "A1",
      "words": [
        {
          "id": "tall",
          "source": "tall",
          "translation": "alto"
        },
        {
          "id": "short",
          "source": "short",
          "translation": "bajo"
        },
        {
          "id": "young",
          "source": "young",
          "translation": "joven"
        },
        {
          "id": "old",
          "source": "old",
          "translation": "viejo"
        },
        {
          "id": "friendly",
          "source": "friendly",
          "translation": "amable"
        }
      ],
      "vocab": [
        {
          "en": "tall",
          "es": "alto",
          "ipa": "/tɔːl/"
        },
        {
          "en": "short",
          "es": "bajo",
          "ipa": "/ʃɔːrt/"
        },
        {
          "en": "young",
          "es": "joven",
          "ipa": "/jʌŋ/"
        },
        {
          "en": "old",
          "es": "viejo",
          "ipa": "/oʊld/"
        },
        {
          "en": "friendly",
          "es": "amable",
          "ipa": "/ˈfrendli/"
        }
      ],
      "exercises": [
        {
          "id": "u2l2e1",
          "type": "multipleChoice",
          "prompt": "Selecciona la traducción correcta",
          "question": "tall",
          "audioText": "tall",
          "options": [
            "bajo",
            "alto",
            "viejo",
            "joven"
          ],
          "answer": "alto"
        },
        {
          "id": "u2l2e2",
          "type": "fillBlank",
          "prompt": "Completa la oración",
          "sentence": "She is very ___.",
          "audioText": "She is very friendly",
          "options": [
            "friendly",
            "table",
            "water",
            "house"
          ],
          "answer": "friendly",
          "translation": "Ella es muy amable."
        },
        {
          "id": "u2l2e3",
          "type": "match",
          "prompt": "Empareja los opuestos",
          "pairs": [
            {
              "en": "tall",
              "es": "alto"
            },
            {
              "en": "short",
              "es": "bajo"
            },
            {
              "en": "young",
              "es": "joven"
            },
            {
              "en": "old",
              "es": "viejo"
            }
          ]
        },
        {
          "id": "u2l2e4",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Mi hermano es alto",
          "audioText": "my brother is tall",
          "wordBank": [
            "my",
            "brother",
            "is",
            "tall",
            "short",
            "she"
          ],
          "answerWords": [
            "my",
            "brother",
            "is",
            "tall"
          ]
        },
        {
          "id": "u2l2e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "She is young and friendly",
          "translation": "Ella es joven y amable"
        }
      ]
    }
  ]
};
