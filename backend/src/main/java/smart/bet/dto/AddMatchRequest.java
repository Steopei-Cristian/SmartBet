package smart.bet.dto;

import lombok.Data;

@Data
public class AddMatchRequest {
    private String team1;
    private String team2;
    private String competition;
    private String date;
    private double homeOdd;
    private double awayOdd;
    private double levelOdd;
} 