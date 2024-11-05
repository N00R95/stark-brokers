import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../services/api'
import { FiFilter, FiHeart, FiMaximize } from 'react-icons/fi'
import { IoBedOutline, IoWaterOutline } from "react-icons/io5"
import PropertyFilters from './PropertyFilters'

export default function AvailableProperties({ language }) {
    const [properties, setProperties] = useState([])
    const [filteredProperties, setFilteredProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    const [activeFilters, setActiveFilters] = useState({
        type: 'all',
        priceRange: 'all',
        bedrooms: 'all',
        amenities: [],
        location: 'all'
    })
    const navigate = useNavigate()
    const [savedProperties, setSavedProperties] = useState(() => {
        const saved = localStorage.getItem('savedProperties')
        return saved ? JSON.parse(saved) : []
    })

    const content = {
        en: {
            title: 'Available Properties',
            loading: 'Loading properties...',
            error: 'Failed to load properties',
            noProperties: 'No properties available at the moment',
            showFilters: 'Show Filters',
            hideFilters: 'Hide Filters',
            sortBy: 'Sort By',
            sortOptions: {
                newest: 'Newest First',
                priceAsc: 'Price: Low to High',
                priceDesc: 'Price: High to Low'
            }
        },
        ar: {
            title: 'العقارات المتاحة',
            loading: 'جاري تحميل العقارات...',
            error: 'فشل في تحميل العقارات',
            noProperties: 'لا توجد عقارات متاحة حالياً',
            showFilters: 'إظهار الفلاتر',
            hideFilters: 'إخفاء الفلاتر',
            sortBy: 'ترتيب حسب',
            sortOptions: {
                newest: 'الأحدث أولاً',
                priceAsc: 'السعر: من الأقل إلى الأعلى',
                priceDesc: 'السعر: من الأعلى إلى الأقل'
            }
        }
    }

    const t = content[language]

    const propertyTypes = {
        en: {
            apartment: 'Apartment',
            villa: 'Villa',
            office: 'Office',
            shop: 'Shop',
            land: 'Land'
        },
        ar: {
            apartment: 'شقة',
            villa: 'فيلا',
            office: 'مكتب',
            shop: 'محل',
            land: 'أرض'
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    useEffect(() => {
        if (properties.length > 0) {
            applyFilters()
        }
    }, [activeFilters, properties])

    const fetchProperties = async () => {
        try {
            setLoading(true)
            const response = await propertyAPI.getAvailable()
            if (response?.data?.properties) {
                setProperties(response.data.properties)
                setFilteredProperties(response.data.properties)
            } else {
                setProperties([])
                setFilteredProperties([])
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error)
            setError(t.error)
            setProperties([])
            setFilteredProperties([])
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...properties]

        // Apply type filter
        if (activeFilters.type !== 'all') {
            filtered = filtered.filter(property => property.type === activeFilters.type)
        }

        // Apply price range filter with safety checks
        if (activeFilters.priceRange && activeFilters.priceRange !== 'all') {
            const [min, max] = activeFilters.priceRange.split('-').map(Number)
            filtered = filtered.filter(property => {
                const price = parseFloat(property.price.replace(/[^0-9.-]+/g, ''))
                if (!isNaN(price)) {  // Add check for valid price
                    if (max) {
                        return price >= min && price <= max
                    }
                    return price >= min
                }
                return true  // Include properties with invalid prices
            })
        }

        // Apply bedrooms filter with safety check
        if (activeFilters.bedrooms && activeFilters.bedrooms !== 'all') {
            filtered = filtered.filter(property => 
                property.bedrooms === parseInt(activeFilters.bedrooms)
            )
        }

        // Apply amenities filter with safety check
        if (activeFilters.amenities && activeFilters.amenities.length > 0) {
            filtered = filtered.filter(property =>
                property.amenities && activeFilters.amenities.every(amenity => 
                    property.amenities.includes(amenity)
                )
            )
        }

        // Apply location filter with safety check
        if (activeFilters.location && activeFilters.location !== 'all') {
            filtered = filtered.filter(property =>
                property.location === activeFilters.location
            )
        }

        // Apply area range filter with safety check
        if (activeFilters.areaRange && activeFilters.areaRange !== 'all') {
            const [min, max] = activeFilters.areaRange.split('-').map(Number)
            filtered = filtered.filter(property => {
                if (property.area) {  // Add check for valid area
                    if (max) {
                        return property.area >= min && property.area <= max
                    }
                    return property.area >= min
                }
                return true  // Include properties without area specified
            })
        }

        setFilteredProperties(filtered)
    }

    const handleFilterChange = (newFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            ...newFilters
        }))
    }

    const handleSaveProperty = (propertyId) => {
        setSavedProperties(prev => {
            const newSaved = prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
            
            localStorage.setItem('savedProperties', JSON.stringify(newSaved))
            return newSaved
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-600">{t.loading}</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className={`text-3xl font-bold ${
                    language === 'ar' ? 'font-arabic' : ''
                }`}>
                    {t.title}
                </h1>
                
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <FiFilter />
                    {showFilters ? t.hideFilters : t.showFilters}
                </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} mb-8`}>
                <PropertyFilters 
                    language={language}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {filteredProperties.length === 0 ? (
                <p className="text-center text-gray-600">{t.noProperties}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <div 
                            key={property.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img 
                                    src={property.images?.[0] || `https://placehold.co/600x400/png/white?text=${property.type}`}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm">
                                    {propertyTypes[language][property.type]}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSaveProperty(property.id)
                                    }}
                                    className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-200 ${
                                        savedProperties.includes(property.id)
                                            ? 'bg-primary text-white scale-110'
                                            : 'bg-white text-gray-600 hover:scale-110'
                                    }`}
                                >
                                    <FiHeart className={`w-5 h-5 ${
                                        savedProperties.includes(property.id) && 'fill-current'
                                    }`} />
                                </button>
                                {property.images?.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                                        {property.images.length} photos
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    {property.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    {property.bedrooms !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <IoBedOutline className="text-gray-400" />
                                            {property.bedrooms} {language === 'ar' ? 'غرف' : 'Beds'}
                                        </span>
                                    )}
                                    {property.bathrooms !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <IoWaterOutline className="text-gray-400" />
                                            {property.bathrooms} {language === 'ar' ? 'حمامات' : 'Baths'}
                                        </span>
                                    )}
                                    {property.area && (
                                        <span className="flex items-center gap-1">
                                            <FiMaximize className="text-gray-400" />
                                            {property.area} m²
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-bold">
                                        {property.price} SAR
                                    </span>
                                    <button 
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
                                        onClick={() => navigate(`/properties/${property.id}`)}
                                    >
                                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 