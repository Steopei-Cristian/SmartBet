package smart.bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smart.bet.model.BetBuilder;

@Repository
public interface BetBuilderRepository extends JpaRepository<BetBuilder, Long> {
} 