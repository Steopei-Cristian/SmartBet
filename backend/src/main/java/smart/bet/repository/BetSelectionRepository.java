package smart.bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smart.bet.model.BetSelection;

@Repository
public interface BetSelectionRepository extends JpaRepository<BetSelection, Long> {
} 