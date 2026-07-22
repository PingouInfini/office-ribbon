import {Component, output, input, HostListener} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-symbol-list',
  template: `
    @for (category of symbols; track category) {
      <div>
        <h3>{{ category.name }}</h3>
        @for (symbol of category.symbols; track symbol) {
          <button
          mat-button (click)="symbolSelected.emit(symbol)" [disabled]="disabled()">{{ symbol }}</button>
        }
      </div>
    }
    `,
  styles: [`
    :host {
      display: block;
      max-height: 55px;
      min-width: 200px;
      max-width: 700px;
      overflow-y: scroll;
      background: #fafbfc;
      border: 1px solid #dbdcdd;
      padding: 2px;
    }

    div {
      margin-bottom: 5px;
    }

    h3 {
      color: rgba(0, 0, 0, .54);
      font-size: 11px;
      margin: 0 0 2px 0;
      border-bottom: 1px solid rgba(0, 0, 0, .14);
    }

    button {
      font-size: 20px;
      padding: 0 5px;
      margin-bottom: 2px;
      width: 30px;
      max-width: 30px;
      min-width: 30px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    button:hover {
      background-color: #e1f0fa;
      border-color: #92c0e0;
      transform: scale(1.1);
    }
  `],
  imports: [MatButton]
})
export class SymbolListComponent {
  public readonly disabled = input(false);
  public readonly symbolSelected = output<string>();

  public readonly symbols = [
    {
      name: "Lettres grecques",
      symbols: ["α", "β", "Γ", "γ", "Δ", "δ", "ε", "ζ", "η", "Θ", "θ", "ι", "κ", "Λ", "λ", "μ", "ν", "Ξ", "Xi", "ο", "Π", "π", "ρ", "Σ", "σ", "τ", "υ", "Φ", "φ", "χ", "Ψ", "ψ", "Ω", "ω"]
    },
    {
      name: "Mathématiques",
      symbols: ["¹", "²", "³", "ⁿ", "‰", "∂", "∫", "∆", "∑", "∏", "√", "∞", "∩", "⅞", "≈", "≠", "≤", "≥", "÷", "½", "⅓", "⅔", "¼", "¾", "⅛", "⅜", "⅝"]
    },
    {
      name: "Flèches",
      symbols: ["←", "↑", "→", "↓", "↔", "↕"]
    },
    {
      name: "Divers",
      symbols: ["•", "♪", "♫", "♀", "♂", "♠", "♣", "♥", "♦", "©", "®", "™", "¬"]
    },
    {
      name: "Devises",
      symbols: ["€", "$", "£", "¢", "¥", "¤", "₧", "₨", "￦"]
    },
  ]

  @HostListener('wheel', ['$event'])
  public onWheel(event: WheelEvent) {
    event.stopPropagation();
  }
}
