package smart.bet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smart.bet.dto.AddMatchRequest;
import smart.bet.dto.MatchOddResponse;
import smart.bet.model.Match;
import smart.bet.service.MatchService;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @GetMapping("/today")
    public ResponseEntity<List<MatchOddResponse>> getTodayMatches() {
        return ResponseEntity.ok(matchService.getTodayMatchesWithOdds());
    }

    @GetMapping("/competitions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getAllCompetitions() {
        return ResponseEntity.ok(matchService.getAllCompetitions());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Match> addMatch(@RequestBody AddMatchRequest request) {
        return ResponseEntity.ok(matchService.addMatchWithOdds(request));
    }
} 