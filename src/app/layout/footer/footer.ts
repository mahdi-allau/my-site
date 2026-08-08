import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly email = environment.contactEmail;

  protected readonly siteLinks = [
    { label: 'Home', path: '/' },
    { label: 'Chi sono', path: '/about' },
    { label: 'Progetti', path: '/projects' },
    { label: 'Servizi', path: '/services' },
    { label: 'Contatti', path: '/contact' },
  ];
}
