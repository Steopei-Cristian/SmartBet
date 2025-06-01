import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { BalanceService } from './balance.service';

interface PaymentRequest {
  amount: number;
  cardNumber: string;
  date: string; // ISO string without timezone
  type: 'DEPOSIT' | 'RETRIEVAL';
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private balanceService: BalanceService
  ) {}

  async initializeStripe(): Promise<Stripe> {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublicKey);
      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }
    }
    return this.stripe;
  }

  async createElements(): Promise<StripeElements> {
    if (!this.elements) {
      const stripe = await this.initializeStripe();
      this.elements = stripe.elements();
    }
    return this.elements;
  }

  getElements(): StripeElements | null {
    return this.elements;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async createPaymentIntent(amount: number, type: 'deposit' | 'retrieval'): Promise<void> {
    if (!this.stripe) throw new Error('Stripe not initialized');
    if (!this.elements) throw new Error('Stripe Elements not initialized');

    try {
      // Get card details from Stripe Elements
      const { paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.elements.getElement('card')!,
      });

      if (!paymentMethod) throw new Error('Failed to create payment method');

      // Create payment request with the new format
      const paymentRequest: PaymentRequest = {
        amount,
        cardNumber: paymentMethod.card?.last4 || '',
        date: new Date().toISOString().split('.')[0], // Format: YYYY-MM-DDTHH:mm:ss
        type: type.toUpperCase() as 'DEPOSIT' | 'RETRIEVAL'
      };

      // Send request to backend with auth headers
      await firstValueFrom(
        this.http.post(
          `${this.apiUrl}/create-intent`,
          paymentRequest,
          { headers: this.getAuthHeaders() }
        )
      );

      // Refresh balance and redirect
      const username = this.authService.getCurrentUser()?.username;
      if (username) {
        this.balanceService.refreshBalance(username);
      }
      this.router.navigate(['/matches']);
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }
} 