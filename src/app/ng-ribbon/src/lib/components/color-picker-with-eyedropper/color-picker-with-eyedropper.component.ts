import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorSketchModule } from 'ngx-color/sketch';
import { MatIconModule } from '@angular/material/icon';
import { IconsService } from '../../services/icons.service';

@Component({
  selector: 'color-picker-with-eyedropper',
  standalone: true,
  imports: [CommonModule, ColorSketchModule, MatIconModule],
  templateUrl: './color-picker-with-eyedropper.component.html',
  styleUrls: ['./color-picker-with-eyedropper.component.css']
})
export class ColorPickerWithEyedropperComponent {
  // Propriétés d'entrée pour configurer le sélecteur
  public color = input<string>('#000000');
  public presetColors = input<string[]>([]);
  public width = input<number>(220);
  public captureTargetId = input<string>(''); 

  // Événement émis lors du changement de couleur
  public colorChange = output<any>();
  
  // Vérifie si l'API native EyeDropper (Chrome/Edge) est supportée
  public isNativeEyeDropperSupported = 'EyeDropper' in window;
  public localColor: string = '#000000';

  constructor(private iconsService: IconsService) {
    this.iconsService.configure();
    // Synchronise la couleur locale avec l'input Angular
    effect(() => {
      this.localColor = this.color();
    });
  }

  // Gère le changement de couleur depuis le composant tiers ngx-color
  public onSketchChange(event: any) {
    this.localColor = event.color.hex;
    this.colorChange.emit(event);
  }

  // Point d'entrée principal pour ouvrir la pipette (native ou fallback)
  public async openEyeDropper() {
    if (this.isNativeEyeDropperSupported) {
      try {
        (window as any).isEyeDropperActive = true;
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        
        setTimeout(() => { (window as any).isEyeDropperActive = false; }, 200);

        if (result?.sRGBHex) {
          this.processAndEmitColor(result.sRGBHex);
        }
      } catch (e) {
        (window as any).isEyeDropperActive = false;
      }
    } else {
      await this.runFirefoxFallback();
    }
  }

  // Fallback personnalisé basé sur la capture DOM (pour Firefox ou autres navigateurs sans EyeDropper natif)
  private async runFirefoxFallback() {
    (window as any).isEyeDropperActive = true;

    // Masque le curseur de la souris par défaut sur tout le document pendant la phase de sélection
    const cursorStyleTag = document.createElement('style');
    cursorStyleTag.id = 'eyedropper-cursor-hide';
    cursorStyleTag.innerHTML = `*, *:hover { cursor: none !important; }`;
    document.head.appendChild(cursorStyleTag);

    // 1. Création de l'overlay global bloquant les interactions de l'application sous-jacente
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 2147483645; background-color: rgba(0, 0, 0, 0.01); touch-action: none;
    `;
    document.body.appendChild(overlay);

    // 2. Création du badge d'information textuel en haut de l'écran
    const badge = document.createElement('div');
    badge.textContent = 'Préparation de la pipette...';
    badge.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      padding: 8px 18px; background-color: #1e1e1e; color: #ffffff;
      border-radius: 20px; font-size: 13px; font-family: sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 2147483647;
      pointer-events: none; border: 1px solid rgba(255,255,255,0.2);
    `;
    document.body.appendChild(badge);

    // 3. Création de la loupe visuelle faisant office de curseur personnalisé
    const loupe = document.createElement('div');
    loupe.style.cssText = `
      position: fixed; width: 90px; height: 90px; border-radius: 50%;
      border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.3);
      pointer-events: none; z-index: 2147483647; display: none;
      overflow: hidden; background-color: #ffffff;
    `;
    const loupeCanvas = document.createElement('canvas');
    loupeCanvas.width = 90;
    loupeCanvas.height = 90;
    loupe.appendChild(loupeCanvas);
    document.body.appendChild(loupe);

    const lCtx = loupeCanvas.getContext('2d');
    if (lCtx) lCtx.imageSmoothingEnabled = false;

    // Fonction sécurisée de nettoyage des éléments DOM injectés
    let isCleanedUp = false;
    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      overlay.remove();
      badge.remove();
      loupe.remove();
      document.getElementById('eyedropper-cursor-hide')?.remove();
      (window as any).isEyeDropperActive = false;
    };

