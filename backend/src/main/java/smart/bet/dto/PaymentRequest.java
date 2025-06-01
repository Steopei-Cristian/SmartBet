package smart.bet.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private double amount;
    private String cardNumber;
    private String date;
    private String type;  // "DEPOSIT" or "WITHDRAWAL"
} 