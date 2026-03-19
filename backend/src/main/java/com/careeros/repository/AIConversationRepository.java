package com.careeros.repository;

import com.careeros.model.AIConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {
    List<AIConversation> findByUserIdOrderByStartedAtDesc(Long userId);
    Optional<AIConversation> findByIdAndUserId(Long id, Long userId);
}