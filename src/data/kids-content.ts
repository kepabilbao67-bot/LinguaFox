export interface KidsTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: readonly {
    id: string;
    en: string;
    es: string;
    emoji: string;
    phonetic: string;
  }[];
}

export const KIDS_TOPICS: readonly KidsTopic[] = [
  {
    id: 'animals',
    title: 'Animales',
    icon: '🦁',
    color: '#F59E0B',
    items: [
      { id: 'cat', en: 'Cat', es: 'Gato', emoji: '🐱', phonetic: 'kat' },
      { id: 'dog', en: 'Dog', es: 'Perro', emoji: '🐶', phonetic: 'dog' },
      { id: 'lion', en: 'Lion', es: 'León', emoji: '🦁', phonetic: 'lai-on' },
      { id: 'elephant', en: 'Elephant', es: 'Elefante', emoji: '🐘', phonetic: 'e-le-fant' },
      { id: 'bird', en: 'Bird', es: 'Pájaro', emoji: '🐦', phonetic: 'berd' },
      { id: 'fox', en: 'Fox', es: 'Zorro', emoji: '🦊', phonetic: 'fox' },
    ],
  },
  {
    id: 'colors',
    title: 'Colores',
    icon: '🎨',
    color: '#3B82F6',
    items: [
      { id: 'red', en: 'Red', es: 'Rojo', emoji: '🔴', phonetic: 'red' },
      { id: 'blue', en: 'Blue', es: 'Azul', emoji: '🔵', phonetic: 'blu' },
      { id: 'green', en: 'Green', es: 'Verde', emoji: '🟢', phonetic: 'grin' },
      { id: 'yellow', en: 'Yellow', es: 'Amarillo', emoji: '🟡', phonetic: 'ye-low' },
      { id: 'purple', en: 'Purple', es: 'Morado', emoji: '🟣', phonetic: 'per-pl' },
      { id: 'orange', en: 'Orange', es: 'Naranja', emoji: '🟠', phonetic: 'or-inj' },
    ],
  },
  {
    id: 'numbers',
    title: 'Números',
    icon: '🔢',
    color: '#10B981',
    items: [
      { id: 'one', en: 'One', es: 'Uno', emoji: '1️⃣', phonetic: 'wan' },
      { id: 'two', en: 'Two', es: 'Dos', emoji: '2️⃣', phonetic: 'tu' },
      { id: 'three', en: 'Three', es: 'Tres', emoji: '3️⃣', phonetic: 'thri' },
      { id: 'four', en: 'Four', es: 'Cuatro', emoji: '4️⃣', phonetic: 'for' },
      { id: 'five', en: 'Five', es: 'Cinco', emoji: '5️⃣', phonetic: 'faiv' },
      { id: 'ten', en: 'Ten', es: 'Diez', emoji: '🔟', phonetic: 'ten' },
    ],
  },
  {
    id: 'food',
    title: 'Comida',
    icon: '🍎',
    color: '#EC4899',
    items: [
      { id: 'apple', en: 'Apple', es: 'Manzana', emoji: '🍎', phonetic: 'a-pl' },
      { id: 'banana', en: 'Banana', es: 'Plátano', emoji: '🍌', phonetic: 'ba-na-na' },
      { id: 'milk', en: 'Milk', es: 'Leche', emoji: '🥛', phonetic: 'milk' },
      { id: 'bread', en: 'Bread', es: 'Pan', emoji: '🍞', phonetic: 'bred' },
      { id: 'water', en: 'Water', es: 'Agua', emoji: '💧', phonetic: 'wa-ter' },
      { id: 'pizza', en: 'Pizza', es: 'Pizza', emoji: '🍕', phonetic: 'peet-sa' },
    ],
  },
];
