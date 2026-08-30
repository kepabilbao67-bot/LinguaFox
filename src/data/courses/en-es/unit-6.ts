import type { Unit } from '@/types/learning';

export const UNIT_6: Unit = {
  "id": "u6",
  "level": "B1",
  "title": "Trabajo y Oficina",
  "description": "Vocabulario profesional esencial",
  "color": "#2d3436",
  "lessons": [
    {
      "id": "u6l1",
      "unitId": "u6",
      "title": "La Entrevista",
      "description": "La Entrevista en inglés",
      "icon": "💼",
      "language": "en",
      "level": "B1",
      "words": [
        {
          "id": "salary",
          "source": "salary",
          "translation": "salario"
        },
        {
          "id": "experience",
          "source": "experience",
          "translation": "experiencia"
        },
        {
          "id": "strengths",
          "source": "strengths",
          "translation": "fortalezas"
        },
        {
          "id": "deadline",
          "source": "deadline",
          "translation": "fecha límite"
        },
        {
          "id": "team-player",
          "source": "team player",
          "translation": "trabajo en equipo"
        },
        {
          "id": "apply-for",
          "source": "apply for",
          "translation": "solicitar"
        }
      ],
      "vocab": [
        {
          "en": "salary",
          "es": "salario",
          "ipa": "/ˈsæləri/"
        },
        {
          "en": "experience",
          "es": "experiencia",
          "ipa": "/ɪkˈspɪriəns/"
        },
        {
          "en": "strengths",
          "es": "fortalezas",
          "ipa": "/streŋθs/"
        },
        {
          "en": "deadline",
          "es": "fecha límite",
          "ipa": "/ˈdedlaɪn/"
        },
        {
          "en": "team player",
          "es": "trabajo en equipo",
          "ipa": "/tiːm ˈpleɪər/"
        },
        {
          "en": "apply for",
          "es": "solicitar",
          "ipa": "/əˈplaɪ fɔːr/"
        }
      ],
      "exercises": [
        {
          "id": "u6l1e1",
          "type": "multipleChoice",
          "prompt": "¿Qué significa \"deadline\"?",
          "question": "deadline",
          "audioText": "deadline",
          "options": [
            "salario",
            "fecha límite",
            "experiencia",
            "reunión"
          ],
          "answer": "fecha límite"
        },
        {
          "id": "u6l1e2",
          "type": "fillBlank",
          "prompt": "Completa la oración",
          "sentence": "I have five years of ___ in marketing.",
          "audioText": "I have five years of experience in marketing",
          "options": [
            "experience",
            "salary",
            "deadline",
            "meeting"
          ],
          "answer": "experience",
          "translation": "Tengo cinco años de experiencia en marketing."
        },
        {
          "id": "u6l1e3",
          "type": "translate",
          "prompt": "Traduce esta frase",
          "sourceText": "Quiero solicitar este puesto",
          "audioText": "I want to apply for this position",
          "wordBank": [
            "I",
            "want",
            "to",
            "apply",
            "for",
            "this",
            "position",
            "job",
            "get"
          ],
          "answerWords": [
            "I",
            "want",
            "to",
            "apply",
            "for",
            "this",
            "position"
          ]
        },
        {
          "id": "u6l1e4",
          "type": "listen",
          "prompt": "Escucha y selecciona lo que oíste",
          "audioText": "What are your strengths",
          "options": [
            "What are your strengths",
            "What is your salary",
            "When is the deadline",
            "Are you a team player"
          ],
          "answer": "What are your strengths"
        },
        {
          "id": "u6l1e5",
          "type": "speak",
          "prompt": "Pronuncia esta frase",
          "audioText": "I am a team player and I work well under pressure",
          "translation": "Trabajo bien en equipo y bajo presión"
        },
        {
          "id": "u6l1e6",
          "type": "match",
          "prompt": "Empareja el vocabulario laboral",
          "pairs": [
            {
              "en": "salary",
              "es": "salario"
            },
            {
              "en": "deadline",
              "es": "fecha límite"
            },
            {
              "en": "strengths",
              "es": "fortalezas"
            },
            {
              "en": "apply for",
              "es": "solicitar"
            }
          ]
        }
      ]
    },
    {
      "id": "u6l2",
      "unitId": "u6",
      "title": "Email Formal",
      "description": "Email Formal en inglés",
      "icon": "📧",
      "language": "en",
      "level": "B1",
      "words": [
        {
          "id": "dear-sir-madam",
          "source": "Dear Sir/Madam",
          "translation": "Estimado/a señor/a"
        },
        {
          "id": "i-am-writing-to",
          "source": "I am writing to",
          "translation": "Le escribo para"
        },
        {
          "id": "kind-regards",
          "source": "Kind regards",
          "translation": "Un cordial saludo"
        },
        {
          "id": "attachment",
          "source": "attachment",
          "translation": "archivo adjunto"
        },
        {
          "id": "schedule-a-meeting",
          "source": "schedule a meeting",
          "translation": "programar una reunión"
        }
      ],
      "vocab": [
        {
          "en": "Dear Sir/Madam",
          "es": "Estimado/a señor/a"
        },
        {
          "en": "I am writing to",
          "es": "Le escribo para"
        },
        {
          "en": "Kind regards",
          "es": "Un cordial saludo"
        },
        {
          "en": "attachment",
          "es": "archivo adjunto",
          "ipa": "/əˈtætʃmənt/"
        },
        {
          "en": "schedule a meeting",
          "es": "programar una reunión"
        }
      ],
      "exercises": [
        {
          "id": "u6l2e1",
          "type": "multipleChoice",
          "prompt": "¿Cómo cierras un email formal?",
          "question": "Kind regards",
          "audioText": "Kind regards",
          "options": [
            "Un cordial saludo",
            "Hasta luego",
            "Nos vemos",
            "Besos"
          ],
          "answer": "Un cordial saludo"
        },
        {
          "id": "u6l2e2",
          "type": "fillBlank",
          "prompt": "Completa el email formal",
          "sentence": "Please find the ___ below.",
          "audioText": "Please find the attachment below",
          "options": [
            "attachment",
            "meeting",
            "salary",
            "document"
          ],
          "answer": "attachment",
          "translation": "Por favor encuentre el adjunto abajo."
        },
        {
          "id": "u6l2e3",
          "type": "translate",
          "prompt": "Traduce esta frase formal",
          "sourceText": "Le escribo para programar una reunión",
          "audioText": "I am writing to schedule a meeting",
          "wordBank": [
            "I",
            "am",
            "writing",
            "to",
            "schedule",
            "a",
            "meeting",
            "want",
            "have"
          ],
          "answerWords": [
            "I",
            "am",
            "writing",
            "to",
            "schedule",
            "a",
            "meeting"
          ]
        },
        {
          "id": "u6l2e4",
          "type": "speak",
          "prompt": "Pronuncia este saludo formal",
          "audioText": "Dear Sir or Madam, I am writing to inquire about",
          "translation": "Estimado/a, le escribo para preguntar sobre"
        },
        {
          "id": "u6l2e5",
          "type": "match",
          "prompt": "Empareja las expresiones formales",
          "pairs": [
            {
              "en": "Dear Sir/Madam",
              "es": "Estimado/a señor/a"
            },
            {
              "en": "Kind regards",
              "es": "Un cordial saludo"
            },
            {
              "en": "attachment",
              "es": "archivo adjunto"
            },
            {
              "en": "schedule a meeting",
              "es": "programar reunión"
            }
          ]
        }
      ]
    }
  ]
};
