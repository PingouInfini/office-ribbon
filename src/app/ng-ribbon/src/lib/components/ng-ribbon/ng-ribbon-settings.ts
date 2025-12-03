export class NgRibbonSettings {
  public mainTabName: string | false;
  public onMainTabActive: (element: HTMLElement) => void = () => {
  };

  public useContexts = true;

  public mouseWheelTabs = true;

  constructor(settings?: Partial<NgRibbonSettings>) {
    if (settings) {
      Object.assign(this, settings);
    }
  }
}
