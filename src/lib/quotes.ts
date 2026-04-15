export type Quote = {
  text: string;
  author: string;
  source?: string;
};

export const QUOTES: Quote[] = [
  { text: "La disciplina es la libertad más elevada.", author: "Epicteto" },
  { text: "No te preguntes qué necesita el mundo. Pregúntate qué te hace sentir vivo y hazlo.", author: "Howard Thurman" },
  { text: "Primero formamos nuestros hábitos, luego nuestros hábitos nos forman a nosotros.", author: "John Dryden" },
  { text: "El hombre que mueve montañas comienza cargando piedras pequeñas.", author: "Confucio" },
  { text: "No desperdicies más de la mitad de tu vida en corrección. Vive conforme a la naturaleza desde el principio.", author: "Marco Aurelio", source: "Meditaciones" },
  { text: "Las pequeñas acciones de cada día son lo que hacen o deshacen el carácter.", author: "Harriet Beecher Stowe" },
  { text: "Tienes poder sobre tu mente, no sobre los eventos externos. Cuando te des cuenta de esto, encontrarás la fuerza.", author: "Marco Aurelio", source: "Meditaciones" },
  { text: "Un hombre que domina sus hábitos se domina a sí mismo.", author: "William James" },
  { text: "La excelencia no es un acto, sino un hábito.", author: "Aristóteles" },
  { text: "Cuida tus pensamientos, porque se vuelven palabras. Cuida tus palabras, porque se vuelven hábitos.", author: "Lao Tse" },
  { text: "No es que tengamos poco tiempo, sino que desperdiciamos mucho.", author: "Séneca", source: "Sobre la brevedad de la vida" },
  { text: "La felicidad es el resultado del progreso continuo, no del destino.", author: "James Clear", source: "Hábitos Atómicos" },
  { text: "Cada acción que realizas es un voto para el tipo de persona que quieres convertirte.", author: "James Clear", source: "Hábitos Atómicos" },
  { text: "Sé tolerante con los demás e inflexible contigo mismo.", author: "Marco Aurelio" },
  { text: "Nunca te arrepentirás de haber trabajado duro en silencio.", author: "Epicteto" },
  { text: "El obstáculo es el camino.", author: "Marco Aurelio" },
  { text: "La virtud consiste en una voluntad que está de acuerdo con la naturaleza.", author: "Zenón de Citio" },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
  { text: "El éxito no es definitivo, el fracaso no es fatal. Lo que cuenta es el coraje para continuar.", author: "Winston Churchill" },
  { text: "Un pequeño progreso cada día se convierte en grandes resultados.", author: "Satya Nani" },
  { text: "Perder el tiempo es el peor de todos los fracasos.", author: "Séneca" },
  { text: "La constancia es la virtud por la que todas las otras son posibles.", author: "Bertrand Russell" },
  { text: "Lo que siembras en tus hábitos de hoy, lo cosecharás en tu destino de mañana.", author: "Samuel Smiles" },
  { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "Comienza donde estás. Usa lo que tienes. Haz lo que puedas.", author: "Arthur Ashe" },
  { text: "La autodisciplina es el puente entre los objetivos y los logros.", author: "Jim Rohn" },
  { text: "Sufres más en tu imaginación que en la realidad.", author: "Séneca" },
  { text: "El momento presente siempre será lo que fue.", author: "Marco Aurelio", source: "Meditaciones" },
  { text: "Un hábito no se puede tirar por la ventana; hay que bajarlo por las escaleras, peldaño a peldaño.", author: "Mark Twain" },
  { text: "No aspires a que las cosas sucedan como tú quieres, sino desea que sucedan como suceden, y serás feliz.", author: "Epicteto", source: "Enquiridión" },
];

/**
 * Returns a deterministic quote based on the current date.
 * Same quote for all users on the same day, changes every day.
 */
export function getQuoteOfDay(dateStr?: string): Quote {
  const date = dateStr ?? new Date().toISOString().split("T")[0];
  // Sum char codes of the date string as a simple hash
  const seed = date.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return QUOTES[seed % QUOTES.length];
}
