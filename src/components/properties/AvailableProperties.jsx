import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../services/api'
import PropertyFilters from './PropertyFilters'
import { FiHeart, FiMaximize } from 'react-icons/fi'
import { IoBedOutline, IoWaterOutline, IoLocationOutline } from "react-icons/io5"
import React from 'react';

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
      land: 'Land',
      house: 'House',
      studio: 'Studio',
      commercial: 'Commercial'
    },
    currency: 'SAR',
    sqm: 'm²',
    apply: 'Apply Filters',
    reset: 'Reset Filters',
    from: 'From',
    viewDetails: 'View Details'
  },
  ar: {
    title: 'ا��عقارات المتاحة',
    showFilters: 'إظهار الفلاتر',
    hideFilters: 'إخفاء الفلاتر',
    noProperties: 'لا تجد عقارات متاحة',
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
      land: 'أرض',
      house: 'منزل',
      studio: 'استوديو',
      commercial: 'تجاري'
    },
    currency: 'ريال',
    sqm: 'م²',
    apply: 'تطبيق الفلاتر',
    reset: 'إعادة تعيين',
    from: 'من',
    viewDetails: 'عرض التفاصيل'
  }
};

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Property rendering error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-red-500">Something went wrong loading properties.</div>;
        }

        return this.props.children;
    }
}

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
        bedrooms: '',
        features: [],
        location: ''
    })
    const [showFilters, setShowFilters] = useState(false)

    // Fetch properties when filters change
    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare filter params
            const params = {};
            
            // Only add filters that have values and convert types
            if (filters.type && filters.type !== 'all') params.type = filters.type;
            if (filters.price_min) params.price_min = parseFloat(filters.price_min);
            if (filters.price_max) params.price_max = parseFloat(filters.price_max);
            if (filters.area_min) params.area_min = parseFloat(filters.area_min);
            if (filters.area_max) params.area_max = parseFloat(filters.area_max);
            if (filters.location && filters.location !== 'all') params.location = filters.location;
            if (filters.bedrooms && filters.bedrooms !== 'all') params.bedrooms = parseInt(filters.bedrooms);
            if (filters.features?.length > 0) params.features = filters.features;

            console.log('Fetching properties with params:', params);

            const response = await propertyAPI.getAvailableProperties(params);
            console.log('Properties response:', response);
            
            // Check for different possible response structures
            const items = response?.data?.items || response?.items || [];
            console.log('Processed items:', items);

            setProperties(items);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
            setError(error.message || 'Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }))
    }

    // Add new function to handle filter application
    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        fetchProperties();
    }

    // Property Card Component
    const PropertyCard = ({ property }) => {
        const t = content[language];
        
        const propertyType = property.type ? t.propertyTypes[property.type.toLowerCase()] || property.type : null;

        return (
            <div 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                onClick={() => navigate(`/properties/${property.id}`)}
            >
                <div className="relative">
                    <img
                        src={property.images?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
                        alt={property.title}
                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {propertyType && (
                        <div className="absolute top-4 right-4 bg-[#BE092B]/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {propertyType}
                        </div>
                    )}
                    <button 
                        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle save
                        }}
                    >
                        <FiHeart className="text-[#BE092B]" />
                    </button>
                </div>

                <div className="p-6">
                    {property.address && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <IoLocationOutline className="text-[#BE092B]" />
                            <span>{property.address}</span>
                        </div>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-4 line-clamp-2 text-gray-800">{property.title}</h3>
                    
                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                        {property.number_bedroom && (
                            <div className="flex items-center gap-1">
                                <IoBedOutline className="text-[#BE092B]" />
                                <span>{property.number_bedroom}</span>
                            </div>
                        )}
                        {property.number_bathroom && (
                            <div className="flex items-center gap-1">
                                <IoWaterOutline className="text-[#BE092B]" />
                                <span>{property.number_bathroom}</span>
                            </div>
                        )}
                        {property.area && (
                            <div className="flex items-center gap-1">
                                <FiMaximize className="text-[#BE092B]" />
                                <span>{property.area} m²</span>
                            </div>
                        )}
                    </div>

                    {property.features?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {property.features.slice(0, 3).map(feature => (
                                <span 
                                    key={feature.id}
                                    className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100"
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

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                            <span className="text-gray-500 text-sm">{t.from}</span>
                            <p className="text-[#BE092B] font-bold text-xl">
                                {property.price} {t.currency}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/properties/${property.id}`);
                            }}
                            className="px-4 py-2 bg-[#BE092B]/90 text-white rounded-lg hover:bg-[#8a1328] transition-colors"
                        >
                            {t.viewDetails}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

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
                        language={language}
                        activeFilters={filters}
                        onFilterChange={handleApplyFilters}
                    />
                </div>
            )}

            {properties.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">{content[language].noProperties}</p>
                </div>
            ) : (
                <ErrorBoundary>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </ErrorBoundary>
            )}
        </div>
    )
} 