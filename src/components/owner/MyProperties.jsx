import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'

const PropertyCard = ({ property, onDelete, onStatusUpdate, translations }) => {
  const navigate = useNavigate();
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  if (!property) return null;

  const handleEdit = () => {
    navigate(`/owner/properties/edit/${property.id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center p-4 border-b">
        <div className="relative w-24 h-24">
          <img
            src={property.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Image'}
            alt={property.title}
            className="w-full h-full object-cover rounded"
          />
          {property.images?.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              +{property.images.length - 1}
            </span>
          )}
        </div>
        <div className="flex-1 ml-4">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor[property.status] || 'bg-gray-100 text-gray-800'}`}>
              {property.status}
            </span>
            <span>•</span>
            <span>{property.type}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Specifications */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Area</span>
            <p className="font-medium">{property.area} m²</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Price</span>
            <p className="font-medium">{property.price} {property.currency}</p>
          </div>
          {property.number_bedroom !== undefined && (
            <div>
              <span className="text-sm text-gray-500">Bedrooms</span>
              <p className="font-medium">{property.number_bedroom}</p>
            </div>
          )}
          {property.number_bathroom !== undefined && (
            <div>
              <span className="text-sm text-gray-500">Bathrooms</span>
              <p className="font-medium">{property.number_bathroom}</p>
            </div>
          )}
        </div>

        {/* Features */}
        {property.features?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {property.features.map(feature => (
                <span 
                  key={feature.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {feature.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => navigate(`/properties/${property.id}`)}
            className="p-2 text-gray-600 hover:text-gray-900"
            title={translations.view}
          >
            <FiEye />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:text-blue-800"
            title={translations.edit}
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="p-2 text-red-600 hover:text-red-800"
            title={translations.delete}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyProperties({ language }) {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const content = {
    en: {
      title: 'My Properties',
      addProperty: 'Add New Property',
      noProperties: 'No properties listed yet',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      status: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        booked: 'Booked',
        available: 'Available'
      },
      deleteConfirm: 'Are you sure you want to delete this property?',
      actions: 'Actions',
      columns: {
        image: 'Image',
        title: 'Title',
        type: 'Type',
        location: 'Location',
        price: 'Price',
        bookingStatus: 'Status'
      },
      confirmStatusUpdate: 'Are you sure you want to mark this property as',
      noImage: 'No image available',
      currency: 'SAR',
      area: 'Area',
      sqm: 'm²',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      types: {
        apartment: 'Apartment',
        villa: 'Villa',
        office: 'Office',
        shop: 'Shop',
        land: 'Land'
      },
      features: 'Features',
      specifications: 'Specifications'
    },
    ar: {
      title: 'عقاراتي',
      addProperty: 'إضافة عقار جديد',
      noProperties: 'لا توجد عقارات مدرجة بعد',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      status: {
        pending: 'قيد الانتظار',
        accepted: 'مقبول',
        rejected: 'مرفوض',
        booked: 'محجوز',
        available: 'متاح'
      },
      deleteConfirm: 'هل أنت متأكد من حذف هذا العقار؟',
      actions: 'إجراءات',
      columns: {
        image: 'الصورة',
        title: 'العنوان',
        type: 'النوع',
        location: 'الموقع',
        price: 'السعر',
        bookingStatus: 'الحالة'
      },
      confirmStatusUpdate: 'هل أنت متأكد من تغيير حالة العقار إلى',
      noImage: 'لا توجد صورة',
      currency: 'ريال',
      area: 'المساحة',
      sqm: 'م²',
      bedrooms: 'غرف النوم',
      bathrooms: 'دورات المياه',
      types: {
        apartment: 'شقة',
        villa: 'فيلا',
        office: 'مكتب',
        shop: 'محل',
        land: 'أرض'
      },
      features: 'المميزات',
      specifications: 'المواصفات'
    }
  }

  const t = content[language]

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertyAPI.getOwnerProperties()
      console.log('Properties response:', response)
      
      if (response?.data?.items) {
        setProperties(response.data.items)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await propertyAPI.deleteProperty(propertyId)
        setProperties(properties.filter(p => p.id !== propertyId))
      } catch (error) {
        console.error('Failed to delete property:', error)
      }
    }
  }

  const handleBookingStatusUpdate = async (propertyId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'booked' : 'available'
    const confirmMessage = `${t.confirmStatusUpdate} ${t.status[newStatus]}?`
    
    if (window.confirm(confirmMessage)) {
      try {
        await propertyAPI.updatePropertyStatus(propertyId, newStatus)
        setProperties(properties.map(property =>
          property.id === propertyId
            ? { ...property, is_booked: newStatus === 'booked' ? 1 : 0 }
            : property
        ))
      } catch (error) {
        console.error('Failed to update property status:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className={`text-xl md:text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t.title}
        </h1>
        <button
          onClick={() => navigate('/owner/properties/add')}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          {t.addProperty}
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{t.noProperties}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDelete}
              onStatusUpdate={handleBookingStatusUpdate}
              translations={t}
            />
          ))}
        </div>
      )}
    </div>
  )
} 