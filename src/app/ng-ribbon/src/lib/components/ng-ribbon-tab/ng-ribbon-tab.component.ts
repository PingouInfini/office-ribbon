import {Component, HostBinding, Input, OnDestroy, OnInit, inject, output, input} from '@angular/core';
import {NgRibbonContextComponent} from "../ng-ribbon-context/ng-ribbon-context.component";

@Component({
  selector: 'ng-ribbon-tab',
  template: '<ng-content />',
  host: {
    role: 'tabpanel'
  },
  styleUrls: ['ng-ribbon-tab.component.less']
})
export class NgRibbonTabComponent implements OnInit, OnDestroy {
  // Bindings
  @HostBinding('class.active')
  @Input() public active: boolean;
  public readonly name = input<string>(undefined);
  @Input() public context: NgRibbonContextComponent;
  public readonly order = input(0);

  // Events
  public readonly selected = output<NgRibbonTabComponent>();

  /**
   * Indicates if this tab has been showed
   */
  public showed = false;

  constructor() {
    const context = inject(NgRibbonContextComponent, {optional: true})!;

    this.context = context;
  }

  public ngOnInit() {
    if (!this.context) {
      throw new Error(`Parent context not found for tab '${this.name()}'`);
    }

    this.context.addTab(this);
  }

  public ngOnDestroy() {
    this.context.removeTab(this);
  }
}

