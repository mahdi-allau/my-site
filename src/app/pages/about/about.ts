import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SKILL_GROUPS } from '../../core/seed-content';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
})
export class About {
  protected readonly skillGroups = SKILL_GROUPS;

  protected readonly areas = [
    {
      title: 'Sviluppo web',
      body:
        'Angular e TypeScript per interfacce che restano veloci e ordinate anche quando il progetto cresce. PostgreSQL e Supabase per i dati, l’autenticazione e i file.',
      stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    },
    {
      title: 'Dati e analisi',
      body:
        'Raccolta, pulizia e modellazione dei dati con Python e SQL, per arrivare a dashboard che rispondono alle domande vere di un’attività invece di riempire pagine di grafici.',
      stack: ['Python', 'SQL', 'PostgreSQL', 'Power BI'],
    },
    {
      title: 'Sistemi embedded e IoT',
      body:
        'Firmware su Arduino ed ESP32, lettura di sensori e regolazione con controllo PID. È la parte del mio percorso che mi ha insegnato a lavorare con vincoli stretti e a testare sul campo.',
      stack: ['Arduino', 'ESP32', 'C', 'C++', 'MATLAB'],
    },
  ];

  protected readonly principles = [
    {
      title: 'Prima il problema, poi la tecnologia',
      body:
        'Scelgo lo strumento dopo aver capito cosa serve. A volte la risposta giusta è una pagina statica, non un’applicazione.',
    },
    {
      title: 'Niente template riadattati',
      body:
        'Ogni sito viene costruito partendo dal contenuto reale dell’attività. Si vede, e soprattutto si sente nella velocità di caricamento.',
    },
    {
      title: 'Autonomia dopo la consegna',
      body:
        'Il pannello di amministrazione fa parte del progetto: menù, foto e testi si aggiornano senza dover chiamare nessuno.',
    },
    {
      title: 'Parlare chiaro',
      body:
        'Preventivi leggibili, tempi realistici e nessun gergo inutile. Se qualcosa non conviene farla, lo dico.',
    },
  ];
}
