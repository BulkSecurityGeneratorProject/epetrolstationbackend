package com.epetrole.backend.repository;

import com.epetrole.backend.domain.CatCarburant;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CatCarburant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CatCarburantRepository extends JpaRepository<CatCarburant, Long> {

}
