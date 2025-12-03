import {Component, HostListener, Input, output, ElementRef, Renderer2, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {NgRibbonTabComponent} from "../ng-ribbon-tab/ng-ribbon-tab.component";
import {NgRibbonSettings} from "./ng-ribbon-settings";
import {NgRibbonContextComponent} from "../ng-ribbon-context/ng-ribbon-context.component";
import {NgStyle} from '@angular/common';
@Component({
  selector: 'ng-ribbon',
  template: `
    <div class="contexts" [ngStyle]="{borderColor: selectedTab?.context?.color() || '#dadbdc'}">
      @for (context of contexts; track context; let firstContext = $first) {
      <div class="context" [ngStyle]="{backgroundColor: context.color()}">
          <ul role="tablist">
            @if (firstContext && settings.mainTabName) {
      <li #mainTab role="button" class="main">
        <a (click)="settings.onMainTabActive(mainTab)">{{ settings.mainTabName }}</a>
      </li>
      }
      @for (tab of context.tabs; track tab) {
      <li
        role="tab" [attr.aria-selected]="tab.active"
        [class.active]="tab.active">
        <a (click)="selectTab(tab)" (dblclick)="toggleCollapse()">
          {{ tab.name() }}
        </a>
      </li>
      }
      </ul>
    </div>
      }

      <div class="spacer"></div>

      <div
        class="collapse-btn"
        (click)="toggleCollapse()"
        [class.closed]="isCollapsed"
        title="Réduire/Agrandir le ruban"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    </div>

    <div class="ribbon-content" [class.collapsed]="isCollapsed && !isFloating">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['ng-ribbon.component.less'],
  imports: [NgStyle]
})
export class NgRibbonComponent implements OnDestroy {
  @Input() public settings = new NgRibbonSettings();
  public readonly tabSelected = output<NgRibbonTabComponent>();

  public contexts: NgRibbonContextComponent[] = [];
  public selectedTab?: NgRibbonTabComponent;

  // État de réduction
  public isCollapsed = false;
  // Indique si le ruban est étendu temporairement (mode hybride)
  public isFloating = false;

  // Référence au listener d'événements global
  private clickListener: () => void;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.clickListener = this.renderer.listen('document', 'click', (event) => {

      // Si la condition de fermeture est remplie
      if (this.isFloating && !this.elementRef.nativeElement.contains(event.target)) {
        this.isFloating = false; // Mise à jour de l'état
        this.cdr.detectChanges(); // Forcer la mise à jour du DOM
      }
    });
  }

  // Nettoyage du listener event
  ngOnDestroy() {
    if (this.clickListener) {
      this.clickListener();
    }
  }

  public selectTab(tab: NgRibbonTabComponent) {
    tab.showed = true;
    this.contexts.forEach(c => c.tabs.forEach(t => t.active = t == tab));
    this.selectedTab = tab;

    // MODIFICATION :
    if (this.isCollapsed) {
      // Si nous sommes en mode collapse et qu'on clique, on passe en mode flottant
      this.isFloating = true;
    } else {
      // Si on clique normalement, on retire le mode flottant (car on est en mode étendu permanent)
      this.isFloating = false;
    }

    tab.selected.emit(tab);
    this.tabSelected.emit(tab);
  }

  // Méthode de bascule
  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.isFloating = false;
  }

  public addContext(context: NgRibbonContextComponent) {
    this.contexts.push(context);
    if (this.contexts.length === 1 && context.tabs.length) {
      this.selectTab(context.tabs[0]);
    }
  }

  public removeContext(context: NgRibbonContextComponent) {
    const index = this.contexts.indexOf(context);
    if (index >= 0) {
      this.contexts.splice(index, 1);
      const hasActiveTab = this.contexts.find(context => context.tabs.find(t => t.active));
      if (!hasActiveTab && this.contexts.length && this.contexts[0].tabs.length) {
        this.selectTab(this.contexts[0].tabs[0]);
      }
    }
  }

  @HostListener('wheel', ['$event'])
  public onWheel($event: WheelEvent) {
    // Optionnel : empêcher le scroll si le ruban est fermé ?
    if (this.isCollapsed) return;

    if (this.settings.mouseWheelTabs) {
      // ... logique existante du wheel ...
      if ($event.deltaY > 0) {
        let selectCurrentTab = false;
        this.contexts.forEach(c => c.tabs.forEach(t => {
          if (t == this.selectedTab) {
            selectCurrentTab = true;
          } else if (selectCurrentTab) {
            this.selectTab(t);
            selectCurrentTab = false;
          }
        }));
      } else if ($event.deltaY < 0) {
        let prevTab: NgRibbonTabComponent | null = null;
        let selectTab: NgRibbonTabComponent | null = null;
        this.contexts.forEach(c => c.tabs.forEach(t => {
          if (t == this.selectedTab) {
            selectTab = prevTab;
          }
          prevTab = t;
        }));
        if (selectTab) {
          this.selectTab(selectTab);
        }
      }
      $event.preventDefault();
      $event.stopPropagation();
    }
  }
}
