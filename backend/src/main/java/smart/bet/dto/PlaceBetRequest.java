package smart.bet.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlaceBetRequest {
    private double stake;
    private List<BetSelectionRequest> selections;
}