import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styles: `
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
      gap: 18px;
    }

    .hero-card {
      display: grid;
      gap: 18px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgb(47 111 237 / 0.08);
      color: var(--cs-color-primary-strong);
      font-weight: 700;
    }

    .hero-heading {
      margin: 0;
      color: var(--cs-color-ink);
      font-size: clamp(2rem, 3vw, 3rem);
      line-height: 1;
      letter-spacing: -0.04em;
    }

    .hero-copy {
      margin: 0;
      max-width: 62ch;
      color: var(--cs-color-muted);
      font-size: 1rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .stat-card {
      padding: 20px;
      border: 1px solid rgb(217 226 241 / 0.88);
      border-radius: 18px;
      background: linear-gradient(180deg, #fff, #f7faff);
    }

    .stat-label {
      display: block;
      margin-bottom: 8px;
      color: var(--cs-color-muted);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .stat-value {
      color: var(--cs-color-ink);
      font-size: 1.8rem;
      font-weight: 800;
      line-height: 1;
    }

    .stat-help {
      margin-top: 8px;
      color: var(--cs-color-muted);
      font-size: 0.9rem;
    }

    .aside-list {
      display: grid;
      gap: 12px;
      padding-left: 18px;
      margin: 0;
      color: var(--cs-color-text);
    }

    @media (max-width: 991.98px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class DashboardComponent {

}
