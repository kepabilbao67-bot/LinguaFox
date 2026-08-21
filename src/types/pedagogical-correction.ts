import type { EvaluationConfidence } from '@/types/evaluation';

export interface PedagogicalCorrection {
  errorDetectado: string;
  tipoError: 'gramatica' | 'vocabulario' | 'pronunciacion' | 'traduccion_literal' | 'ortografia';
  correccion: string;
  explicacionPorQue: string;
  explicacionComo: string;
  explicacionCuando: string;
  explicacionCuandoNo?: string;   // Cuándo NO usar esta construcción (opcional)
  ejemplos: string[];
  ejercicioComprobacion: string;
  idiomaExplicacion: 'es' | 'en';
  gravedad: 'bloqueante' | 'menor';
  confianza: EvaluationConfidence; // Fiabilidad de la corrección
  debeInterrumpir: boolean;
  textoParaVoz: string;
}
