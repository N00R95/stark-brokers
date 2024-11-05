import { useState } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import BookingForm from '../properties/BookingForm'

export default function Tours({ language }) {
  const [tours, setTours] = useState([
    {
      id: 1,
      propertyTitle: 'Modern Apartment in Al Olaya',
      propertyId: '123',
      date: '2024-03-20',
      time: '14:00',
      status: 'upcoming',
      location: 'Riyadh, Al Olaya District'
    }
  ])
  
  const [showReschedule, setShowReschedule] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  const content = {
    en: {
      title: 'My Tours',
      upcoming: 'Upcoming Tours',
      past: 'Past Tours',
      noTours: 'No tours scheduled',
      cancel: 'Cancel Tour',
      reschedule: 'Reschedule',
      cancelled: 'Cancelled',
      completed: 'Completed',
      cancelConfirm: 'Are you sure you want to cancel this tour?',
      yes: 'Yes, Cancel',
      no: 'No, Keep it'
    },
    ar: {
      title: 'جولاتي',
      upcoming: 'الجولات القادمة',
      past: 'الجولات السابقة',
      noTours: 'لا توجد جولات مجدولة',
      cancel: 'إلغاء الجولة',
      reschedule: 'إعادة جدولة',
      cancelled: 'ملغية',
      completed: 'مكتملة',
      cancelConfirm: 'هل أنت متأكد أنك تريد إلغاء هذه الجولة؟',
      yes: 'نعم، إلغاء',
      no: 'لا، احتفظ بها'
    }
  }

  const t = content[language]

  const handleCancel = async (tourId) => {
    if (window.confirm(t.cancelConfirm)) {
      try {
        // Simulate API call to cancel tour
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Update local state
        setTours(tours.map(tour => 
          tour.id === tourId 
            ? { ...tour, status: 'cancelled' }
            : tour
        ))
      } catch (error) {
        console.error('Failed to cancel tour:', error)
      }
    }
  }

  const handleReschedule = (tour) => {
    setSelectedTour(tour)
    setShowReschedule(true)
  }

  const handleRescheduleSubmit = (newDate, newTime) => {
    setTours(tours.map(tour =>
      tour.id === selectedTour.id
        ? { ...tour, date: newDate, time: newTime }
        : tour
    ))
    setShowReschedule(false)
    setSelectedTour(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <div className="space-y-8">
        {/* Upcoming Tours */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.upcoming}
          </h2>
          <div className="space-y-4">
            {tours
              .filter(tour => tour.status === 'upcoming')
              .map(tour => (
                <div
                  key={tour.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold mb-2">{tour.propertyTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      <span>{new Date(tour.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{tour.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin />
                      <span>{tour.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      className="text-sm text-red-600 hover:text-red-700"
                      onClick={() => handleCancel(tour.id)}
                    >
                      {t.cancel}
                    </button>
                    <button
                      className="text-sm text-primary hover:text-primary-hover"
                      onClick={() => handleReschedule(tour)}
                    >
                      {t.reschedule}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Past Tours */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.past}
          </h2>
          {/* Similar structure for past tours */}
        </section>
      </div>

      {/* Reschedule Modal */}
      {showReschedule && selectedTour && (
        <BookingForm
          language={language}
          property={{ id: selectedTour.propertyId, title: selectedTour.propertyTitle }}
          onClose={() => {
            setShowReschedule(false)
            setSelectedTour(null)
          }}
          isReschedule={true}
          initialDate={selectedTour.date}
          initialTime={selectedTour.time}
          onSubmit={handleRescheduleSubmit}
        />
      )}
    </div>
  )
} 