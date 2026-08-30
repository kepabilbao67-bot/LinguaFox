import type { Unit } from '@/types/learning';

export const UNIT_7: Unit = {
  "id": "u7",
  "level": "B2",
  "title": "Opiniones y Debate",
  "description": "Expresa y defiende tu punto de vista",
  "color": "#a560e8",
  "lessons": [
    {
      "id": "u7l1",
      "unitId": "u7",
      "title": "Dar Opiniones",
      "description": "Dar Opiniones en inglés",
      "icon": "💭",
      "language": "en",
      "level": "B2",
      "words": [
        {
          "id": "in-my-opinion",
          "source": "in my opinion",
          "translation": "en mi opinión"
        },
        {
          "id": "i-strongly-believe",
          "source": "I strongly believe",
          "translation": "creo firmemente"
        },
        {
          "id": "on-the-other-hand",
          "source": "on the other hand",
          "translation": "por otro lado"
        },
        {
          "id": "nevertheless",
          "source": "nevertheless",
          "translation": "sin embargo"
        },
        {
          "id": "to-be-honest",
          "source": "to be honest",
          "translation": "para ser sincero"
        },
        {
          "id": "it-depends-on",
          "source": "it depends on",
          "translation": "depende de"
        }
      ],
      "vocab": [
        {
          "en": "in my opinion",
          "es": "en mi opinión",
          "ipa": "/ɪn maɪ əˈpɪnjən/"
        },
        {
          "en": "I strongly believe",
          "es": "creo firmemente"
        },
        {
          "en": "on the other hand",
          "es": "por otro lado"
        },
        {
          "en": "nevertheless",
          "es": "sin embargo",
          "ipa": "/ˌnevərðəˈles/"
        },
        {
          "en": "to be honest",
          "es": "para ser sincero"
        },
        {
          "en": "it depends on",
          "es": "depende de"
        }
      ],
      "exercises": [
        {
          "id": "u7l1e1",
          "type": "multipleChoice",
          "prompt": "¿Qué conector expresa contraste?",
          "question": "nevertheless",
          "audioText": "nevertheless",
          "options": [
            "sin embargo",
            "además",
            "por eso",
            "finalmente"
          ],
          "answer": "sin embargo"
        },
        {
          "id": "u7l1e2",
          "type": "fillBlank",
          "prompt": "Completa la frase de opinión",
          "sentence": "___, I think technology has improved our lives.",
          "audioText": "In my opinion I think technology has improved our lives",
          "options": [
            "In my opinion",
            "Yesterday",
            "Suddenly",
            "Finally"
          ],
          "answer": "In my opinion",
          "translation": "En mi opinión, creo que la tecnología ha mejorado nuestras vidas."
        },
        {
          "id": "u7l1e3",
          "type": "translate",
          "prompt": "Traduce esta frase de debate",
          "sourceText": "Por otro lado, hay desventajas",
          "audioText": "On the other hand there are disadvantages",
          "wordBank": [
            "On",
            "the",
            "other",
            "hand",
            "there",
            "are",
            "disadvantages",
            "advantages",
            "however"
          ],
          "answerWords": [
            "On",
            "the",
            "other",
            "hand",
            "there",
            "are",
            "disadvantages"
          ]
        },
        {
          "id": "u7l1e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "I strongly believe that education is the key",
          "options": [
            "I strongly believe that education is the key",
            "In my opinion, money is important",
            "Nevertheless, I disagree",
            "To be honest, I am not sure"
          ],
          "answer": "I strongly believe that education is the key"
        },
        {
          "id": "u7l1e5",
          "type": "speak",
          "prompt": "Pronuncia esta opinión",
          "audioText": "To be honest, it depends on the situation",
          "translation": "Para ser sincero, depende de la situación"
        },
        {
          "id": "u7l1e6",
          "type": "match",
          "prompt": "Empareja los conectores",
          "pairs": [
            {
              "en": "in my opinion",
              "es": "en mi opinión"
            },
            {
              "en": "nevertheless",
              "es": "sin embargo"
            },
            {
              "en": "on the other hand",
              "es": "por otro lado"
            },
            {
              "en": "to be honest",
              "es": "para ser sincero"
            }
          ]
        }
      ]
    },
    {
      "id": "u7l2",
      "unitId": "u7",
      "title": "Argumentar",
      "description": "Argumentar en inglés",
      "icon": "⚖️",
      "language": "en",
      "level": "B2",
      "words": [
        {
          "id": "furthermore",
          "source": "furthermore",
          "translation": "además"
        },
        {
          "id": "as-a-result",
          "source": "as a result",
          "translation": "como resultado"
        },
        {
          "id": "despite",
          "source": "despite",
          "translation": "a pesar de"
        },
        {
          "id": "whereas",
          "source": "whereas",
          "translation": "mientras que"
        },
        {
          "id": "in-conclusion",
          "source": "in conclusion",
          "translation": "en conclusión"
        }
      ],
      "vocab": [
        {
          "en": "furthermore",
          "es": "además",
          "ipa": "/ˌfɜːrðərˈmɔːr/"
        },
        {
          "en": "as a result",
          "es": "como resultado"
        },
        {
          "en": "despite",
          "es": "a pesar de",
          "ipa": "/dɪˈspaɪt/"
        },
        {
          "en": "whereas",
          "es": "mientras que",
          "ipa": "/werˈæz/"
        },
        {
          "en": "in conclusion",
          "es": "en conclusión"
        }
      ],
      "exercises": [
        {
          "id": "u7l2e1",
          "type": "multipleChoice",
          "prompt": "¿Qué conector añade información?",
          "question": "furthermore",
          "audioText": "furthermore",
          "options": [
            "además",
            "sin embargo",
            "por eso",
            "a pesar de"
          ],
          "answer": "además"
        },
        {
          "id": "u7l2e2",
          "type": "fillBlank",
          "prompt": "Elige el conector adecuado",
          "sentence": "___ the rain, we went for a walk.",
          "audioText": "Despite the rain we went for a walk",
          "options": [
            "Despite",
            "Furthermore",
            "As a result",
            "In conclusion"
          ],
          "answer": "Despite",
          "translation": "A pesar de la lluvia, fuimos a pasear."
        },
        {
          "id": "u7l2e3",
          "type": "translate",
          "prompt": "Traduce esta conclusión",
          "sourceText": "En conclusión, los beneficios superan los riesgos",
          "audioText": "In conclusion the benefits outweigh the risks",
          "wordBank": [
            "In",
            "conclusion",
            "the",
            "benefits",
            "outweigh",
            "risks",
            "despite",
            "furthermore"
          ],
          "answerWords": [
            "In",
            "conclusion",
            "the",
            "benefits",
            "outweigh",
            "the",
            "risks"
          ]
        },
        {
          "id": "u7l2e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "As a result, many people lost their jobs",
          "options": [
            "As a result, many people lost their jobs",
            "Furthermore, the economy grew",
            "Despite the crisis, we survived",
            "In conclusion, it was successful"
          ],
          "answer": "As a result, many people lost their jobs"
        },
        {
          "id": "u7l2e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "Whereas some people agree, others strongly disagree",
          "translation": "Mientras que algunos están de acuerdo, otros no"
        },
        {
          "id": "u7l2e6",
          "type": "match",
          "prompt": "Empareja los conectores avanzados",
          "pairs": [
            {
              "en": "furthermore",
              "es": "además"
            },
            {
              "en": "as a result",
              "es": "como resultado"
            },
            {
              "en": "despite",
              "es": "a pesar de"
            },
            {
              "en": "in conclusion",
              "es": "en conclusión"
            }
          ]
        }
      ]
    }
  ]
};