    try {
      const { domToCanvas } = await import('modern-screenshot');
      const targetElement = this.captureTargetId() 
        ? document.getElementById(this.captureTargetId()) || document.body 
        : document.body;

      // Capture de l'élément cible SANS exclure le composant de sélection lui-même, 
      // pour permettre de prélever des couleurs directement dans le menu de sélection.
      const canvas = await domToCanvas(targetElement, {
        scale: 1,
        filter: (node) => node instanceof HTMLElement ? !node.classList.contains('color-picker-wrapper') && node !== overlay && node !== badge && node !== loupe : true
      });

      badge.textContent = 'Cliquez pour sélectionner une couleur (Échap pour annuler)';

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Context 2D inaccessible');

      // Vérification des restrictions de sécurité CORS
      try {
        ctx.getImageData(0, 0, 1, 1);
      } catch (e) {
        cleanup();
        this.fallbackToNativeInput();
        return;
      }

      // Calcul des coordonnées relatives par rapport à l'élément capturé
      const getCanvasCoords = (e: MouseEvent) => {
        const rect = targetElement.getBoundingClientRect();
        return {
          x: Math.round(e.clientX - rect.left),
          y: Math.round(e.clientY - rect.top)
        };
      };

      // Attente active des interactions utilisateur (mouvement, clic ou annulation)
      const hexColor = await new Promise<string | null>((resolve) => {
        const onMouseMove = (e: MouseEvent) => {
          e.stopPropagation();
          loupe.style.display = 'block';
          
          // Positionne la loupe centrée exactement sur le curseur de la souris
          loupe.style.left = `${e.clientX - 45}px`;
          loupe.style.top = `${e.clientY - 45}px`;

          if (lCtx) {
            const { x, y } = getCanvasCoords(e);
            const zoomArea = 10;
            const sx = Math.max(0, Math.min(canvas.width - zoomArea, x - 5));
            const sy = Math.max(0, Math.min(canvas.height - zoomArea, y - 5));

            lCtx.clearRect(0, 0, 90, 90);
            try {
              lCtx.drawImage(canvas, sx, sy, zoomArea, zoomArea, 0, 0, 90, 90);
            } catch {}

            // Dessin de la mire centrale sur la loupe
            lCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            lCtx.lineWidth = 1.5;
            lCtx.strokeRect(41, 41, 8, 8);
            lCtx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            lCtx.strokeRect(40, 40, 10, 10);
          }
        };

        const onClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const { x, y } = getCanvasCoords(e);
          let hex: string | null = null;
          
          if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              hex = '#' + [pixel[0], pixel[1], pixel[2]]
                .map(val => val.toString(16).padStart(2, '0'))
                .join('');
            } catch (err) {
              // Gestion silencieuse de l'erreur de lecture du pixel
            }
          }
          removeListeners();
          resolve(hex);
        };

        const onKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            removeListeners();
            resolve(null);
          }
        };

        const removeListeners = () => {
          window.removeEventListener('mousemove', onMouseMove, { capture: true });
          window.removeEventListener('click', onClick, { capture: true });
          window.removeEventListener('keydown', onKeydown, { capture: true });
          cleanup();
        };

        window.addEventListener('mousemove', onMouseMove, { capture: true });
        window.addEventListener('click', onClick, { capture: true });
        window.addEventListener('keydown', onKeydown, { capture: true });
      });

      if (hexColor) {
        this.processAndEmitColor(hexColor);
      }

    } catch (e) {
      cleanup();
      this.fallbackToNativeInput();
    }
  }

  // Fallback ultime utilisant l'input natif de type color du navigateur
  private fallbackToNativeInput() {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = this.localColor;
    input.style.cssText = 'position: fixed; opacity: 0; pointer-events: none;';
    document.body.appendChild(input);

    input.addEventListener('change', () => {
      if (input.value) this.processAndEmitColor(input.value);
      input.remove();
    });

    if ('showPicker' in HTMLInputElement.prototype) {
      input.showPicker();
    } else {
      input.click();
    }
  }

  // Convertit le code hexadécimal en RGB et émet l'événement vers le composant parent
  private processAndEmitColor(hex: string) {
    this.localColor = hex;
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    this.colorChange.emit({
      color: {
        hex: hex,
        rgb: { r, g, b, a: 1 }
      }
    });
  }
}