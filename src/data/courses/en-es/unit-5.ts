import type { Unit } from '@/types/learning';

export const UNIT_5: Unit = {
  "id": "u5",
  "level": "B1",
  "title": "Viajes y Transporte",
  "description": "Navega aeropuertos y ciudades nuevas",
  "color": "#ff4b4b",
  "lessons": [
    {
      "id": "u5l1",
      "unitId": "u5",
      "title": "En el Aeropuerto",
      "description": "En el Aeropuerto en inglés",
      "icon": "✈️",
      "language": "en",
      "level": "B1",
      "words": [
        {
          "id": "boarding-pass",
          "source": "boarding pass",
          "translation": "tarjeta de embarque"
        },
        {
          "id": "departure-gate",
          "source": "departure gate",
          "translation": "puerta de embarque"
        },
        {
          "id": "check-in",
          "source": "check in",
          "translation": "facturar"
        },
        {
          "id": "delayed",
          "source": "delayed",
          "translation": "retrasado"
        },
        {
          "id": "luggage",
          "source": "luggage",
          "translation": "equipaje"
        },
        {
          "id": "aisle-seat",
          "source": "aisle seat",
          "translation": "asiento de pasillo"
        }
      ],
      "vocab": [
        {
          "en": "boarding pass",
          "es": "tarjeta de embarque",
          "ipa": "/ˈbɔːrdɪŋ pæs/"
        },
        {
          "en": "departure gate",
          "es": "puerta de embarque",
          "ipa": "/dɪˈpɑːrtʃər ɡeɪt/"
        },
        {
          "en": "check in",
          "es": "facturar",
          "ipa": "/tʃek ɪn/"
        },
        {
          "en": "delayed",
          "es": "retrasado",
          "ipa": "/dɪˈleɪd/"
        },
        {
          "en": "luggage",
          "es": "equipaje",
          "ipa": "/ˈlʌɡɪdʒ/"
        },
        {
          "en": "aisle seat",
          "es": "asiento de pasillo",
          "ipa": "/aɪl siːt/"
        }
      ],
      "exercises": [
        {
          "id": "u5l1e1",
          "type": "multipleChoice",
          "prompt": "¿Qué significa \"boarding pass\"?",
          "question": "boarding pass",
          "audioText": "boarding pass",
          "options": [
            "tarjeta de embarque",
            "pasaporte",
            "billete de tren",
            "maleta"
          ],
          "answer": "tarjeta de embarque"
        },
        {
          "id": "u5l1e2",
          "type": "fillBlank",
          "prompt": "Completa la oración",
          "sentence": "The flight is ___ by two hours.",
          "audioText": "The flight is delayed by two hours",
          "options": [
            "delayed",
            "early",
            "cancelled",
            "fast"
          ],
          "answer": "delayed",
          "translation": "El vuelo está retrasado dos horas."
        },
        {
          "id": "u5l1e3",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "¿Dónde está la puerta de embarque?",
          "audioText": "Where is the departure gate",
          "wordBank": [
            "Where",
            "is",
            "the",
            "departure",
            "gate",
            "airport",
            "when",
            "exit"
          ],
          "answerWords": [
            "Where",
            "is",
            "the",
            "departure",
            "gate"
          ]
        },
        {
          "id": "u5l1e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "I need to check in my luggage",
          "options": [
            "I need to check in my luggage",
            "Where is my boarding pass",
            "The flight is delayed",
            "I want an aisle seat"
          ],
          "answer": "I need to check in my luggage"
        },
        {
          "id": "u5l1e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "Can I have an aisle seat please",
          "translation": "¿Puedo tener un asiento de pasillo?"
        },
        {
          "id": "u5l1e6",
          "type": "match",
          "prompt": "Empareja el vocabulario del aeropuerto",
          "pairs": [
            {
              "en": "boarding pass",
              "es": "tarjeta de embarque"
            },
            {
              "en": "luggage",
              "es": "equipaje"
            },
            {
              "en": "delayed",
              "es": "retrasado"
            },
            {
              "en": "aisle seat",
              "es": "asiento de pasillo"
            }
          ]
        }
      ]
    },
    {
      "id": "u5l2",
      "unitId": "u5",
      "title": "Direcciones",
      "description": "Direcciones en inglés",
      "icon": "🗺️",
      "language": "en",
      "level": "B1",
      "words": [
        {
          "id": "turn-left",
          "source": "turn left",
          "translation": "gira a la izquierda"
        },
        {
          "id": "turn-right",
          "source": "turn right",
          "translation": "gira a la derecha"
        },
        {
          "id": "go-straight",
          "source": "go straight",
          "translation": "sigue recto"
        },
        {
          "id": "next-to",
          "source": "next to",
          "translation": "al lado de"
        },
        {
          "id": "across-from",
          "source": "across from",
          "translation": "enfrente de"
        },
        {
          "id": "roundabout",
          "source": "roundabout",
          "translation": "rotonda"
        }
      ],
      "vocab": [
        {
          "en": "turn left",
          "es": "gira a la izquierda",
          "ipa": "/tɜːrn left/"
        },
        {
          "en": "turn right",
          "es": "gira a la derecha",
          "ipa": "/tɜːrn raɪt/"
        },
        {
          "en": "go straight",
          "es": "sigue recto",
          "ipa": "/ɡoʊ streɪt/"
        },
        {
          "en": "next to",
          "es": "al lado de",
          "ipa": "/nekst tuː/"
        },
        {
          "en": "across from",
          "es": "enfrente de",
          "ipa": "/əˈkrɒs frʌm/"
        },
        {
          "en": "roundabout",
          "es": "rotonda",
          "ipa": "/ˈraʊndəbaʊt/"
        }
      ],
      "exercises": [
        {
          "id": "u5l2e1",
          "type": "multipleChoice",
          "prompt": "¿Qué significa \"go straight\"?",
          "question": "go straight",
          "audioText": "go straight",
          "options": [
            "gira a la derecha",
            "sigue recto",
            "para aquí",
            "gira a la izquierda"
          ],
          "answer": "sigue recto"
        },
        {
          "id": "u5l2e2",
          "type": "fillBlank",
          "prompt": "Completa la dirección",
          "sentence": "The bank is ___ the supermarket.",
          "audioText": "The bank is next to the supermarket",
          "options": [
            "next to",
            "under",
            "inside",
            "behind"
          ],
          "answer": "next to",
          "translation": "El banco está al lado del supermercado."
        },
        {
          "id": "u5l2e3",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Gira a la izquierda en la rotonda",
          "audioText": "Turn left at the roundabout",
          "wordBank": [
            "Turn",
            "left",
            "at",
            "the",
            "roundabout",
            "right",
            "straight",
            "go"
          ],
          "answerWords": [
            "Turn",
            "left",
            "at",
            "the",
            "roundabout"
          ]
        },
        {
          "id": "u5l2e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "Turn right and go straight",
          "options": [
            "Turn right and go straight",
            "Turn left at the corner",
            "Go straight ahead",
            "The hotel is next to the bank"
          ],
          "answer": "Turn right and go straight"
        },
        {
          "id": "u5l2e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "The pharmacy is across from the park",
          "translation": "La farmacia está enfrente del parque"
        },
        {
          "id": "u5l2e6",
          "type": "match",
          "prompt": "Empareja las direcciones",
          "pairs": [
            {
              "en": "turn left",
              "es": "gira a la izquierda"
            },
            {
              "en": "turn right",
              "es": "gira a la derecha"
            },
            {
              "en": "go straight",
              "es": "sigue recto"
            },
            {
              "en": "next to",
              "es": "al lado de"
            }
          ]
        }
      ]
    }
  ]
};
