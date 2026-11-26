package com.dscribe.patient_management.Repository;

import com.dscribe.patient_management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

List<Patient> findByNameContainingIgnoreCase(String name);

List<Patient> findByWard(String ward);

List<Patient> findByDepartment(String department);

List<Patient> findByDoctor(String doctor);
}