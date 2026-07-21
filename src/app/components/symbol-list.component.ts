import {Component, output, input} from '@angular/core';
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
      max-height: 75px;
      min-width: 200px;
      max-width: 700px;
      overflow-y: scroll;
      background: #fafbfc;
      border: 1px solid #dbdcdd;
      padding: 5px;
    }

    div {
      margin-bottom: 10px;
    }

    h3 {
      color: rgba(0, 0, 0, .54);
      font-size: 14px;
      margin: 0 0 5px 0;
      border-bottom: 1px solid rgba(0, 0, 0, .14);
    }

    button {
      font-size: 40px;
      padding: 0 10px;
      margin-bottom: 10px;
      width: 40px;
      max-width: 40px;
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
}
