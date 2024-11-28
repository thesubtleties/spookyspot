import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';
import './UpdateSpotForm.css';

function UpdateSpotForm() {
  const navigate = useNavigate();
  const { spotId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: '',
    previewImage: '',
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        if (response.ok) {
          const spotData = await response.json();
          setFormData({
            address: spotData.address,
            city: spotData.city,
            state: spotData.state,
            country: spotData.country,
            lat: spotData.lat || '',
            lng: spotData.lng || '',
            name: spotData.name,
            description: spotData.description,
            price: spotData.price,
            previewImage: spotData.SpotImages?.find(img => img.preview)?.url || '',
            image1: spotData.SpotImages?.[1]?.url || '',
            image2: spotData.SpotImages?.[2]?.url || '',
            image3: spotData.SpotImages?.[3]?.url || '',
            image4: spotData.SpotImages?.[4]?.url || ''
          });
        } else {
          navigate('/spots/current');
        }
      } catch (error) {
        console.error('Error fetching spot data:', error);
        navigate('/spots/current');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotData();
  }, [spotId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) newErrors.address = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length >= 50) newErrors.name = "Name must be less than 50 characters";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price per night is required and must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          lat: parseFloat(formData.lat) || 0,
          lng: parseFloat(formData.lng) || 0,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || { submit: 'Failed to update spot' });
        return;
      }

      const updatedSpot = await response.json();
      navigate(`/spots/${updatedSpot.id}`);
    } catch (error) {
      console.error('Error updating spot:', error);
      setErrors({ submit: 'An error occurred while updating the spot' });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="update-spot-page">
      <div className="update-spot-form-container">
        <h1>Update your Spot</h1>
        
        {Object.keys(errors).length > 0 && (
          <div className="errors">
            {Object.values(errors).map((error, idx) => (
              <p key={idx} className="error">{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <section>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they book a reservation.</p>
            
            <div className="form-group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street Address"
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
              />
              {errors.country && <span className="error">{errors.country}</span>}
            </div>
          </section>

          <section>
            <h2>Describe your place to guests</h2>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name of your spot"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>
          </section>

          <section>
            <h2>Set a base price for your spot</h2>
            <div className="form-group price-group">
              <span className="currency">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price per night (USD)"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
          </section>

          <section>
            <h2>Liven up your spot with photos</h2>
            <p>Image URLs are optional for updating your spot</p>
            
            <div className="form-group">
              <input
                type="url"
                name="previewImage"
                value={formData.previewImage}
                onChange={handleInputChange}
                placeholder="Preview Image URL"
              />
            </div>

            <div className="form-group">
              <input
                type="url"
                name="image1"
                value={formData.image1}
                onChange={handleInputChange}
                placeholder="Image URL"
              />
            </div>

            <div className="form-group">
              <input
                type="url"
                name="image2"
                value={formData.image2}
                onChange={handleInputChange}
                placeholder="Image URL"
              />
            </div>

            <div className="form-group">
              <input
                type="url"
                name="image3"
                value={formData.image3}
                onChange={handleInputChange}
                placeholder="Image URL"
              />
            </div>

            <div className="form-group">
              <input
                type="url"
                name="image4"
                value={formData.image4}
                onChange={handleInputChange}
                placeholder="Image URL"
              />
            </div>
          </section>

          <button type="submit" className="submit-button">Update your Spot</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateSpotForm;
