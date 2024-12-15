import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX, FiChevronDown, FiHome } from 'react-icons/fi'
import bookingAPI from '../../services/bookingAPI'
import { toast } from 'react-hot-toast'

// Custom Saudi Riyal Icon component
const SaudiRiyalIcon = ({ className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`w-4 h-4 ${className}`}
  >
    <text x="5" y="17" fontSize="14" fontWeight="bold">﷼</text>
  </svg>
)

export default function TourRequests({ language }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openStatusMenu, setOpenStatusMenu] = useState(null)
  const [detailedRequests, setDetailedRequests] = useState({})

  useEffect(() => {
    fetchTourRequests()
  }, [])

  const fetchTourRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingAPI.getBookingRequests()

      if (response?.success && response?.data?.items) {
        setRequests(response.data.items)
        // Fetch details for each request
        response.data.items.forEach(request => {
          fetchRequestDetails(request.booking_id)
        })
      } else {
        setRequests([])
        toast.error('Invalid response format from server')
      }
    } catch (error) {
      console.error('Failed to fetch tour requests:', error)
      setError(error.message || 'Failed to fetch tour requests')
      toast.error(error.message || 'Failed to fetch tour requests')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequestDetails = async (bookingId) => {
    try {
      const response = await bookingAPI.getBookingDetails(bookingId)
      if (response?.success && response?.data) {
        setDetailedRequests(prev => ({
          ...prev,
          [bookingId]: response.data
        }))
      }
    } catch (error) {
      console.error(`Failed to fetch details for booking ${bookingId}:`, error)
    }
  }

  const content = {
    en: {
      title: 'Tour Requests',
      noRequests: 'No tour requests',
      changeStatus: 'Change Status',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        rejected: 'Rejected',
        cancelled: 'Cancelled',
        accepted: 'Accepted'
      },
      propertyInfo: 'Property Information',
      confirmStatusChange: 'Are you sure you want to change the status to {status}?',
      errorLoading: 'Error loading requests',
      tryAgain: 'Try Again',
      price: 'Price',
      type: 'Type',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      currency: 'SAR',
      sqm: 'm²'
    },
    ar: {
      title: 'طلبات الجولات',
      noRequests: 'لا توجد طلبات جولات',
      changeStatus: 'تغيير الحالة',
      status: {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        rejected: 'مرفوض',
        cancelled: 'ملغي',
        accepted: 'مقبول'
      },
      propertyInfo: 'معلومات العقار',
      confirmStatusChange: 'هل أنت متأكد أنك تريد تغيير الحالة إلى {status}؟',
      errorLoading: 'خطأ في تحميل الطلبات',
      tryAgain: 'حاول مرة أخرى',
      price: 'السعر',
      type: 'النوع',
      bedrooms: 'غرف النوم',
      bathrooms: 'الحمامات',
      area: 'المساحة',
      currency: 'ريال',
      sqm: 'م²'
    }
  }

  const t = content[language]

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleStatusChange = async (requestId, newStatus) => {
    const statusText = t.status[newStatus.toLowerCase()]
    if (window.confirm(t.confirmStatusChange.replace('{status}', statusText))) {
      try {
        const response = await bookingAPI.changeBookingStatus(requestId, newStatus)
        if (response.success) {
          toast.success('Status updated successfully')
          setOpenStatusMenu(null)
          fetchTourRequests()
        }
      } catch (error) {
        console.error('Failed to update status:', error)
        toast.error(error.message || 'Failed to update status')
      }
    }
  }

  // Available status transitions based on current status
  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = ['pending', 'confirmed', 'rejected', 'accepted', 'cancelled']
    return allStatuses.filter(status => status !== currentStatus?.toLowerCase())
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchTourRequests}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <div className="space-y-6">
        {!Array.isArray(requests) || requests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t.noRequests}</p>
        ) : (
          requests.map(request => {
            const details = detailedRequests[request.booking_id]
            return (
              <div
                key={request.booking_id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="p-4">
                  {/* Status Badge and Menu */}
                  <div className="flex justify-end mb-4 items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                      {t.status[request.status?.toLowerCase()] || request.status}
                    </span>

                    <div className="relative">
                      <button
                        onClick={() => setOpenStatusMenu(openStatusMenu === request.booking_id ? null : request.booking_id)}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border rounded-md"
                      >
                        {t.changeStatus}
                        <FiChevronDown className={`transition-transform ${openStatusMenu === request.booking_id ? 'rotate-180' : ''}`} />
                      </button>

                      {openStatusMenu === request.booking_id && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          {getAvailableStatuses(request.status).map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(request.booking_id, status)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {t.status[status]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Property Information */}
                  <div>
                    <h3 className={`font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {t.propertyInfo}
                    </h3>
                    <div className="space-y-3">
                      <p className="font-medium">{request.unit_title}</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin />
                        <span>{request.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar />
                        <span>
                          {new Date(request.booking_date).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiClock />
                        <span>
                          {new Date(request.booking_date).toLocaleTimeString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </div>
                      {details?.unit && (
                        <>
                          <div className="flex items-center gap-2 text-gray-600">
                            <SaudiRiyalIcon />
                            <span>{details.unit.price} {t.currency}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiHome />
                            <span>{details.unit.type}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            {details.unit.number_bedroom && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{details.unit.number_bedroom}</span> {t.bedrooms}
                              </div>
                            )}
                            {details.unit.number_bathroom && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{details.unit.number_bathroom}</span> {t.bathrooms}
                              </div>
                            )}
                            {details.unit.area && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{details.unit.area}</span> {t.sqm}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
} 