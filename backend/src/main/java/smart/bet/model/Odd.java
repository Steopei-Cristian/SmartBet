package smart.bet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Odds")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Odd {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private double home;

    @Column(nullable = false)
    private double away;

    @Column(nullable = false)
    private double level;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;
}
