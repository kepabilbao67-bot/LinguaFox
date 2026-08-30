import type { Unit } from '@/types/learning';

export const UNIT_3: Unit = {
  "id": "u3",
  "level": "A2",
  "title": "Comida y Restaurante",
  "description": "Pide comida como un nativo",
  "color": "#ff9600",
  "lessons": [
    {
      "id": "u3l1",
      "unitId": "u3",
      "title": "En el Restaurante",
      "description": "En el Restaurante en inglés",
      "icon": "🍽️",
      "language": "en",
      "level": "A2",
      "words": [
        {
          "id": "water",
          "source": "water",
          "translation": "agua"
        },
        {
          "id": "the-bill",
          "source": "the bill",
          "translation": "la cuenta"
        },
        {
          "id": "menu",
          "source": "menu",
          "translation": "menú"
        },
        {
          "id": "i-would-like",
          "source": "I would like",
          "translation": "me gustaría"
        },
        {
          "id": "delicious",
          "source": "delicious",
          "translation": "delicioso"
        }
      ],
      "vocab": [
        {
          "en": "water",
          "es": "agua",
          "ipa": "/ˈwɔːtər/"
        },
        {
          "en": "the bill",
          "es": "la cuenta",
          "ipa": "/ðə bɪl/"
        },
        {
          "en": "menu",
          "es": "menú",
          "ipa": "/ˈmenjuː/"
        },
        {
          "en": "I would like",
          "es": "me gustaría",
          "ipa": "/aɪ wʊd laɪk/"
        },
        {
          "en": "delicious",
          "es": "delicioso",
          "ipa": "/dɪˈlɪʃəs/"
        }
      ],
      "exercises": [
        {
          "id": "u3l1e1",
          "type": "fillBlank",
          "prompt": "Completa la oración",
          "sentence": "Can I have the ___, please?",
          "audioText": "Can I have the bill please",
          "options": [
            "bill",
            "car",
            "book",
            "phone"
          ],
          "answer": "bill",
          "translation": "¿Me trae la cuenta, por favor?"
        },
        {
          "id": "u3l1e2",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Me gustaría agua",
          "audioText": "I would like water",
          "wordBank": [
            "I",
            "would",
            "like",
            "water",
            "food",
            "want"
          ],
          "answerWords": [
            "I",
            "would",
            "like",
            "water"
          ]
        },
        {
          "id": "u3l1e3",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "The food is delicious",
          "translation": "La comida está deliciosa"
        },
        {
          "id": "u3l1e4",
          "type": "multipleChoice",
          "prompt": "Selecciona la traducción correcta",
          "question": "menu",
          "audioText": "menu",
          "options": [
            "cuenta",
            "menú",
            "mesa",
            "plato"
          ],
          "answer": "menú"
        },
        {
          "id": "u3l1e5",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "I would like water",
          "options": [
            "I would like water",
            "I want food",
            "The bill please",
            "Delicious menu"
          ],
          "answer": "I would like water"
        }
      ]
    },
    {
      "id": "u3l2",
      "unitId": "u3",
      "title": "Ir de Compras",
      "description": "Ir de Compras en inglés",
      "icon": "🛒",
      "language": "en",
      "level": "A2",
      "words": [
        {
          "id": "how-much",
          "source": "how much",
          "translation": "cuánto cuesta"
        },
        {
          "id": "expensive",
          "source": "expensive",
          "translation": "caro"
        },
        {
          "id": "cheap",
          "source": "cheap",
          "translation": "barato"
        },
        {
          "id": "size",
          "source": "size",
          "translation": "talla"
        },
        {
          "id": "credit-card",
          "source": "credit card",
          "translation": "tarjeta de crédito"
        }
      ],
      "vocab": [
        {
          "en": "how much",
          "es": "cuánto cuesta",
          "ipa": "/haʊ mʌtʃ/"
        },
        {
          "en": "expensive",
          "es": "caro",
          "ipa": "/ɪkˈspensɪv/"
        },
        {
          "en": "cheap",
          "es": "barato",
          "ipa": "/tʃiːp/"
        },
        {
          "en": "size",
          "es": "talla",
          "ipa": "/saɪz/"
        },
        {
          "en": "credit card",
          "es": "tarjeta de crédito",
          "ipa": "/ˈkredɪt kɑːrd/"
        }
      ],
      "exercises": [
        {
          "id": "u3l2e1",
          "type": "multipleChoice",
          "prompt": "Selecciona la traducción correcta",
          "question": "How much is this?",
          "audioText": "How much is this",
          "options": [
            "¿Cuánto cuesta?",
            "¿Dónde está?",
            "¿Qué hora es?",
            "¿Cómo estás?"
          ],
          "answer": "¿Cuánto cuesta?"
        },
        {
          "id": "u3l2e2",
          "type": "fillBlank",
          "prompt": "Completa la oración",
          "sentence": "This is too ___.",
          "audioText": "This is too expensive",
          "options": [
            "expensive",
            "happy",
            "blue",
            "fast"
          ],
          "answer": "expensive",
          "translation": "Esto es demasiado caro."
        },
        {
          "id": "u3l2e3",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "¿Puedo pagar con tarjeta?",
          "audioText": "Can I pay by credit card",
          "wordBank": [
            "Can",
            "I",
            "pay",
            "by",
            "credit",
            "card",
            "cash",
            "want"
          ],
          "answerWords": [
            "Can",
            "I",
            "pay",
            "by",
            "credit",
            "card"
          ]
        },
        {
          "id": "u3l2e4",
          "type": "match",
          "prompt": "Empareja las palabras",
          "pairs": [
            {
              "en": "expensive",
              "es": "caro"
            },
            {
              "en": "cheap",
              "es": "barato"
            },
            {
              "en": "size",
              "es": "talla"
            },
            {
              "en": "credit card",
              "es": "tarjeta"
            }
          ]
        },
        {
          "id": "u3l2e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "How much is this shirt",
          "translation": "¿Cuánto cuesta esta camisa?"
        }
      ]
    }
  ]
};
