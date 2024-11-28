import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import './ManageSpots.css';

function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSpots = async () => {
      try {
        const response = await csrfFetch('/api/spots/current');
        if (response.ok) {
          const data = await response.json();
          setSpots(data.Spots);
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSpots();
  }, []);

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  const handleDelete = async (e, spotId) => {
    e.stopPropagation();
    setSpotToDelete(spotId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await csrfFetch(`/api/spots/${spotToDelete}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSpots(spots.filter(spot => spot.id !== spotToDelete));
        setShowDeleteModal(false);
        setSpotToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSpotToDelete(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      
      {spots.length === 0 ? (
        <Link to="/spots/new" className="create-spot-link">
          Create a New Spot
        </Link>
      ) : (
        <div className="spots-grid">
          {spots.map(spot => (
            <div key={spot.id} className="spot-tile">
              <div 
                className="spot-content"
                onClick={() => handleSpotClick(spot.id)}
              >
                <img 
                  src={spot.previewImage} 
                  alt={spot.name}
                  className="spot-image"
                />
                <div className="spot-info">
                  <div className="spot-location-rating">
                    <span>{spot.city}, {spot.state}</span>
                    <span>★ {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}</span>
                  </div>
                  <div className="spot-price">
                    <span className="price">${spot.price}</span> night
                  </div>
                </div>
              </div>
              <div className="spot-buttons">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/spots/${spot.id}/edit`);
                  }}
                  className="update-button"
                >
                  Update
                </button>
                <button 
                  onClick={(e) => handleDelete(e, spot.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default ManageSpots;