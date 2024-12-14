import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiUpload, FiX } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'

export default function PropertyForm({ language }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    number_bedroom: '',
    number_bathroom: '',
    area: '',
    address: '',
    features: [],
    image: []
  })
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' })
  const [errors, setErrors] = useState({})
  const [previewImages, setPreviewImages] = useState([])

  const content = {
    en: {
      title: id ? 'Edit Property' : 'Add New Property',
      propertyDetails: 'Property Details',
      propertyType: 'Property Type',
      location: 'Location',
      specifications: 'Specifications',
      amenities: 'Amenities',
      additionalFeatures: 'Additional Features',
      images: 'Property Images',
      submit: id ? 'Update Property' : 'Add Property',
      cancel: 'Cancel',
      categories: {
        'category1': 'Amenities',
        'category 2': 'Additional Features'
      },
      features: {
        'feature 1': 'Parking',
        'Feature 2': 'Swimming Pool'
      },
      fields: {
        title: 'Property Title',
        description: 'Description',
        type: 'Type',
        price: 'Price (SAR)',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        area: 'Area (m²)',
        location: 'Location',
        yearBuilt: 'Year Built',
        furnished: 'Furnished',
        address: 'Property Address'
      },
      types: {
        apartment: 'Apartment',
        villa: 'Villa',
        office: 'Office',
        shop: 'Shop',
        land: 'Land'
      },
      locations: {
        riyadh: 'Riyadh',
        jeddah: 'Jeddah',
        dammam: 'Dammam',
        khobar: 'Khobar'
      },
      views: {
        'sea view': 'Sea View',
        'city view': 'City View',
        'garden view': 'Garden View',
        'street view': 'Street View',
        'mall view': 'Mall View'
      },
      amenityOptions: {
        parking: 'Parking',
        swimming_pool: 'Swimming Pool',
        gym: 'Gym',
        security: '24/7 Security',
        elevator: 'Elevator',
        garden: 'Garden',
        central_ac: 'Central AC',
        balcony: 'Balcony',
        maid_room: "Maid's Room",
        storage: 'Storage Room',
        kitchen_appliances: 'Kitchen Appliances',
        internet: 'Internet',
        satellite: 'Satellite/Cable TV',
        intercom: 'Intercom',
        maintenance: 'Maintenance',
        mosque: 'Nearby Mosque',
        shopping: 'Shopping Centers',
        schools: 'Schools Nearby',
        pets_allowed: 'Pets Allowed',
        sea_view: 'Sea View',
        city_view: 'City View',
        garden_view: 'Garden View',
        street_view: 'Street View',
        mall_view: 'Mall View'
      },
      dragDrop: 'Drag and drop images here, or click to select',
      maxFiles: 'Maximum 10 images'
    },
    ar: {
      title: id ? 'تعديل العقار' : 'إضافة عقار جديد',
      propertyDetails: 'تفاصيل العقار',
      propertyType: 'نوع العقار',
      location: 'الموقع',
      specifications: 'المواصفات',
      amenities: 'المميزات',
      additionalFeatures: 'مميزات إضافية',
      images: 'صور العقار',
      submit: id ? 'تحديث العقار' : 'إضافة العقار',
      cancel: 'إلغاء',
      categories: {
        'category1': 'المرافق',
        'category 2': 'مميزات إضافية'
      },
      features: {
        'feature 1': 'موقف سيارات',
        'Feature 2': 'مسبح'
      },
      fields: {
        title: 'عنوان العقار',
        description: 'الوصف',
        type: 'النوع',
        price: 'السعر (ريال)',
        bedrooms: 'غرف النوم',
        bathrooms: 'دورات المياه',
        area: 'المساحة (م²)',
        location: 'الموقع',
        yearBuilt: 'سنة البناء',
        furnished: 'مفروش',
        address: 'عنوان العقار'
      },
      types: {
        apartment: 'شقة',
        villa: 'فيلا',
        office: 'مكتب',
        shop: 'محل',
        land: 'أرض'
      },
      locations: {
        riyadh: 'الرياض',
        jeddah: 'جدة',
        dammam: 'الدمام',
        khobar: 'الخبر'
      },
      views: {
        'sea view': 'إطلالة بحرية',
        'city view': 'إطلالة على المدينة',
        'garden view': 'إطلالة على الحديقة',
        'street view': 'إطلالة على الشارع',
        'mall view': 'إطلالة على المول'
      },
      amenityOptions: {
        parking: 'موقف سيارات',
        swimming_pool: 'مسبح',
        gym: 'صالة رياضية',
        security: 'أمن 24/7',
        elevator: 'مصعد',
        garden: 'حديقة',
        central_ac: 'تكييف مركزي',
        balcony: 'شرفة',
        maid_room: 'غرفة خادمة',
        storage: 'غرفة تخزين',
        kitchen_appliances: 'أجهزة مطبخ',
        internet: 'إنترنت',
        satellite: 'قنوات فضائية',
        intercom: 'اتصال داخلي',
        maintenance: 'صيانة',
        mosque: 'مسجد قريب',
        shopping: 'مراكز تسوق',
        schools: 'مدارس قريبة',
        pets_allowed: 'يسمح بالحيوانات الأليفة',
        sea_view: 'إطلالة بحرية',
        city_view: 'إطلالة على المدينة',
        garden_view: 'إطلالة على الحديقة',
        street_view: 'إطلالة على الشارع',
        mall_view: 'إطلالة على المول'
      },
      dragDrop: 'اسحب وأفلت الصور هنا، أو انقر للاختيار',
      maxFiles: 'الحد الأقصى 10 صور'
    }
  }

  const t = content[language]

  useEffect(() => {
    fetchInitialData()
    if (id) {
      fetchPropertyData()
    }
  }, [id])

  const fetchInitialData = async () => {
    try {
      const [typesResponse, categoriesResponse] = await Promise.all([
        propertyAPI.getPropertyTypes(),
        propertyAPI.getFeatures()
      ])

      if (typesResponse?.data) {
        setPropertyTypes(typesResponse.data)
      }
      if (categoriesResponse?.data) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
    }
  }

  const fetchPropertyData = async () => {
    try {
      setLoading(true)
      const response = await propertyAPI.getPropertyById(id)
      if (response?.data) {
        const propertyData = response.data
        setFormData({
          title: propertyData.title,
          description: propertyData.description,
          type: propertyData.type,
          price: propertyData.price,
          number_bedroom: propertyData.number_bedroom,
          number_bathroom: propertyData.number_bathroom,
          area: propertyData.area,
          address: propertyData.address,
          features: propertyData.features?.map(f => f.id) || [],
          image: propertyData.images?.map(img => img.url) || []
        })
      }
    } catch (error) {
      console.error('Failed to fetch property:', error)
      setSubmitStatus({
        success: false,
        message: language === 'ar' ? 'فشل في تحميل بيانات الع��ار' : 'Failed to load property data'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate required fields based on whether it's create or update
      const validationErrors = {};
      
      // For create, all fields are required
      if (!id) {
        if (!formData.title?.trim()) validationErrors.title = 'The title field is required.';
        if (!formData.price) validationErrors.price = 'The price field is required.';
        if (!formData.type) validationErrors.type = 'The type field is required.';
        if (!formData.area) validationErrors.area = 'The area field is required.';
        if (!formData.number_bedroom) validationErrors.number_bedroom = 'The number of bedrooms is required.';
        if (!formData.number_bathroom) validationErrors.number_bathroom = 'The number of bathrooms is required.';
        if (!formData.address?.trim()) validationErrors.address = 'The address field is required.';
        if (!formData.image?.length) validationErrors.image = 'At least one image is required.';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Prepare data
      const submitData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        type: formData.type,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        number_bedroom: parseInt(formData.number_bedroom) || 0,
        number_bathroom: parseInt(formData.number_bathroom) || 0,
        address: formData.address.trim(),
        features: formData.features,
        image: formData.image
      };

      // Debug log
      console.log(`${id ? 'Updating' : 'Creating'} property:`, submitData);

      const response = id 
        ? await propertyAPI.updateProperty(id, submitData)
        : await propertyAPI.createProperty(submitData);

      if (response.success) {
        setSubmitStatus({
          success: true,
          message: language === 'ar' 
            ? (id ? 'تم تحديث العقار بنجاح' : 'تم إضافة العقار بنجاح')
            : (id ? 'Property updated successfully' : 'Property added successfully')
        });
        
        setTimeout(() => navigate('/owner/properties'), 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (error.error) {
        const apiErrors = {};
        error.error.forEach(err => {
          apiErrors[err.field] = err.messages;
        });
        setErrors(apiErrors);
      }

      setSubmitStatus({
        success: false,
        message: language === 'ar' 
          ? (id ? 'حدث خطأ أثناء تحديث العقار' : 'حدث خطأ أثناء حفظ العقار')
          : (id ? 'Failed to update property' : 'Failed to save property')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        console.error('Invalid file type:', file.type);
      }
      return isValid;
    });

    if (files.length + formData.image.length > 10) {
      alert(t.maxFiles);
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: [...prev.image, ...files]
    }));

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    
    // Clear any image-related errors
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const FieldError = ({ error }) => {
    if (!error) return null
    return <p className="mt-1 text-sm text-red-600">{error}</p>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Details */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.propertyDetails}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.title}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  // Clear error when field is updated
                  setErrors(prev => ({ ...prev, title: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.description}
              </label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.type}
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">{t.fields.type}</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{t.types[type]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.price}
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.specifications}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.bedrooms}
              </label>
              <input
                type="number"
                value={formData.number_bedroom}
                onChange={(e) => setFormData({ ...formData, number_bedroom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.bathrooms}
              </label>
              <input
                type="number"
                value={formData.number_bathroom}
                onChange={(e) => setFormData({ ...formData, number_bathroom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.area}
              </label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Address Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.address}
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Features Section - Update to use categories data */}
        {categories.map(category => {
          // Get the translated category name based on the category name
          const categoryName = category.name === 'Amenities' 
            ? (language === 'ar' ? 'المرافق' : 'Amenities')
            : (language === 'ar' ? 'مميزات إضافية' : 'Additional Features');

          return (
            <section key={category.id} className="space-y-4">
              <h2 className={`text-xl font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                {categoryName}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {category.features.map(feature => {
                  // Get the translated feature name
                  const featureName = t.amenityOptions[feature.name.toLowerCase().replace(/ /g, '_')] || feature.name;
                  
                  return (
                    <label key={feature.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature.id)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...formData.features, feature.id]
                            : formData.features.filter(id => id !== feature.id);
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{featureName}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Images */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.images}
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FiUpload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-600">{t.dragDrop}</span>
              <span className="text-sm text-gray-500">{t.maxFiles}</span>
            </label>
          </div>

          {formData.image.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.image.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={previewImages[index]}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/owner/properties')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? '...' : t.submit}
          </button>
        </div>
      </form>

      {submitStatus.message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${
          submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-500 text-sm mt-4">
          {Object.entries(errors).map(([field, message]) => (
            <p key={field}>{message}</p>
          ))}
        </div>
      )}
    </div>
  )
} 