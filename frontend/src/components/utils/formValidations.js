export const validateSpotForm = (formData) => {
  console.log('Validating form data:', formData);
  const errors = {};

  if (!formData.country?.trim()) errors.country = 'Country is required';
  if (!formData.address?.trim()) errors.address = 'Street address is required';
  if (!formData.city?.trim()) errors.city = 'City is required';
  if (!formData.state?.trim()) errors.state = 'State is required';

  if (!formData.lat) {
    errors.lat = 'Latitude is required';
  } else {
    const lat = parseFloat(formData.lat);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.lat = 'Latitude must be a number between -90 and 90';
    }
  }

  if (!formData.lng) {
    errors.lng = 'Longitude is required';
  } else {
    const lng = parseFloat(formData.lng);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.lng = 'Longitude must be a number between -180 and 180';
    }
  }

  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 30) {
    errors.description = 'Description needs a minimum of 30 characters';
  }

  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.length >= 50) {
    errors.name = 'Name must be less than 50 characters';
  }

  if (!formData.price) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      errors.price = 'Price must be a positive number';
    }
  }

  if (!formData.image1?.trim()) {
    errors.previewImage = 'Preview image is required';
  }

  return errors;
};
