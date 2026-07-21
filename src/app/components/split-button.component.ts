import {Component, TemplateRef, output, input} from '@angular/core';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MenuTriggerDirective} from './menu-trigger.directive';

@Component({
  selector: 'app-split-button',
  template: `
    <button class="sm" mat-button (click)="mainBtnClick.emit($event)" [class.active]="isActive()" [disabled]="disabled()">
      <ng-content></ng-content>
    </button>
    @if (isMatMenu) {
      <button
        mat-button class="split-button" [matMenuTriggerFor]="$any(dropDownMenu())" #matTrigger="matMenuTrigger" [class.active]="isActive() || matTrigger.menuOpen" [disabled]="disabled()">
        <mat-icon class="drop-down-icon">arrow_drop_down</mat-icon>
      </button>
    } @else {
      <button mat-button class="split-button" [menuTriggerFor]="$any(dropDownMenu())" #customTrigger="menuTrigger" [class.active]="isActive() || customTrigger.isOpen" [disabled]="disabled()">
        <mat-icon class="drop-down-icon">arrow_drop_down</mat-icon>
      </button>
    }
    `,
  styles: [`
      .split-button {
        padding: 0 5px 0 0;
        margin-left: -5px;
        min-width: auto;
        font-weight: normal;
      }

      mat-icon {
        width: 20px !important;
      }
    `],
  imports: [MatButton, MatMenuTrigger, MatIcon, MenuTriggerDirective]
})
export class SplitButtonComponent {
  public readonly disabled = input(false);
  public readonly isActive = input(false);
  public readonly dropDownMenu = input<TemplateRef<any> | MatMenu | undefined>(undefined);
  public readonly mainBtnClick = output<MouseEvent>();

  public get isMatMenu() {
    return this.dropDownMenu() instanceof MatMenu;
  }
}
