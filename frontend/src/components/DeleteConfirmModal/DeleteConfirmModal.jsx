import React from 'react';
import './DeleteConfirmModal.css';

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div className="modal-buttons">
          <button 
            className="delete-button" 
            onClick={onConfirm}
          >
            Yes (Delete Spot)
          </button>
          <button 
            className="cancel-button" 
            onClick={onCancel}
          >
            No (Keep Spot)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
