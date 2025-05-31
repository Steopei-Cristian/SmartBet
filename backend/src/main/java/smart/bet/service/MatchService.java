package smart.bet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.bet.dto.MatchOddResponse;
import smart.bet.model.Match;
import smart.bet.model.Odd;
import smart.bet.repository.MatchRepository;
import smart.bet.repository.OddRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final OddRepository oddRepository;

    public List<MatchOddResponse> getTodayMatchesWithOdds() {
        LocalDate today = LocalDate.now();
        List<Match> todayMatches = matchRepository.findByDate(today);
        List<MatchOddResponse> response = new ArrayList<>();

        for (Match match : todayMatches) {
            Odd odd = oddRepository.findByMatch(match).stream()
                    .findFirst()
                    .orElse(null);
            
            if (odd != null) {
                response.add(new MatchOddResponse(
                    match.getId(),
                    match.getTeam1().getName(),
                    match.getTeam2().getName(),
                    match.getCompetition(),
                    odd.getHome(),
                    odd.getAway(),
                    odd.getLevel()
                ));
            }
        }

        return response;
    }
} 