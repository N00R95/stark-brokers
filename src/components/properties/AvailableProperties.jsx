import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../services/api'
import PropertyFilters from './PropertyFilters'
import { FiHeart, FiMaximize } from 'react-icons/fi'
import { IoBedOutline, IoWaterOutline } from "react-icons/io5"

const content = {
  en: {
    title: 'Available Properties',
    showFilters: 'Show Filters',
    hideFilters: 'Hide Filters',
    noProperties: 'No properties available',
    filters: {
      type: 'Property Type',
      price: 'Price Range',
      area: 'Area Range',
      location: 'Location',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      features: 'Features'
    },
    propertyTypes: {
      apartment: 'Apartment',
      villa: 'Villa',
      office: 'Office',
      shop: 'Shop',
      land: 'Land'
    },
    currency: 'SAR',
    sqm: 'm²',
    apply: 'Apply Filters',
    reset: 'Reset Filters'
  },
  ar: {
    title: 'العقارات المتاحة',
    showFilters: 'إظهار الفلاتر',
    hideFilters: 'إخفاء الفلاتر',
    noProperties: 'لا توجد عقارات متاحة',
    filters: {
      type: 'نوع العقار',
      price: 'نطاق السعر',
      area: 'نطاق المساحة',
      location: 'الموقع',
      bedrooms: 'غرف النوم',
      bathrooms: 'دورات المياه',
      features: 'المميزات'
    },
    propertyTypes: {
      apartment: 'شقة',
      villa: 'فيلا',
      office: 'مكتب',
      shop: 'محل',
      land: 'أرض'
    },
    currency: 'ريال',
    sqm: 'م²',
    apply: 'تطبيق الفلاتر',
    reset: 'إعادة تعيين'
  }
};

export default function AvailableProperties({ language }) {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        type: '',
        price_min: '',
        price_max: '',
        area_min: '',
        area_max: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        features: []
    })
    const [showFilters, setShowFilters] = useState(false)

    // Fetch properties when filters change
    useEffect(() => {
        fetchProperties()
    }, [filters])

    const fetchProperties = async () => {
        try {
            setLoading(true)
            setError(null)

            // Prepare filter params according to API specs
            const params = {}
            
            // Only add filters that have values
            if (filters.type) params.type = filters.type
            if (filters.price_min) params.price_min = filters.price_min
            if (filters.price_max) params.price_max = filters.price_max
            if (filters.area_min) params.area_min = filters.area_min
            if (filters.area_max) params.area_max = filters.area_max
            if (filters.location) params.location = filters.location
            if (filters.bedrooms) params.bedrooms = filters.bedrooms
            if (filters.bathrooms) params.bathrooms = filters.bathrooms
            if (filters.features.length > 0) params.features = filters.features

            console.log('Fetching properties with params:', params)

            const response = await propertyAPI.getAvailableProperties(params)
            
            if (response?.data?.items) {
                setProperties(response.data.items)
            } else {
                setProperties([])
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error)
            setError(error.message || 'Failed to load properties')
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }))
    }

    // Property Card Component
    const PropertyCard = ({ property }) => {
        const t = content[language];

        console.log('Property type:', property.type);

        return (
            <div 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
            >
                <div className="relative aspect-[4/3]">
                    <img 
                        src={property.images?.[0]?.url || 'https://placehold.co/400x300?text=No+Image'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                    />
                    {property.type && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                            {property.type === 'apartment' && t.propertyTypes.apartment}
                            {property.type === 'villa' && t.propertyTypes.villa}
                            {property.type === 'office' && t.propertyTypes.office}
                            {property.type === 'shop' && t.propertyTypes.shop}
                            {property.type === 'land' && t.propertyTypes.land}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {property.number_bedroom && (
                            <span className="flex items-center gap-1">
                                <IoBedOutline />
                                {property.number_bedroom}
                            </span>
                        )}
                        {property.number_bathroom && (
                            <span className="flex items-center gap-1">
                                <IoWaterOutline />
                                {property.number_bathroom}
                            </span>
                        )}
                        {property.area && (
                            <span className="flex items-center gap-1">
                                <FiMaximize />
                                {property.area} {t.sqm}
                            </span>
                        )}
                    </div>

                    {property.features?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {property.features.slice(0, 3).map(feature => (
                                <span 
                                    key={feature.id}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                    {feature.name}
                                </span>
                            ))}
                            {property.features.length > 3 && (
                                <span className="text-xs text-gray-500">
                                    +{property.features.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-primary font-bold text-lg">
                            {property.price} {t.currency}
                        </span>
                        <button 
                            className="text-gray-500 hover:text-primary transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle save property
                            }}
                        >
                            <FiHeart className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].title}
                </h1>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                    {showFilters ? content[language].hideFilters : content[language].showFilters}
                </button>
            </div>

            {showFilters && (
                <div className="mb-8">
                    <PropertyFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        language={language}
                        translations={content[language].filters}
                    />
                </div>
            )}

            {properties.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">{content[language].noProperties}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    )
} 