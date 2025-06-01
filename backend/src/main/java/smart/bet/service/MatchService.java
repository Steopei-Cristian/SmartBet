package smart.bet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.bet.dto.AddMatchRequest;
import smart.bet.dto.MatchOddResponse;
import smart.bet.model.Match;
import smart.bet.model.Odd;
import smart.bet.model.Team;
import smart.bet.repository.MatchRepository;
import smart.bet.repository.OddRepository;
import smart.bet.repository.TeamRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final OddRepository oddRepository;
    private final TeamRepository teamRepository;

    public List<MatchOddResponse> getTodayMatchesWithOdds() {
        LocalDate today = LocalDate.now();
        List<Match> todayMatches = matchRepository.findByDate(today);
        List<MatchOddResponse> response = new ArrayList<>();

        for (Match match : todayMatches) {
            oddRepository.findByMatch(match).stream()
                    .findFirst().ifPresent(odd -> response.add(new MatchOddResponse(
                            match.getId(),
                            match.getTeam1().getName(),
                            match.getTeam2().getName(),
                            match.getCompetition(),
                            odd.getHome(),
                            odd.getAway(),
                            odd.getLevel()
                    )));

        }

        return response;
    }

    @Transactional
    public Match addMatchWithOdds(AddMatchRequest request) {
        // Find teams by name
        Team team1 = teamRepository.findByName(request.getTeam1())
                .orElseThrow(() -> new RuntimeException("Team not found: " + request.getTeam1()));
        Team team2 = teamRepository.findByName(request.getTeam2())
                .orElseThrow(() -> new RuntimeException("Team not found: " + request.getTeam2()));

        // Create and save match
        Match match = new Match();
        match.setTeam1(team1);
        match.setTeam2(team2);
        match.setCompetition(request.getCompetition());
        match.setDate(LocalDate.parse(request.getDate()));
        match = matchRepository.save(match);

        // Create and save odd
        Odd odd = new Odd();
        odd.setMatch(match);
        odd.setHome(request.getHomeOdd());
        odd.setAway(request.getAwayOdd());
        odd.setLevel(request.getLevelOdd());
        oddRepository.save(odd);

        return match;
    }

    public List<String> getAllCompetitions() {
        return matchRepository.findAll().stream()
                .map(Match::getCompetition)
                .distinct()
                .collect(Collectors.toList());
    }
} 