package smart.bet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Accounts")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private double balance;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
