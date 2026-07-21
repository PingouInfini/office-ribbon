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

import { ColorSketchModule } from 'ngx-color/sketch';
import { SplitButtonComponent } from './components/split-button.component';
import { SymbolListComponent } from './components/symbol-list.component';
import { IconsService } from './components/icons.service';
import { MatIconModule } from '@angular/material/icon';

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
    NgRibbonGroupComponent,
    ColorSketchModule,
    SplitButtonComponent,
    SymbolListComponent,
    MatIconModule
  ]
})
export class App {
  // Configuration obligatoire du ruban
  public ribbonSettings = new NgRibbonSettings({
    useContexts: false,
    mouseWheelTabs: true   // Permet de changer d'onglet avec la molette
  });

  public backColor = 'yellow';
  public foreColor = 'red';

  constructor(private iconsService: IconsService) {
    this.iconsService.configure();
  }

  // Méthode onAction de la sandbox
  public onAction(actionName: string) {
    console.log(`Action déclenchée : ${actionName}`);
  }

  // Méthode pour la sandbox du lanceur de dialogue (la petite flèche en bas à droite du groupe)
  public openGroupDialog(groupName: string) {
    alert(`Ouverture des options avancées pour : ${groupName}`);
  }
}
