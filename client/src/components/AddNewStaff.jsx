import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AddNewStaff.css'; // Custom styles

const AddNewStaff = ({ onClose }) => {
  const [staffData, setStaffData] = useState({
    userId: '',
    branch: '',
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Staff Data:', staffData);
    setStaffData({
      userId: '',
      branch: '',
      name: '',
      email: '',
      phone: '',
      password: '',
    });
    onClose(); // Close modal after submission
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-center">Add New Staff</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="userId" className="form-label">User ID</label>
              <input
                type="text"
                className="form-control"
                id="userId"
                name="userId"
                value={staffData.userId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="branch" className="form-label">Branch</label>
              <input
                type="text"
                className="form-control"
                id="branch"
                name="branch"
                value={staffData.branch}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={staffData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={staffData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={staffData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={staffData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Staff</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewStaff;
