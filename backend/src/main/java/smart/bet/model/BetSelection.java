package smart.bet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Bet_Selections")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class BetSelection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SelectionType selection;

    @ManyToOne
    @JoinColumn(name = "odd_id", nullable = false)
    private Odd odd;

    @ManyToOne
    @JoinColumn(name = "builder_id", nullable = false)
    private BetBuilder builder;
}
