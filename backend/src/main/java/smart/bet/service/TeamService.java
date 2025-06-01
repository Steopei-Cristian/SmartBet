package smart.bet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.bet.model.Team;
import smart.bet.repository.TeamRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;

    public List<String> getAllTeamNames() {
        return teamRepository.findAll().stream()
                .map(Team::getName)
                .distinct()
                .collect(Collectors.toList());
    }
} 