import React, { useState } from 'react';
import '../styles/ManageStaff.css';

const ManageStaff = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', position: 'Manager' },
    { id: 2, name: 'Jane Smith', position: 'Developer' },
    { id: 3, name: 'Emily Johnson', position: 'Designer' },
  ]);

  const handleRemove = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const handleUpdate = (id) => {
    // Update logic can be added here
    alert(`Update staff with ID: ${id}`);
  };

  const handleAddStaff = () => {
    // Logic to add staff can be added here
    alert('Add new staff functionality');
  };

  return (
    <div className='top-container'>
      <div className='black-container'></div>
      <div className='main-container'>
        <h1 className='heading'>Manage Staff</h1>
        <ul className='staff-list'>
          {staff.map(member => (
            <li key={member.id} className='staff-item'>
              <span>{member.name} - {member.position}</span>
              <button className='update-btn' onClick={() => handleUpdate(member.id)}>Update</button>
              <button className='remove-btn' onClick={() => handleRemove(member.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <button className='add-btn' onClick={handleAddStaff}>Add New Staff</button>
      </div>
    </div>
  );
};

export default ManageStaff;
