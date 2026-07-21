import {Directive, ElementRef, EmbeddedViewRef, HostListener, OnDestroy, TemplateRef, ViewContainerRef, inject, input} from '@angular/core';
import {ConnectionPositionPair, Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Directive({selector: '[menuTriggerFor]'})
export class MenuTriggerDirective implements OnDestroy {
  private _overlaySvc = inject(Overlay);
  private _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _viewContainerRef = inject(ViewContainerRef);

  public readonly menuTriggerFor = input<TemplateRef<any> | undefined>(undefined);

  private _overlayRef!: OverlayRef;
  private _embeddedViewRef!: EmbeddedViewRef<any>;

  @HostListener('click')
  public onClick() {
    const overlayRef = this._overlaySvc.create({
        hasBackdrop: true,
        backdropClass: '',
        positionStrategy: this._overlaySvc.position()
          .flexibleConnectedTo(this._host)
          .withPositions([
            new ConnectionPositionPair({originX: 'start', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'}),
            new ConnectionPositionPair({originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'})
          ]),
        scrollStrategy: this._overlaySvc.scrollStrategies.block(),
      }
    );
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    if (this.menuTriggerFor()) {
      const templatePortal = new TemplatePortal(this.menuTriggerFor()!, this._viewContainerRef);
      this._embeddedViewRef = overlayRef.attach(templatePortal);
    }
  }


  public ngOnDestroy() {
    this._embeddedViewRef?.destroy();

    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }
  }
}

