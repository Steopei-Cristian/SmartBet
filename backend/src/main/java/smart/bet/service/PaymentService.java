package smart.bet.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.bet.dto.PaymentRequest;
import smart.bet.model.Account;
import smart.bet.model.Transaction;
import smart.bet.model.TransactionType;
import smart.bet.model.User;
import smart.bet.repository.AccountRepository;
import smart.bet.repository.TransactionRepository;
import smart.bet.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Transactional
    public PaymentIntent createPaymentIntent(PaymentRequest request, String username) throws StripeException {
        System.out.println(request);
        Stripe.apiKey = stripeSecretKey;

        // Create PaymentIntent with Stripe
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (request.getAmount() * 100)) // Convert to cents
                .setCurrency("eur")
                .addPaymentMethodType("card") // Only allow card payments
                .setPaymentMethod("pm_card_visa") // Test payment method
                .setConfirm(true)
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        if ("succeeded".equals(paymentIntent.getStatus())) {
            // Get user and account
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));

            // Update account balance
            if (TransactionType.valueOf(request.getType()).equals(TransactionType.DEPOSIT)) {
                account.setBalance(account.getBalance() + request.getAmount());
            } else if (TransactionType.valueOf(request.getType()).equals(TransactionType.RETRIEVAL)) {
                if (account.getBalance() < request.getAmount()) {
                    throw new RuntimeException("Insufficient funds");
                }
                account.setBalance(account.getBalance() - request.getAmount());
            }
            accountRepository.save(account);

            // Create transaction record
            Transaction transaction = new Transaction();
            transaction.setAmount(request.getAmount());
            transaction.setCardNumber(request.getCardNumber());
            transaction.setDate(LocalDateTime.parse(request.getDate(), DateTimeFormatter.ISO_DATE_TIME));
            transaction.setTransactionType("DEPOSIT".equals(request.getType()) ? TransactionType.DEPOSIT : TransactionType.RETRIEVAL);
            transaction.setAccount(account);
            System.out.println(transaction);
            transactionRepository.save(transaction);
        }

        return paymentIntent;
    }
} 