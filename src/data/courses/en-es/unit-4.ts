import type { Unit } from '@/types/learning';

export const UNIT_4: Unit = {
  "id": "u4",
  "level": "A2",
  "title": "Rutina Diaria",
  "description": "Habla sobre tu día a día",
  "color": "#ce82ff",
  "lessons": [
    {
      "id": "u4l1",
      "unitId": "u4",
      "title": "Mi Día",
      "description": "Mi Día en inglés",
      "icon": "⏰",
      "language": "en",
      "level": "A2",
      "words": [
        {
          "id": "wake-up",
          "source": "wake up",
          "translation": "despertarse"
        },
        {
          "id": "breakfast",
          "source": "breakfast",
          "translation": "desayuno"
        },
        {
          "id": "go-to-work",
          "source": "go to work",
          "translation": "ir al trabajo"
        },
        {
          "id": "have-lunch",
          "source": "have lunch",
          "translation": "almorzar"
        },
        {
          "id": "go-to-bed",
          "source": "go to bed",
          "translation": "acostarse"
        }
      ],
      "vocab": [
        {
          "en": "wake up",
          "es": "despertarse",
          "ipa": "/weɪk ʌp/"
        },
        {
          "en": "breakfast",
          "es": "desayuno",
          "ipa": "/ˈbrekfəst/"
        },
        {
          "en": "go to work",
          "es": "ir al trabajo",
          "ipa": "/ɡoʊ tə wɜːrk/"
        },
        {
          "en": "have lunch",
          "es": "almorzar",
          "ipa": "/hæv lʌntʃ/"
        },
        {
          "en": "go to bed",
          "es": "acostarse",
          "ipa": "/ɡoʊ tə bed/"
        }
      ],
      "exercises": [
        {
          "id": "u4l1e1",
          "type": "multipleChoice",
          "prompt": "Selecciona la traducción correcta",
          "question": "wake up",
          "audioText": "wake up",
          "options": [
            "dormir",
            "despertarse",
            "correr",
            "comer"
          ],
          "answer": "despertarse"
        },
        {
          "id": "u4l1e2",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Yo desayuno a las 8",
          "audioText": "I have breakfast at eight",
          "wordBank": [
            "I",
            "have",
            "breakfast",
            "at",
            "eight",
            "lunch",
            "seven"
          ],
          "answerWords": [
            "I",
            "have",
            "breakfast",
            "at",
            "eight"
          ]
        },
        {
          "id": "u4l1e3",
          "type": "fillBlank",
          "prompt": "Completa la oración",
          "sentence": "I ___ at 7 in the morning.",
          "audioText": "I wake up at seven in the morning",
          "options": [
            "wake up",
            "go to bed",
            "have lunch",
            "go to work"
          ],
          "answer": "wake up",
          "translation": "Me despierto a las 7 de la mañana."
        },
        {
          "id": "u4l1e4",
          "type": "match",
          "prompt": "Empareja las actividades",
          "pairs": [
            {
              "en": "wake up",
              "es": "despertarse"
            },
            {
              "en": "breakfast",
              "es": "desayuno"
            },
            {
              "en": "have lunch",
              "es": "almorzar"
            },
            {
              "en": "go to bed",
              "es": "acostarse"
            }
          ]
        },
        {
          "id": "u4l1e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "I go to work at nine",
          "translation": "Voy al trabajo a las nueve"
        }
      ]
    },
    {
      "id": "u4l2",
      "unitId": "u4",
      "title": "Tiempo Libre",
      "description": "Tiempo Libre en inglés",
      "icon": "🎮",
      "language": "en",
      "level": "A2",
      "words": [
        {
          "id": "play-sports",
          "source": "play sports",
          "translation": "hacer deporte"
        },
        {
          "id": "watch-tv",
          "source": "watch TV",
          "translation": "ver televisión"
        },
        {
          "id": "read-a-book",
          "source": "read a book",
          "translation": "leer un libro"
        },
        {
          "id": "go-for-a-walk",
          "source": "go for a walk",
          "translation": "dar un paseo"
        },
        {
          "id": "cook-dinner",
          "source": "cook dinner",
          "translation": "cocinar la cena"
        }
      ],
      "vocab": [
        {
          "en": "play sports",
          "es": "hacer deporte",
          "ipa": "/pleɪ spɔːrts/"
        },
        {
          "en": "watch TV",
          "es": "ver televisión",
          "ipa": "/wɑːtʃ tiː viː/"
        },
        {
          "en": "read a book",
          "es": "leer un libro",
          "ipa": "/riːd ə bʊk/"
        },
        {
          "en": "go for a walk",
          "es": "dar un paseo",
          "ipa": "/ɡoʊ fɔːr ə wɔːk/"
        },
        {
          "en": "cook dinner",
          "es": "cocinar la cena",
          "ipa": "/kʊk ˈdɪnər/"
        }
      ],
      "exercises": [
        {
          "id": "u4l2e1",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "I like to read a book",
          "options": [
            "I like to read a book",
            "I like to play sports",
            "I watch TV",
            "I cook dinner"
          ],
          "answer": "I like to read a book"
        },
        {
          "id": "u4l2e2",
          "type": "multipleChoice",
          "prompt": "Selecciona la traducción correcta",
          "question": "go for a walk",
          "audioText": "go for a walk",
          "options": [
            "correr",
            "dar un paseo",
            "nadar",
            "bailar"
          ],
          "answer": "dar un paseo"
        },
        {
          "id": "u4l2e3",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Me gusta cocinar la cena",
          "audioText": "I like to cook dinner",
          "wordBank": [
            "I",
            "like",
            "to",
            "cook",
            "dinner",
            "lunch",
            "eat"
          ],
          "answerWords": [
            "I",
            "like",
            "to",
            "cook",
            "dinner"
          ]
        },
        {
          "id": "u4l2e4",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "I play sports on weekends",
          "translation": "Hago deporte los fines de semana"
        },
        {
          "id": "u4l2e5",
          "type": "match",
          "prompt": "Empareja las actividades",
          "pairs": [
            {
              "en": "play sports",
              "es": "hacer deporte"
            },
            {
              "en": "watch TV",
              "es": "ver televisión"
            },
            {
              "en": "read a book",
              "es": "leer un libro"
            },
            {
              "en": "cook dinner",
              "es": "cocinar la cena"
            }
          ]
        }
      ]
    }
  ]
};
