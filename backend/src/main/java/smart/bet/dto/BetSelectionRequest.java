package smart.bet.dto;

import lombok.Data;

@Data
public class BetSelectionRequest {
    private Long matchId;
    private String oddType; // HOME, AWAY, or LEVEL
}
