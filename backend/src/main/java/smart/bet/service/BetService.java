package smart.bet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.bet.dto.PlaceBetRequest;
import smart.bet.dto.BetSelectionRequest;
import smart.bet.model.*;
import smart.bet.repository.*;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BetService {
    private final UserRepository userRepository;
    private final BetBuilderRepository betBuilderRepository;
    private final BetSelectionRepository betSelectionRepository;
    private final OddRepository oddRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public BetBuilder placeBet(PlaceBetRequest request, String username) {
        // Get user from username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Get user's account and check balance
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));

        if (account.getBalance() < request.getStake()) {
            throw new RuntimeException("Insufficient funds");
        }

        // Update account balance
        account.setBalance(account.getBalance() - request.getStake());
        accountRepository.save(account);

        // Create and save bet builder
        BetBuilder betBuilder = new BetBuilder();
        betBuilder.setUser(user);
        betBuilder.setStake(request.getStake());
        betBuilder = betBuilderRepository.save(betBuilder);

        // Create bet selections
        List<BetSelection> selections = new ArrayList<>();
        for (var selectionRequest : request.getSelections()) {
            // Find the odd for this match
            Odd odd = oddRepository.findByMatchId(selectionRequest.getMatchId())
                    .orElseThrow(() -> new RuntimeException("Odd not found for match: " + selectionRequest.getMatchId()));

            // Create bet selection
            BetSelection selection = new BetSelection();
            selection.setBuilder(betBuilder);
            selection.setOdd(odd);
            selection.setSelection(SelectionType.valueOf(selectionRequest.getOddType().toUpperCase()));
            selections.add(selection);
        }

        // Save all selections
        betSelectionRepository.saveAll(selections);

        return betBuilder;
    }
} 