// Mapping of feature words to emoji icons
export const featureWordToEmoji: Record<string, string> = {
  // Ground & Field
  turf: '🌱',
  grass: '🌱',
  pitch: '🏏',
  outfield: '🌾',
  boundary: '📏',
  sightscreen: '📺',
  dugout: '🏠',
  curator: '👨‍🌾',
  drainage: '💧',
  irrigation: '🚿',
  roller: '🚜',

  // Nets & Practice
  nets: '🕸️',
  lane: '🛤️',
  mat: '🟫',
  matting: '🟫',
  seam: '⚾',
  swing: '🌪️',
  spin: '🌀',
  cage: '🔲',
  poles: '📏',
  screens: '🛡️',

  // Bowling & Machines
  bowling: '🎳',
  machine: '🤖',
  auto: '🔄',
  remote: '📱',
  programmable: '⚙️',
  speed: '💨',
  line: '📐',
  length: '📏',

  // Technology & Analysis
  video: '📹',
  camera: '📷',
  tripod: '📹',
  playback: '▶️',
  monitor: '🖥️',
  analysis: '📊',
  recording: '🎥',
  tracking: '👁️',

  // Facilities & Buildings
  pavilion: '🏢',
  seating: '🪑',
  grandstands: '🏟️',
  vip: '👑',
  corporate: '💼',
  suites: '🏨',
  locker: '🔒',
  shower: '🚿',
  restroom: '🚻',
  cafeteria: '🍽️',
  hospitality: '🍽️',
  food: '🍔',
  courts: '🍽️',
  stalls: '🍽️',

  // Equipment & Gear
  equipment: '🛠️',
  bats: '🏏',
  pads: '🛡️',
  helmets: '⛑️',
  gloves: '🧤',
  gear: '⚽',
  cones: '🟢',
  stumps: '🏏',
  balls: '⚾',
  wickets: '🏏',
  willow: '🌳',

  // Lighting & Environment
  lighting: '💡',
  light: '💡',
  floodlights: '💡',
  led: '💡',
  energy: '⚡',
  efficient: '⚡',
  ac: '❄️',
  ventilation: '💨',
  fan: '💨',
  cooling: '❄️',
  temperature: '🌡️',
  thermostat: '🌡️',
  humidity: '💧',

  // Security & Access
  security: '🔒',
  cctv: '📹',
  guard: '👮',
  access: '🔑',
  alarm: '🚨',
  control: '🎛️',
  ticket: '🎫',
  scanning: '📱',
  entry: '🚪',
  gates: '🚧',

  // Amenities
  parking: '🅿️',
  wifi: '📶',
  network: '🌐',
  hotspot: '📶',
  medical: '🏥',
  emergency: '🚑',
  ambulance: '🚑',
  physio: '🩹',
  first: '➕',
  aid: '➕',

  // Training & Fitness
  gym: '🏋️',
  indoor: '🏠',
  training: '💪',
  fitness: '💪',
  conditioning: '💪',
  strength: '💪',
  warm: '🔥',
  up: '🔥',
  stretching: '🧘',
  cardio: '❤️',
  weights: '🏋️',

  // Coaching & Media
  coaching: '👨‍🏫',
  commentary: '🎙️',
  media: '📺',
  press: '📰',
  broadcast: '📡',

  // Surface Types
  astroturf: '🟩',
  synthetic: '🟩',
  hybrid: '🔄',
  drop: '📉',
  in: '📉',
  natural: '🌿',
  maintained: '✂️',
  leveled: '📏',
  draining: '💧',
  fast: '💨',

  // Capacity & Usage
  capacity: '👥',
  players: '👥',
  members: '👥',
  all: '🌍',
  weather: '🌦️',
  roofing: '🏠',
  covered: '🏠',
  skylights: '☀️',
  safety: '🛡️',
  flooring: '🟫',
  absorbing: '🧽',
  shock: '🛡️',

  // Transport
  transport: '🚗',
  shuttle: '🚌',
  services: '🚗',
  ev: '🔋',
  bicycle: '🚲',

  // Additional keywords
  professional: '⭐',
  world: '🌍',
  class: '🏆',
  international: '🌍',
  standard: '📏',
  premium: '💎',
  modern: '🔄',
  state: '🏛️',
  art: '🎨',
  academy: '🎓',
  cricket: '🏏',
  sports: '⚽',
  club: '🏟️',
  center: '🏢',
  centre: '🏢',
  facility: '🏢',
  complex: '🏗️',
  ground: '🌍',
  field: '🌾',
  arena: '🏟️',
  stadium: '🏟️'
};

// Function to get icon for a feature word
export const getFeatureIcon = (feature: string): string => {
  const words = feature.toLowerCase().split(/[^a-z0-9]+/);
  for (const word of words) {
    if (featureWordToEmoji[word]) {
      return featureWordToEmoji[word];
    }
  }
  return '•'; // Default bullet if no icon found
};
