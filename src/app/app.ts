import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import direct depuis les sources locales de la lib
import {
  NgRibbonComponent,
  NgRibbonContextComponent,
  NgRibbonTabComponent,
  NgRibbonGroupComponent,
  NgRibbonSettings
} from './ng-ribbon/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [
    CommonModule,
    NgRibbonComponent,
    NgRibbonContextComponent,
    NgRibbonTabComponent,
    NgRibbonGroupComponent
  ]
})
export class App {
  // Configuration obligatoire du ruban
  public ribbonSettings = new NgRibbonSettings({
    useContexts: false,
    mouseWheelTabs: true   // Permet de changer d'onglet avec la molette
  });

  // Méthode onAction de la sandbox
  public onAction(actionName: string) {
    console.log(`Action déclenchée : ${actionName}`);
  }

  // Méthode pour la sandbox du lanceur de dialogue (la petite flèche en bas à droite du groupe)
  public openGroupDialog(groupName: string) {
    alert(`Ouverture des options avancées pour : ${groupName}`);
  }
}
