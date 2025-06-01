package smart.bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smart.bet.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
} 