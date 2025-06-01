import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StripeService } from '../../services/stripe.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-retrieval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retrieval.component.html',
  styleUrls: ['./retrieval.component.css']
})
export class RetrievalComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElement!: ElementRef;
  amount: number = 0;
  error: string = '';
  loading: boolean = false;
  private card: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    private stripeService: StripeService
  ) {}

  async ngOnInit() {
    try {
      const elements = await this.stripeService.createElements();
      this.card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          }
        },
        hidePostalCode: true
      });
      this.card.mount(this.cardElement.nativeElement);
    } catch (error) {
      this.error = 'Failed to initialize payment form';
      console.error('Stripe initialization error:', error);
    }
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }

  async onSubmit() {
    if (this.amount <= 0) {
      this.error = 'Please enter a valid amount';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.stripeService.createPaymentIntent(this.amount, 'retrieval');
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 400) {
        // Display the error message from the backend
        this.error = error.error.message || 'Insufficient balance for retrieval';
      } else {
        this.error = error instanceof Error ? error.message : 'Payment failed. Please try again';
      }
      this.loading = false;
    }
  }
} 