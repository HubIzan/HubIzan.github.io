export type Lang = 'es' | 'en';

export const links = {
  email: 'izan.trompeta@gmail.com',
  github: 'https://github.com/HubIzan',
  linkedin: 'https://www.linkedin.com/in/izan-trompeta-loarces-b621252b4/',
  appStore: 'https://apps.apple.com/es/app/dosal/id6797355665',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.dosal.app',
  // Pon aquí la ruta del PDF (por ejemplo '/CV_Izan.pdf') para que aparezca el botón.
  // El PDF de la web no debe incluir el teléfono.
  cv: '',
};

export const stack = [
  'Python', 'FastAPI', 'MySQL', 'SQLAlchemy', 'Alembic', 'Docker', 'React',
  'APIs REST', 'Linux', 'Git', 'Claude', 'ChatGPT', 'Gemini',
];

export const flowTech = ['OCR', 'FastAPI', 'SQLAlchemy', 'React', 'MySQL'];

const es = {
  meta: {
    title: 'Izan Trompeta | Desarrollador de software junior',
    description: 'Portfolio de Izan Trompeta, desarrollador full stack junior con foco en backend: Python, FastAPI, React y MySQL. Una aplicación de almacén en uso y una app publicada en App Store y Google Play.',
  },
  nav: { label: 'Principal', work: 'Proyectos', contact: 'Contacto', language: 'Idioma' },
  status: 'Disponible / Madrid o remoto',
  techLabel: 'Tecnologías usadas',
  heroTitle: ['¡Bienvenido a\nmi portfolio!', 'Izan\nTrompeta'],
  heroWelcomeScale: 0.7625,
  lead: 'Desarrollador full stack junior, con foco en backend. Una aplicación de almacén en uso real en una empresa, una app en App Store y Google Play, y más proyectos en marcha.',
  cta: { work: 'Ver proyectos', cv: 'Descargar CV' },
  warehouse: {
    tag: 'Sigue en uso en una empresa cliente',
    title: 'Del albarán en papel al stock validado',
    text: 'Una aplicación web para un cliente de distribución a hostelería, que antes registraba el stock y transcribía los albaranes a mano. La desarrollé con un compañero durante mis prácticas en GrouPymes.',
    flow: ['Albarán digitalizado', 'Lectura de productos', 'Lógica de stock y FIFO', 'Confirmación física', 'Stock y trazabilidad'],
    points: [
      { title: 'Por qué se valida a mano', text: 'Cada proveedor usa un formato y el OCR puede fallar. Por eso propone, y una persona confirma con el código de barras antes de tocar el stock.' },
      { title: 'Por qué separar lotes y movimientos', text: 'Productos, lotes y movimientos van separados en MySQL para aplicar FIFO y conservar el historial de cada operación.' },
      { title: 'Por qué un servidor local', text: 'Docker Compose en un mini PC de la empresa: menos coste de cloud y más control de los datos. Tailscale da acceso remoto sin exponerlo a internet.' },
    ],
  },
  dosal: {
    tag: 'iOS y Android',
    text: 'Nació de un problema propio: encontrar qué fiestas de pueblo había cada fin de semana. Es un proyecto de dos personas, con mapa, calendario y filtros, sin cuentas y sin enviar la ubicación a ningún servidor.',
    separator: '.',
    stats: [
      { value: '5.624', to: 5624, prefix: '', label: 'fiestas' },
      { value: '4.118', to: 4118, prefix: '', label: 'municipios' },
      { value: '~2', to: 2, prefix: '~', label: 'semanas hasta la primera versión' },
    ],
    alt: 'Cuatro pantallas de Dosal: mapa, lista, detalle de una fiesta y calendario',
  },
  ai: {
    tag: 'Cómo los desarrollé',
    text: 'En estos proyectos usé herramientas de IA como Claude, ChatGPT y Gemini para prototipar, escribir código y documentar. Revisé y probé lo generado antes de darlo por bueno.',
  },
  contact: { tag: 'Contacto', title: '¿Hablamos?' },
};

const en: typeof es = {
  meta: {
    title: 'Izan Trompeta | Junior software developer',
    description: 'Portfolio of Izan Trompeta, a junior full stack developer focused on backend: Python, FastAPI, React and MySQL. A warehouse app in daily use and an app published on the App Store and Google Play.',
  },
  nav: { label: 'Main', work: 'Projects', contact: 'Contact', language: 'Language' },
  status: 'Available / Madrid or remote',
  techLabel: 'Technologies used',
  heroTitle: ['Welcome to\nmy portfolio!', 'Izan\nTrompeta'],
  heroWelcomeScale: 0.7277,
  lead: 'Junior full stack developer, focused on backend. A warehouse app in real use at a company, an app on the App Store and Google Play, and more projects under way.',
  cta: { work: 'See projects', cv: 'Download CV' },
  warehouse: {
    tag: 'Still in use at a client company',
    title: 'From paper delivery notes to validated stock',
    text: 'A web app for a hospitality distribution client that used to log stock and transcribe delivery notes by hand. I built it with a colleague during my internship at GrouPymes.',
    flow: ['Scanned delivery note', 'Product extraction', 'Stock logic and FIFO', 'Physical confirmation', 'Stock and traceability'],
    points: [
      { title: 'Why a person validates', text: 'Every supplier uses a different format and OCR can fail. So it proposes, and a person confirms with the barcode before stock changes.' },
      { title: 'Why batches and movements are separate', text: 'Products, batches and movements are kept apart in MySQL to apply FIFO and keep the history of every operation.' },
      { title: 'Why a local server', text: 'Docker Compose on a mini PC at the company: lower cloud costs and more control of the data. Tailscale gives remote access without exposing it to the internet.' },
    ],
  },
  dosal: {
    tag: 'iOS and Android',
    text: 'It started with a problem of my own: finding which village festivals were on each weekend. It is a two-person project, with a map, calendar and filters, no accounts, and no location sent to any server.',
    separator: ',',
    stats: [
      { value: '5,624', to: 5624, prefix: '', label: 'festivals' },
      { value: '4,118', to: 4118, prefix: '', label: 'towns' },
      { value: '~2', to: 2, prefix: '~', label: 'weeks to the first version' },
    ],
    alt: 'Four Dosal screens: map, list, festival details and calendar',
  },
  ai: {
    tag: 'How I built them',
    text: 'On these projects I used AI tools such as Claude, ChatGPT and Gemini to prototype, write code and document. I reviewed and tested what they generated before calling it done.',
  },
  contact: { tag: 'Contact', title: 'Let’s talk' },
};

export const content = { es, en };
