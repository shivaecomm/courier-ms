import React from 'react';

const TableGrid = () => {
    // Handler for viewing an article
    const handleView = (day) => {
        alert(`Viewing article for Day ${day}`);
    };

    // Handler for editing an article
    const handleEdit = (day) => {
        alert(`Editing article for Day ${day}`);
    };

    // Handler for deleting an article
    const handleDelete = (day) => {
        if (window.confirm(`Are you sure you want to delete the article for Day ${day}?`)) {
            alert(`Article for Day ${day} deleted`);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Branch Name</th>
                                <th scope="col">City/State/Pincode</th>
                                <th scope="col">Country</th>
                                <th scope="col">Contact Person</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Delhi</th>
                                <td>Ludhiana/Punjab/141120</td>
                                <td>India</td>
                                <td>Rahul</td>
                                <td>9877443177</td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleView(1)}>
                                        <i className="far fa-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={() => handleEdit(1)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(1)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                          
                            <tr>
                                <th scope="row">Delhi</th>
                                <td>Ludhiana/Punjab/141120</td>
                                <td>India</td>
                                <td>Rahul</td>
                                <td>9877443177</td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleView(1)}>
                                        <i className="far fa-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={() => handleEdit(1)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(1)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                          
                            <tr>
                                <th scope="row">Delhi</th>
                                <td>Ludhiana/Punjab/141120</td>
                                <td>India</td>
                                <td>Rahul</td>
                                <td>9877443177</td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleView(1)}>
                                        <i className="far fa-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={() => handleEdit(1)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(1)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                          
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableGrid;
