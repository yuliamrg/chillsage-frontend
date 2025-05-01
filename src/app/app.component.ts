import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // utiliza las rutas cargadas con la funcion provideRoutes configuradas en app.config.ts
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

// Decorador @Component que define los metadatos del componente
@Component({
  selector: 'app-root',
  standalone: true, // Indica que es un componente independiente
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

// Clase AppComponent que representa el componente y toma los metadatos del decorador
export class AppComponent {
  title = 'chillsage';
}
