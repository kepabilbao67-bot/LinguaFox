export interface Achievement { id:string; titulo:string; descripcion:string; icono:string; }
export const ACHIEVEMENTS: readonly Achievement[] = [
  {id:'primera-leccion',titulo:'Primer paso',descripcion:'Completa un quiz.',icono:'🌱'},
  {id:'primera-charla',titulo:'Primera charla',descripcion:'Habla con un personaje.',icono:'💬'},
  {id:'charlador',titulo:'Charlador',descripcion:'Envía 5 mensajes a personajes.',icono:'🗣️'},
  {id:'racha-3',titulo:'En llamas',descripcion:'Mantén una racha de 3 días.',icono:'🔥'},
] as const;

export function evaluateAchievements(context: { lecciones:number; mensajes:number; personajes:number; racha:number }): string[] {
  const ids:string[]=[];
  if(context.lecciones>=1) ids.push('primera-leccion');
  if(context.mensajes>=1) ids.push('primera-charla');
  if(context.mensajes>=5) ids.push('charlador');
  if(context.racha>=3) ids.push('racha-3');
  return ids;
}
