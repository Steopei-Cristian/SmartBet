package smart.bet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Bet_Builders")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class BetBuilder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;

    @Column(nullable = false)
    private double stake;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
