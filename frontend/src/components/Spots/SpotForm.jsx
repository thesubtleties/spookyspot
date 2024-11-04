import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validateSpotForm } from '../utils/formValidations';
import { useParams } from 'react-router-dom';
import {
  deleteSpotImageThunk,
  fetchSpotDetailsThunk,
  getUserSpotsThunk,
} from '../../store/spots';
import PhotoUpload from './PhotoUpload';

import {
  createSpotThunk,
  updateSpotThunk,
  addSpotImageThunk,
} from '../../store/spots';
import styles from './styles/SpotForm.module.css';

function SpotForm({ mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentSpot = useSelector((state) => state.spots.currentSpot);
  const isUpdating = mode === 'update';
  const { spotId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUpdating && spotId) {
      console.log('Fetching spot details for:', spotId);
      dispatch(fetchSpotDetailsThunk(spotId)).then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [dispatch, spotId, isUpdating]);

  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    description: '',
    name: '',
    price: '',
    images: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isUpdating && currentSpot && !isLoading) {
      console.log('Populating form with spot data:', currentSpot);
      setFormData({
        country: currentSpot.country || '',
        address: currentSpot.address || '',
        city: currentSpot.city || '',
        state: currentSpot.state || '',
        lat: currentSpot.lat || '',
        lng: currentSpot.lng || '',
        description: currentSpot.description || '',
        name: currentSpot.name || '',
        price: currentSpot.price || '',
        images: Array.isArray(currentSpot.SpotImages)
          ? [...currentSpot.SpotImages]
          : [],
      });
    }
  }, [currentSpot, isUpdating, isLoading]);

  if (isUpdating && isLoading) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const validateForm = () => {
    const newErrors = validateSpotForm(formData);
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Form data:', formData);
    const isValid = validateForm();
    console.log('Form is valid:', isValid);
    if (!isValid) return;

    const { images, ...spotData } = formData;

    try {
      let newSpot;
      if (isUpdating) {
        console.log('Updating spot with ID:', spotId);
        console.log('Update data:', { ...spotData, id: spotId });

        const updatedImages = images.map((image, index) => ({
          ...image,
          preview: index === 0,
        }));
        newSpot = await dispatch(updateSpotThunk({ ...spotData, id: spotId }));
        console.log('Update response:', newSpot);

        if (currentSpot.SpotImages) {
          for (const spotImage of currentSpot.SpotImages) {
            try {
              await dispatch(deleteSpotImageThunk(spotImage.id));
            } catch (error) {
              console.error('Failed to delete image:', spotImage.id, error);
            }
          }
        }
        for (const image of updatedImages) {
          try {
            await dispatch(
              addSpotImageThunk(newSpot.id, image.url, image.preview)
            );
          } catch (imageError) {
            console.error('Failed to upload image:', image.url, imageError);
          }
        }
      } else {
        console.log('Creating new spot');
        newSpot = await dispatch(createSpotThunk(spotData));
        console.log('Create response:', newSpot);

        const newImages = images.map((image, index) => ({
          ...image,
          preview: index === 0,
        }));

        if (newSpot && newSpot.id) {
          for (const image of newImages) {
            try {
              await dispatch(
                addSpotImageThunk(newSpot.id, image.url, image.preview)
              );
            } catch (imageError) {
              console.error('Failed to upload image:', image.url, imageError);
            }
          }
        }
      }

      if (newSpot) {
        console.log('Navigation to new/updated spot page');
        await dispatch(getUserSpotsThunk());
        navigate(`/spots/${newSpot.id}`);
      } else {
        throw new Error('Failed to create/update spot');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setErrors({ submit: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>{isUpdating ? 'Update your Spot' : 'Create a New Spot'}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section>
          <h2>Where is your spot located?</h2>
          <p>
            Guests will only get your exact address once they book a
            reservation.
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
            {errors.country && (
              <span className={styles.error}>{errors.country}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street Address"
            />
            {errors.address && (
              <span className={styles.error}>{errors.address}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.city && (
                <span className={styles.error}>{errors.city}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="STATE"
              />
              {errors.state && (
                <span className={styles.error}>{errors.state}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="lat">Latitude</label>
              <input
                type="number"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
                step="any"
              />
              {errors.latitude && (
                <span className={styles.error}>{errors.latitude}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lng">Longitude</label>
              <input
                type="number"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Longitude"
                step="any"
              />
              {errors.longitude && (
                <span className={styles.error}>{errors.longitude}</span>
              )}
            </div>
          </div>
        </section>

        <hr />

        <section>
          <h2>Describe your Spot to your guests</h2>
          <p>
            Mention the best features of your spot, any special amenities like
            fast Wi-Fi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please enter at least 30 characters"
            rows="5"
            className={styles.textArea}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </section>

        <hr />

        <section>
          <h2>Give your Spot a name</h2>
          <p>
            Catch guests attention with a spot name that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of your Spot"
            className={styles.spotNameInput}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </section>

        <hr />

        <section>
          <h2>Set a base price for your Spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price per night (USD)"
            step="0.01"
          />
          {errors.price && <span className={styles.error}>{errors.price}</span>}
        </section>

        <hr />

        <section>
          <h2>Show off your Spot with photos</h2>
          <p>Submit up to 5 photos of your spot.</p>
          <PhotoUpload
            onUploadSuccess={(imageUrl) => {
              setFormData((prev) => ({
                ...prev,
                images: [
                  ...prev.images,
                  {
                    url: imageUrl,
                    preview: prev.images.length === 0,
                  },
                ],
              }));
            }}
            images={formData.images}
            maxImages={5}
            onRemoveImage={(index) => {
              setFormData((prev) => {
                const newImages = prev.images.filter((_, i) => i !== index);
                return {
                  ...prev,
                  images: newImages.map((img, i) => ({
                    ...img,
                    preview: i === 0,
                  })),
                };
              });
            }}
          />
          {errors.images && (
            <span className={styles.error}>{errors.images}</span>
          )}
        </section>

        <button type="submit" className={styles.submitButton}>
          {isUpdating ? 'Update Spot' : 'Create Spot'}
        </button>
      </form>
    </div>
  );
}

export default SpotForm;
