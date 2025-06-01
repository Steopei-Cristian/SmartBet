package smart.bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smart.bet.model.Match;
import smart.bet.model.Odd;

import java.util.List;
import java.util.Optional;

@Repository
public interface OddRepository extends JpaRepository<Odd, Long> {
    List<Odd> findByMatch(Match match);
    Optional<Odd> findByMatchId(Long matchId);
} 