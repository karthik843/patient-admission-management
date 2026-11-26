
import { useEffect, useState } from 'react';
import './App.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/patients';


function App() {
  const [patients, setPatients] = useState([]);
  const totalPatients = patients.length;

const admittedPatients = patients.filter(
  patient => patient.status === 'Admitted'
).length;

const dischargedPatients = patients.filter(
  patient => patient.status === 'Discharged'
).length;
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    ward: '',
    department: '',
    doctor: '',
    admissionDate: '',
    status: 'Admitted'
  });

  function loadPatients() {
    fetch(API)
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.log(error));
  }

  useEffect(() => {
    loadPatients();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }
function editPatient(patient) {
  setForm({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    ward: patient.ward,
    department: patient.department,
    doctor: patient.doctor,
    admissionDate: patient.admissionDate,
    status: patient.status
  });

  setEditId(patient.id);
  setShowForm(true);
}
async function dischargePatient(id) {
  const confirmDischarge = window.confirm(
    'Are you sure you want to discharge this patient?'
  );

  if (!confirmDischarge) return;

  const response = await fetch(`${API}/${id}/discharge`, {
    method: 'PATCH'
  });

  if (response.ok) {
    alert('Patient discharged successfully!');
    loadPatients();
  } else {
    alert('Unable to discharge patient.');
  }
}
async function deletePatient(id) {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this patient?'
  );

  if (!confirmDelete) return;

  const response = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    alert('Patient deleted successfully!');
    loadPatients();
  } else {
    alert('Unable to delete patient.');
  }
}
  async function addPatient(event) {
    event.preventDefault();

   const response = await fetch(
  editId ? `${API}/${editId}` : API,
  {
    method: editId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age)
      })
    });

    if (response.ok) {
     alert(editId ? 'Patient updated successfully!' : 'Patient added successfully!');
setEditId(null);
      setShowForm(false);

      setForm({
        name: '',
        age: '',
        gender: '',
        ward: '',
        department: '',
        doctor: '',
        admissionDate: '',
        status: 'Admitted'
      });

      loadPatients();
    } else {
  const errorData = await response.json();

  alert(
    errorData.message ||
    errorData.errors?.[0]?.defaultMessage ||
    'Please check the patient details.'
);
}
  }

  const admitted = patients.filter(
    patient => patient.status === 'Admitted'
  ).length;

  const discharged = patients.filter(
    patient => patient.status === 'Discharged'
  ).length;
const filteredPatients = patients.filter(patient =>
  patient.name.toLowerCase().includes(search.toLowerCase()) &&
  (wardFilter === '' || patient.ward === wardFilter) &&
  (departmentFilter === '' || patient.department === departmentFilter) &&
  (doctorFilter === '' || patient.doctor === doctorFilter)
);
const displayedPatients =
  activeMenu === 'Admissions'
    ? filteredPatients.filter(patient => patient.status === 'Admitted')
    : filteredPatients;
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>CarePoint</h2>
        <p>Hospital Management</p>
       <div
  className={`menu ${activeMenu === 'Dashboard' ? 'active' : ''}`}
  onClick={() => setActiveMenu('Dashboard')}
>
  Dashboard
</div>

<div
  className={`menu ${activeMenu === 'Patients' ? 'active' : ''}`}
  onClick={() => setActiveMenu('Patients')}
>
  Patients
</div>

<div
  className={`menu ${activeMenu === 'Admissions' ? 'active' : ''}`}
  onClick={() => setActiveMenu('Admissions')}
>
  Admissions
</div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Patient Admission</h1>
            
            <p>Manage hospital patient records</p>
          </div>
          <span className="admin">Admin</span>
        </header>

        {activeMenu === 'Dashboard' && (
        <section className="stats">
          <div className="stat-card">
            <p>Total Patients</p>
           <h2>{totalPatients}</h2>
          </div>
          <div className="stat-card">
            <p>Admitted</p>
            <h2>{admittedPatients}</h2>
          </div>
          <div className="stat-card">
            <p>Discharged</p>
          <h2>{dischargedPatients}</h2>
          </div>
        </section>
        )}

        <section className="content">
          <div className="section-heading">
            <div>
              <h2>Patient Records</h2>
              <p>Manage patient information</p>
            </div>

            <button
              className="add-button"
              onClick={() => setShowForm(true)}
            >
              + Add Patient
            </button>
          </div>
          <input
  type="text"
  placeholder="Search patient by name..."
  className="search-input"
  value={search}
  onChange={(event) => setSearch(event.target.value)}

/>
<select
  value={wardFilter}
  onChange={(event) => setWardFilter(event.target.value)}
  className="search-input"
>
  <option value="">All Wards</option>
  <option value="General Ward">General Ward</option>
  <option value="ICU">ICU</option>
  <option value="Emergency Ward">Emergency Ward</option>
  <option value="Private Ward">Private Ward</option>
</select>

<select
  value={departmentFilter}
  onChange={(event) => setDepartmentFilter(event.target.value)}
  className="search-input"
>
  <option value="">All Departments</option>
  <option value="Cardiology">Cardiology</option>
  <option value="Neurology">Neurology</option>
  <option value="Orthopedics">Orthopedics</option>
  <option value="Pediatrics">Pediatrics</option>
  <option value="General Medicine">General Medicine</option>
</select>
<select
  value={doctorFilter}
  onChange={(event) => setDoctorFilter(event.target.value)}
  className="search-input"
>
  <option value="">All Doctors</option>
  <option value="Dr. Kumar">Dr. Kumar</option>
  <option value="Dr. Ravi">Dr. Ravi</option>
  <option value="Dr. Priya">Dr. Priya</option>
  <option value="Dr. Anil">Dr. Anil</option>
</select>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Ward</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
               {displayedPatients.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.ward}</td>
                    <td>{patient.department}</td>
                    <td>{patient.doctor}</td>
                    <td>{patient.status}</td>
                    <td>
  <button
    type="button"
    onClick={() => editPatient(patient)}
  >
    Edit
  </button>
  <button
  type="button"
  onClick={() => deletePatient(patient.id)}
>
  Delete
</button>
<button
  type="button"
  onClick={() => dischargePatient(patient.id)}
  disabled={patient.status === 'Discharged'}
>
  Discharge
</button>
</td>
                  </tr>
                ))}

                {patients.length === 0 && (
                  <tr>
                    <td colSpan="9" className="empty">
                      No patient records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showForm && (
          <div className="modal">
            <form className="patient-form" onSubmit={addPatient}>
              <h2>{editId ? 'Edit Patient' : 'Add New Patient'}</h2>

              <label>Patient Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                pattern="[A-Za-z ]+"
                placeholder="Enter patient name"
              />

              <label>Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="0"
                max="120"
                required
                placeholder="Enter age"
              />

              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <label>Ward</label>
              <select name="ward" value={form.ward} onChange={handleChange} required>
                <option value="">Select Ward</option>
                <option>General Ward</option>
                <option>ICU</option>
                <option>Emergency Ward</option>
                <option>Private Ward</option>
              </select>

              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
                <option>General Medicine</option>
              </select>

              <label>Doctor</label>
              <select name="doctor" value={form.doctor} onChange={handleChange} required>
                <option value="">Select Doctor</option>
                <option>Dr. Kumar</option>
                <option>Dr. Ravi</option>
                <option>Dr. Priya</option>
                <option>Dr. Anil</option>
              </select>

              <label>Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={form.admissionDate}
                onChange={handleChange}
                max={new Date().toLocaleDateString('en-CA')}
                required
              />

              <div className="form-buttons">
                <button type="submit" className="add-button">
                  Save Patient
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
