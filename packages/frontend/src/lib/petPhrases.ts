export const PHRASES: Record<string, string[]> = {
  CAT: [
    'Miau~ 🐱', '¿Tienes algo de comer?', 'Qué suave es este piso...',
    'Mira, un punto rojo...', 'Ya vine, ya vine', 'zzz... eh? ¡Estaba despierto!',
    'Tú sí que sabes cuidarme', '¿Jugamos?', 'Ronroneo feliz...',
  ],
  DOG: [
    '¡Guau! 🐶', '¿Dónde vamos? ¿Dónde vamos?', 'Te quiero mucho humano',
    '¿Hora de comer? ¿COMIDA?', 'Mi persona favorita llegó', 'Corre, te alcanzo...',
    'La cola no para de moverse', '¿Qué hay ahí? ¿Y allá? ¡OLOR!',
    'Bueno... ¿Me das la patita?',
  ],
  RABBIT: [
    'Brinc brinc 🐰', 'Mis orejas oyen todo', '¿Zanahorias? ¿Dónde?',
    '¡Qué ansias!', 'Me gusta este lugar', 'Soy peque pero brinco alto',
    '¿Acaricias mi cabeza?', 'Ya encontré mi lugar',
  ],
  HAMSTER: [
    'Chillido feliz 🐹', 'Mis mejillas están llenas... siempre', 'Corre, corre, rueda, rueda',
    'Guarde la comida para después', '¿Qué haces? Te estoy mirando',
    'No juzgues, solo como', 'Buenas noches... o días, da igual',
    'Saque la vuelta en mi rueda',
  ],
  FOX: [
    '¡Griii! 🦊', 'Astuto y esponjoso', 'No te confíes, soy un zorro',
    'Mi cola es la más linda', 'Cazando caricias con éxito',
    'Zorro siempre alerta', 'Vos y yo, mejor equipo',
    'Huelo comida desde lejos',
  ],
  PANDA: [
    'Prrr 🐼', 'Modo chill activado', '¿Algo de bambú? No, ¿comida de verdad?',
    'Abrazo, por favor', 'Qué lindo día para no hacer nada',
    'Soy un osito, merezco mimos', '¿Puedo dormir acá?', 'Cargame un rato',
  ],
  PENGUIN: [
    '¡Noot noot! 🐧', 'Hace frío acá, me gusta', 'Camino elegante... caí',
    'Resbalé, fue a propósito', '¿Hay pescado?', 'Pasarela, pasarela...',
    'Me paro derecho como un señor', 'Este piso está muy caliente',
  ],
  DRAGON: [
    'Rugido diminuto 🐉', 'Cuidado, que echo fuego... ahre', 'Volar no puedo, pero caminar sí',
    'Soy chiquito pero poderoso', 'Mis alitas apenas levantan', 'Dragón necesita cariño',
    'No soy lagartija, soy dragoooón', 'Brillo escamas de felicidad',
  ],
  UNICORN: [
    'Fiii~ 🦄', 'El arcoíris me llama', 'Mi cuerno brilla con tus mimos',
    'Soy mágico, obvio', 'Galope, galope, galope', 'Te concedo un deseo... mimos',
    'Mis crines de ensueño', 'Polvo de estrellas por todos lados',
  ],
};

export const ACTION_PHRASES: Record<string, string[]> = {
  feed: ['¡Qué rico! 😋', 'Necesitaba eso...', 'Más, más, MÁS', 'Mmmm delicioso'],
  play: ['¡Otra vez! 🎮', 'Me encanta jugar con vos', 'Atrapado al fin', 'Corre, corre...'],
  bathe: ['Agüita tibia... 🛁', 'Esto está refrescante', 'Huelo rico ahora', 'Burbujas por todos lados'],
  wake: ['Buen día 🌅', '¿Ya es hora?', 'Bostezando...', 'Soñaba que volaba'],
  sleep: ['Buenas noches... 🌙', 'Me tiro un rato', 'Zzzz ya...', 'Qué sueñito'],
  call: ['¡Vine corriendo! 🏃', '¿Me llamaste?', 'Acá estoy', 'Llegué, llegué'],
};

export function getPhrase(species: string): string {
  const list = PHRASES[species];
  if (!list || list.length === 0) return '...';
  return list[Math.floor(Math.random() * list.length)]!;
}

export function getActionPhrase(action: string): string {
  const list = ACTION_PHRASES[action];
  if (!list || list.length === 0) return '...';
  return list[Math.floor(Math.random() * list.length)]!;
}
