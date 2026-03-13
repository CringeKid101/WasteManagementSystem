import { Injectable } from '@angular/core';
import { OAUTH_CONFIG } from '../../config/oauth.config';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuth {
   initialize(callback: (response: any) => void) {

    google.accounts.id.initialize({
      client_id: OAUTH_CONFIG.GOOGLE_CLIENT_ID,
      callback: callback
    });

  }

  renderButton(element: HTMLElement | null) {
  google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      shape: "pill",
      width: 300,
    });
  }
}
