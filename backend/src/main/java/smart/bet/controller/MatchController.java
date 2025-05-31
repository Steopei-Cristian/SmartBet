package smart.bet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import smart.bet.dto.MatchOddResponse;
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
} 