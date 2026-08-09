/**
 * Regolatore PID e modello termico della cella.
 *
 * È il pezzo che rende il demo una dimostrazione e non un'animazione: il
 * grafico non segue una curva registrata, esce dal calcolo. Spostando il
 * setpoint o peggiorando i guadagni si vedono davvero sovraelongazione,
 * oscillazione ed errore a regime.
 */

export interface Gains {
  kp: number;
  ki: number;
  kd: number;
}

/** Tarature di confronto: la differenza si vede a occhio sul grafico. */
export const PRESETS: Record<'tuned' | 'aggressive' | 'sluggish', Gains> = {
  tuned: { kp: 30, ki: 3, kd: 18 },
  aggressive: { kp: 90, ki: 14, kd: 1 },
  sluggish: { kp: 6, ki: 0.2, kd: 0 },
};

export class Pid {
  private integral = 0;
  private lastError: number | null = null;

  constructor(
    private gains: Gains,
    /** L'uscita è la potenza del compressore, in percentuale. */
    private readonly min = 0,
    private readonly max = 100,
  ) {}

  setGains(gains: Gains): void {
    this.gains = gains;
  }

  reset(): void {
    this.integral = 0;
    this.lastError = null;
  }

  /**
   * @param error  setpoint meno misura, in gradi
   * @param dt     passo di integrazione in secondi
   */
  step(error: number, dt: number): number {
    const { kp, ki, kd } = this.gains;

    const derivative = this.lastError === null ? 0 : (error - this.lastError) / dt;
    this.lastError = error;

    const candidateIntegral = this.integral + error * dt;
    const unclamped = kp * error + ki * candidateIntegral + kd * derivative;

    // Anti-windup: l'integrale cresce solo se l'uscita non è già a fondo
    // corsa, altrimenti al rientro il regolatore resterebbe saturo a lungo.
    const saturated = unclamped > this.max || unclamped < this.min;
    const pushingFurther = (unclamped > this.max && error > 0) || (unclamped < this.min && error < 0);

    if (!saturated || !pushingFurther) {
      this.integral = candidateIntegral;
    }

    const output = kp * error + ki * this.integral + kd * derivative;
    return Math.min(this.max, Math.max(this.min, output));
  }
}

export interface PlantState {
  temperature: number;
  humidity: number;
  /** Resta alta per un po' dopo l'apertura della porta. */
  doorOpenFor: number;
}

export const AMBIENT = 24;

/**
 * Temperatura di partenza: una cella tiepida, non a temperatura ambiente.
 * Partendo da 24° il transitorio durava quaranta secondi e nessuno resta a
 * guardare tanto; da qui si assesta in una decina.
 */
export const START_TEMPERATURE = 12;

/**
 * Cella frigorifera: il caldo entra dall'ambiente, il compressore lo
 * toglie. Le costanti sono scelte perché la risposta sia leggibile in
 * pochi secondi invece che nelle decine di minuti della realtà.
 */
export function stepPlant(state: PlantState, coolingPercent: number, dt: number): PlantState {
  const leak = state.doorOpenFor > 0 ? 0.42 : 0.055;
  const mass = 1.0;

  const heatIn = leak * (AMBIENT - state.temperature);
  // Potenza dell'impianto: scelta perché il transitorio si veda in pochi
  // secondi, restando comunque un valore plausibile per una cella piccola.
  const heatOut = (coolingPercent / 100) * 2.4;
  const temperature = state.temperature + ((heatIn - heatOut) / mass) * dt;

  // L'umidità sale con la porta aperta e viene riasciugata dalla batteria
  const humidityTarget = state.doorOpenFor > 0 ? 78 : 62 + coolingPercent * 0.05;
  const humidity = state.humidity + (humidityTarget - state.humidity) * Math.min(1, dt * 0.4);

  return {
    temperature,
    humidity,
    doorOpenFor: Math.max(0, state.doorOpenFor - dt),
  };
}
