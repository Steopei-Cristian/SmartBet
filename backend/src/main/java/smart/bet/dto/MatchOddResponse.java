package smart.bet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import smart.bet.model.Match;
import smart.bet.model.Odd;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchOddResponse {
    private Long matchId;
    private String team1;
    private String team2;
    private String competition;
    private double homeOdd;
    private double awayOdd;
    private double levelOdd;
} 