import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import direct depuis les sources locales de la lib
import {
  NgRibbonComponent,
  NgRibbonContextComponent,
  NgRibbonTabComponent,
  NgRibbonGroupComponent,
  NgRibbonSettings,
  SplitButtonComponent,
  SymbolListComponent,
  IconsService
} from './ng-ribbon/src/public-api';

import { ColorSketchModule } from 'ngx-color/sketch';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatIconModule,
    MatTooltipModule
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

  public onColorChange(type: 'back' | 'fore', event: any) {
    const rgba = event.color.rgb;
    const colorStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    if (type === 'back') {
      this.backColor = colorStr;
      this.onAction('Couleur Fond: ' + colorStr);
    } else {
      this.foreColor = colorStr;
      this.onAction('Couleur Texte: ' + colorStr);
    }
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
