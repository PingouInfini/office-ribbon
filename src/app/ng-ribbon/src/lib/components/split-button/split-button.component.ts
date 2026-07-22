import {Component, TemplateRef, output, input, ViewChild} from '@angular/core';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MenuTriggerDirective} from '../../directives/menu-trigger.directive';

@Component({
  selector: 'app-split-button',
  template: `
    <button class="ribbon-button split-main" (click)="mainBtnClick.emit($event)" [class.active]="isActive() || isMenuOpen" [disabled]="disabled()">
      <ng-content></ng-content>
    </button>
    @if (isMatMenu) {
      <button class="ribbon-button split-arrow" [matMenuTriggerFor]="$any(dropDownMenu())" #matTrigger="matMenuTrigger" [class.active]="isActive() || matTrigger.menuOpen" [disabled]="disabled()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
      </button>
    } @else {
      <button class="ribbon-button split-arrow" [menuTriggerFor]="$any(dropDownMenu())" #customTrigger="menuTrigger" [class.active]="isActive() || customTrigger.isOpen" [disabled]="disabled()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
      </button>
    }
    `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: stretch;
      height: 36.667px;
    }
    .split-main {
      width: 36px;
      height: 100%;
      padding: 0;
      border: none !important;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .split-arrow {
      width: 18px;
      height: 100%;
      padding: 0;
      border: none !important;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .active, .split-main:hover, .split-arrow:hover {
      background-color: #cde6f7 !important;
    }
    .split-main:active, .split-arrow:active {
      background-color: #a3d1f0 !important;
    }
  `],
  imports: [MatMenuTrigger, MenuTriggerDirective]
})
export class SplitButtonComponent {
  public readonly disabled = input(false);
  public readonly isActive = input(false);
  public readonly dropDownMenu = input<TemplateRef<any> | MatMenu | undefined>(undefined);
  public readonly mainBtnClick = output<MouseEvent>();

  @ViewChild('matTrigger') matTrigger?: MatMenuTrigger;
  @ViewChild('customTrigger') customTrigger?: MenuTriggerDirective;

  public get isMenuOpen(): boolean {
    return this.matTrigger?.menuOpen || this.customTrigger?.isOpen || false;
  }

  public get isMatMenu() {
    return this.dropDownMenu() instanceof MatMenu;
  }
}
