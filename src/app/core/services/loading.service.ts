import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { LoadingComponent } from '../components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private overlayRef: OverlayRef;

  private showSubscription: Subscription = new Subscription();
  private hideSubscription: Subscription = new Subscription();

  constructor(private overlay: Overlay) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'loading-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });
  }

  show(): void {
    if (!this.hideSubscription || this.hideSubscription.closed) {
      // Se não existe um evento para esconder, ou o evento já aconteceu, cria um evento para mostrar
      this.showSubscription = this.getEventObservable().subscribe(() => {
        if (!this.overlayRef.hasAttached()) {
          this.overlayRef.attach(new ComponentPortal(LoadingComponent));
        }
      });
    } else {
      // Se existe um evento para esconder quer dizer que já está sendo mostrado, cancela o evento de esconder
      this.hideSubscription.unsubscribe();
    }
  }

  hide(): void {
    if (!this.showSubscription || this.showSubscription.closed) {
      // Se não existe um evento para mostrar, ou o evento já aconteceu, cria um evento para esconder
      this.hideSubscription = this.getEventObservable().subscribe(() => {
        this.overlayRef.detach();
      });
    } else {
      // Se existe um evento para mostrar quer dizer que já está escondido, cancela o evento para mostrar
      this.showSubscription.unsubscribe();
    }
  }

  private getEventObservable(): Observable<any> {
    // Cria um evento que é executado após um delay e cancela a Subscription quando é disparado
    return of(null).pipe(delay(100), first());
  }
}
