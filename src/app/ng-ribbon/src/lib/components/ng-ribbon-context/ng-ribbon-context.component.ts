import {Component, Input, OnDestroy, OnInit, TemplateRef, inject, contentChild, input} from '@angular/core';
import {NgRibbonComponent} from "../ng-ribbon/ng-ribbon.component";
import {NgRibbonTabComponent} from "../ng-ribbon-tab/ng-ribbon-tab.component";

@Component({
  selector: 'ng-ribbon-context',
  template: '<ng-content />',
  styles: [
    `:host {
      display: block;
    }`
  ]
})
export class NgRibbonContextComponent implements OnInit, OnDestroy {
  public readonly name = input<string>(undefined);
  public readonly color = input<string>(undefined);
  @Input() public ribbon: NgRibbonComponent;

  public readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  public tabs: NgRibbonTabComponent[] = [];

  constructor() {
    const ribbon = inject(NgRibbonComponent, {optional: true})!;

    this.ribbon = ribbon;
  }

  public ngOnInit() {
    if (!this.ribbon) {
      throw new Error(`Parent ribbon not found for context '${this.name()}'`);
    }

    this.ribbon.addContext(this);
  }

  public ngOnDestroy() {
    this.ribbon.removeContext(this);
  }

  public addTab(tab: NgRibbonTabComponent) {
    this.tabs.push(tab);

    this.tabs = this.tabs.sort((a, b) => a.order() - b.order());

    if (tab.active) {
      this.ribbon.selectTab(tab);
    }
  }

  public removeTab(tab: NgRibbonTabComponent) {
    const index = this.tabs.indexOf(tab);

    if (index >= 0) {
      // Seleccionar otra pestaña
      if (tab.active && this.tabs.length > 1) {
        const newActiveIndex = index === this.tabs.length - 1 ? index - 1 : index + 1;
        this.ribbon.selectTab(this.tabs[newActiveIndex]);
      }

      this.tabs.splice(index, 1);
    }
  }
}

