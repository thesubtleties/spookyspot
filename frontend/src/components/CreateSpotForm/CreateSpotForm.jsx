import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateSpotForm.css';
import { useDispatch } from 'react-redux';
import { csrfFetch } from '../../store/csrf';

function CreateSpotForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price per night is required";
    
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    }
    
    if (!formData.previewImage) {
      newErrors.previewImage = "Preview Image is required";
    } else if (!/\.(jpg|jpeg|png)/i.test(formData.previewImage)) {
      newErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
    }
    
    ['image1', 'image2', 'image3', 'image4'].forEach(imgField => {
      if (formData[imgField] && !/\.(jpg|jpeg|png)/i.test(formData[imgField])) {
        newErrors[imgField] = "Image URL must end in .png, .jpg, or .jpeg";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Create the spot using csrfFetch
      const spotResponse = await csrfFetch('/api/spots', {
        method: 'POST',
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

      if (!spotResponse.ok) {
        const data = await spotResponse.json();
        setErrors(data.errors || { submit: 'Failed to create spot' });
        return;
      }

      const spot = await spotResponse.json();

      // Add images using csrfFetch
      const images = [
        { url: formData.previewImage, preview: true },
        { url: formData.image1, preview: false },
        { url: formData.image2, preview: false },
        { url: formData.image3, preview: false },
        { url: formData.image4, preview: false }
      ].filter(img => img.url);

      for (let image of images) {
        const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
          method: 'POST',
          body: JSON.stringify(image)
        });

        if (!imageResponse.ok) {
          console.error('Failed to upload image');
        }
      }

      // Redirect to the new spot's page
      navigate(`/spots/${spot.id}`);
    } catch (error) {
      console.error('Error creating spot:', error);
      setErrors({ submit: 'An error occurred while creating the spot' });
    }
  };

  return (
    <div className="create-spot-page">
      <div className="create-spot-form-container">
        <h1>Create a New Spot</h1>
        
        {Object.keys(errors).length > 0 && (
          <div className="validation-summary">
            {Object.values(errors).map((error, index) => (
              <p key={index} className="error">{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <section>
            <h2>Where's your place located?</h2>
            <p className="caption">Guests will only get your exact address once they booked a reservation.</p>
            
            <div className="form-group">
              <label>
                Country
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className={errors.country ? 'error-input' : ''}
                />
                {errors.country && <span className="error">{errors.country}</span>}
              </label>

              <label>
                Street Address
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className={errors.address ? 'error-input' : ''}
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </label>

              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={errors.city ? 'error-input' : ''}
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </label>

              <label>
                State
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={errors.state ? 'error-input' : ''}
                />
                {errors.state && <span className="error">{errors.state}</span>}
              </label>
            </div>
          </section>

          <section>
            <h2>Describe your place to guests</h2>
            <p className="caption">
              Mention the best features of your space, any special amentities like 
              fast wifi or parking, and what you love about the neighborhood.
            </p>
            
            <label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please write at least 30 characters"
                className={errors.description ? 'error-input' : ''}
                minLength={30}
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </label>
          </section>

          <section>
            <h2>Create a title for your spot</h2>
            <p className="caption">
              Catch guests' attention with a spot title that highlights what makes 
              your place special.
            </p>
            
            <label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name of your spot"
                className={errors.name ? 'error-input' : ''}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>
          </section>

          <section>
            <h2>Set a base price for your spot</h2>
            <p className="caption">
              Competitive pricing can help your listing stand out and rank higher 
              in search results.
            </p>
            
            <label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price per night (USD)"
                min="0"
                step="0.01"
                className={errors.price ? 'error-input' : ''}
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </label>
          </section>

          <section>
            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to publish your spot.</p>

            <label>
              Preview Image URL
              <input
                type="url"
                name="previewImage"
                value={formData.previewImage}
                onChange={handleChange}
                placeholder="Preview Image URL"
                className={errors.previewImage ? 'error-input' : ''}
              />
              {errors.previewImage && <span className="error">{errors.previewImage}</span>}
            </label>

            {[1, 2, 3, 4].map(num => (
              <label key={num}>
                Image URL {num}
                <input
                  type="url"
                  name={`image${num}`}
                  value={formData[`image${num}`]}
                  onChange={handleChange}
                  placeholder={`Image URL ${num}`}
                  className={errors[`image${num}`] ? 'error-input' : ''}
                />
                {errors[`image${num}`] && <span className="error">{errors[`image${num}`]}</span>}
              </label>
            ))}
          </section>

          <button type="submit" className="submit-button">Create Spot</button>
          {errors.submit && <div className="error submit-error">{errors.submit}</div>}
        </form>
      </div>
    </div>
  );
}

export default CreateSpotForm;