import { useState } from 'react'
import { FiHeart, FiShare } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function SavedProperties({ language }) {
  const navigate = useNavigate()
  const [savedProperties, setSavedProperties] = useState([
    // Add mock saved properties
  ])

  const content = {
    en: {
      title: 'Saved Properties',
      noProperties: 'No saved properties',
      remove: 'Remove',
      viewDetails: 'View Details'
    },
    ar: {
      title: 'العقارات المحفوظة',
      noProperties: 'لا توجد عقارات محفوظة',
      remove: 'إزالة',
      viewDetails: 'عرض التفاصيل'
    }
  }

  const t = content[language]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProperties.map(property => (
          <div
            key={property.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{property.title}</h3>
              <p className="text-primary font-bold mb-4">{property.price} SAR</p>
              <div className="flex justify-between">
                <button
                  onClick={() => {/* Handle remove */}}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  {t.remove}
                </button>
                <button
                  onClick={() => navigate(`/properties/${property.id}`)}
                  className="text-sm text-primary hover:text-primary-hover"
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 