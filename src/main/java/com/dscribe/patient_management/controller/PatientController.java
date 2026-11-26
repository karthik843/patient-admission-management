
package com.dscribe.patient_management.controller;

import jakarta.validation.Valid;
import com.dscribe.patient_management.entity.Patient;
import com.dscribe.patient_management.Repository.PatientRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Add a new patient
   @PostMapping
public Patient addPatient(@Valid @RequestBody Patient patient) {
    return patientRepository.save(patient);
}
    // Get all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    // Search patients by name
@GetMapping("/search")
public List<Patient> searchPatients(@RequestParam String name) {
    return patientRepository.findByNameContainingIgnoreCase(name);
}

// Filter patients by ward
@GetMapping("/filter/ward")
public List<Patient> filterByWard(@RequestParam String ward) {
    return patientRepository.findByWard(ward);
}

// Filter patients by department
@GetMapping("/filter/department")
public List<Patient> filterByDepartment(@RequestParam String department) {
    return patientRepository.findByDepartment(department);
}

// Filter patients by doctor
@GetMapping("/filter/doctor")
public List<Patient> filterByDoctor(@RequestParam String doctor) {
    return patientRepository.findByDoctor(doctor);
}
// Update an existing patient
@PutMapping("/{id}")
public ResponseEntity<Patient> updatePatient(
        @PathVariable Long id,
       @Valid @RequestBody Patient updatedPatient) {

    return patientRepository.findById(id)
            .map(patient -> {
                patient.setName(updatedPatient.getName());
                patient.setAge(updatedPatient.getAge());
                patient.setGender(updatedPatient.getGender());
                patient.setWard(updatedPatient.getWard());
                patient.setDepartment(updatedPatient.getDepartment());
                patient.setDoctor(updatedPatient.getDoctor());
                patient.setAdmissionDate(updatedPatient.getAdmissionDate());
                patient.setStatus(updatedPatient.getStatus());

                return ResponseEntity.ok(patientRepository.save(patient));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
}
// Delete a patient
@DeleteMapping("/{id}")
public ResponseEntity<Void> deletePatient(@PathVariable Long id) {

    if (!patientRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    patientRepository.deleteById(id);

    return ResponseEntity.noContent().build();
}
// Discharge a patient
@PatchMapping("/{id}/discharge")
public ResponseEntity<Patient> dischargePatient(@PathVariable Long id) {

    return patientRepository.findById(id)
            .map(patient -> {
                patient.setStatus("Discharged");
                return ResponseEntity.ok(patientRepository.save(patient));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
}
}

