package com.echocode.project.repositories;

import com.echocode.project.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser_UserId(long userId);
    Optional<Address> findByUser_UserIdAndIsDefaultTrue(long userId);
}
