import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { DemoShell } from '../shell/demo-shell';
import { AMBIENT, Gains, PRESETS, Pid, PlantState, START_TEMPERATURE, stepPlant } from './pid';

/** Passo di integrazione: fine abbastanza da non falsare il derivativo. */
const DT = 0.05;
/** Ogni quanti passi si aggiunge un punto al grafico. */
const SAMPLE_EVERY = 4;
/** Punti tenuti sul grafico. */
const WINDOW = 150;

type PresetName = keyof typeof PRESETS;

@Component({
  selector: 'app-demo-iot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoShell],
  templateUrl: './demo-iot.html',
  styleUrl: './demo-iot.css',
})
export class DemoIot implements OnDestroy {
  protected readonly i18n = inject(I18nService);
  private readonly zone = inject(NgZone);

  protected readonly setpoint = signal(4);
  protected readonly running = signal(true);
  protected readonly preset = signal<PresetName>('tuned');
  protected readonly gains = signal<Gains>({ ...PRESETS.tuned });

  protected readonly temperature = signal(START_TEMPERATURE);
  protected readonly humidity = signal(62);
  protected readonly power = signal(0);
  protected readonly doorOpen = signal(false);

  protected readonly history = signal<number[]>([]);
  protected readonly presetNames = Object.keys(PRESETS) as PresetName[];

  private plant: PlantState = { temperature: START_TEMPERATURE, humidity: 62, doorOpenFor: 0 };
  private readonly pid = new Pid({ ...PRESETS.tuned });
  /** L'ambiente serve alla riga di riferimento sul grafico. */
  protected readonly ambient = AMBIENT;
  private timer: ReturnType<typeof setInterval> | null = null;
  private tick = 0;

  constructor() {
    this.start();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // ------------------------------------------------------------------
  // Anello di regolazione
  // ------------------------------------------------------------------

  private start(): void {
    this.stopTimer();

    // Il calcolo gira fuori da Angular; solo il risultato, dieci volte al
    // secondo, rientra per aggiornare la vista. Facendo altrimenti si
    // scatenerebbe un ciclo di change detection ogni cinquantesimo di secondo.
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        if (!this.running()) {
          return;
        }

        for (let i = 0; i < 2; i++) {
          const error = this.plant.temperature - this.setpoint();
          const output = this.pid.step(error, DT);
          this.plant = stepPlant(this.plant, output, DT);
          this.tick++;

          if (this.tick % SAMPLE_EVERY === 0) {
            this.zone.run(() => {
              this.temperature.set(this.plant.temperature);
              this.humidity.set(this.plant.humidity);
              this.power.set(output);
              this.doorOpen.set(this.plant.doorOpenFor > 0);
              this.history.update((h) => [...h, this.plant.temperature].slice(-WINDOW));
            });
          }
        }
      }, 100);
    });
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // ------------------------------------------------------------------
  // Comandi
  // ------------------------------------------------------------------

  protected onSetpoint(event: Event): void {
    this.setpoint.set(Number((event.target as HTMLInputElement).value));
  }

  protected onGain(which: keyof Gains, event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const next = { ...this.gains(), [which]: value };
    this.gains.set(next);
    this.pid.setGains(next);
  }

  protected applyPreset(name: PresetName): void {
    this.preset.set(name);
    const gains = { ...PRESETS[name] };
    this.gains.set(gains);
    this.pid.setGains(gains);
    this.pid.reset();
  }

  protected openDoor(): void {
    this.plant = { ...this.plant, doorOpenFor: 6 };
  }

  protected toggleRun(): void {
    this.running.update((v) => !v);
  }

  protected restart(): void {
    this.plant = { temperature: START_TEMPERATURE, humidity: 62, doorOpenFor: 0 };
    this.pid.reset();
    this.history.set([]);
    this.tick = 0;
    this.running.set(true);
  }

  // ------------------------------------------------------------------
  // Stato leggibile
  // ------------------------------------------------------------------

  protected readonly error = computed(() => this.temperature() - this.setpoint());

  protected readonly status = computed<'ok' | 'working' | 'alarm'>(() => {
    const gap = Math.abs(this.error());
    if (gap > 3) {
      return 'alarm';
    }
    return gap > 0.4 ? 'working' : 'ok';
  });

  // ------------------------------------------------------------------
  // Grafico
  // ------------------------------------------------------------------

  private readonly W = 600;
  private readonly H = 180;
  /** Scala fissa: se si adattasse ai dati, le oscillazioni sembrerebbero
   *  sempre uguali e il confronto fra tarature si perderebbe. */
  private readonly MIN_T = 0;
  private readonly MAX_T = 26;

  private toY(value: number): number {
    const clamped = Math.min(this.MAX_T, Math.max(this.MIN_T, value));
    return this.H - ((clamped - this.MIN_T) / (this.MAX_T - this.MIN_T)) * this.H;
  }

  protected readonly trendPath = computed(() => {
    const data = this.history();
    if (data.length < 2) {
      return '';
    }
    const step = this.W / (WINDOW - 1);
    return data
      .map((value, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${this.toY(value).toFixed(1)}`)
      .join(' ');
  });

  protected readonly setpointY = computed(() => this.toY(this.setpoint()));
  protected readonly ambientY = computed(() => this.toY(AMBIENT));

  protected readonly ticks = computed(() =>
    [0, 6, 12, 18, 24].map((value) => ({ value, y: this.toY(value) })),
  );

  // ------------------------------------------------------------------

  protected format(value: number, digits = 1): string {
    const locale = this.i18n.lang() === 'en' ? 'en-GB' : 'it-IT';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }
}
