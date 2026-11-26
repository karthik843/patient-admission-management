
package com.dscribe.patient_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @NotBlank(message = "Patient name is required")
@Size(min = 2, max = 100, message = "Name must be 2 to 100 characters")
private String name;

@NotNull(message = "Age is required")
@Min(value = 0, message = "Age cannot be negative")
@Max(value = 120, message = "Age cannot exceed 120")
private Integer age;
   @NotBlank(message = "Gender is required")
private String gender;

@NotBlank(message = "Ward is required")
private String ward;
   @NotBlank(message = "Department is required")
private String department;

@NotBlank(message = "Doctor is required")
private String doctor;
    @NotNull(message = "Admission date is required")
@PastOrPresent(message = "Admission date cannot be in the future")
private LocalDate admissionDate;
    private String status = "Admitted";

    public Patient() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
