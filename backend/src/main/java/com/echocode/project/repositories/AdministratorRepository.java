package com.echocode.project.repositories;

import com.echocode.project.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
=======
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    Optional<Administrator> findByEmail(String email);
    boolean existsByEmail(String email);
>>>>>>> 464798baeea5e5064a99af14480a140d58f0110d
}
