import { useState } from 'react'
import { FiCalendar, FiClock } from 'react-icons/fi'
import bookingAPI from '../../services/bookingAPI'

export default function BookingForm({
  language,
  property,
  onClose,
  isReschedule = false,
  initialDate = '',
  initialTime = '',
  onSubmit
}) {
  const [formData, setFormData] = useState({
    date: initialDate,
    time: initialTime
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  // Get date 3 months from now for max date
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  // Available time slots
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00'
  ]

  const content = {
    en: {
      title: isReschedule ? 'Reschedule Tour' : 'Schedule a Tour',
      subtitle: isReschedule
        ? `Reschedule viewing for ${property?.title}`
        : `Book a viewing for ${property?.title}`,
      date: 'Select Date',
      time: 'Select Time',
      submit: isReschedule ? 'Reschedule Tour' : 'Schedule Tour',
      success: isReschedule ? 'Tour rescheduled successfully!' : 'Tour scheduled successfully!',
      successMessage: 'We will send you a confirmation shortly.',
      close: 'Close',
      error: {
        generic: 'Something went wrong. Please try again.',
        invalidDate: 'Please select a valid date and time.',
        pastDate: 'Selected date and time must be in the future.',
        unavailable: 'This time slot is not available. Please select another time.'
      }
    },
    ar: {
      title: isReschedule ? 'إعادة جدولة الجولة' : 'جدولة جولة',
      subtitle: isReschedule
        ? `إعادة جدولة معاينة لـ ${property?.title}`
        : `حجز معاينة لـ ${property?.title}`,
      date: 'اختر التاريخ',
      time: 'اختر الوقت',
      submit: isReschedule ? 'إعادة جدولة الجولة' : 'جدولة الجولة',
      success: isReschedule ? 'تم إعادة جدولة الجولة بنجاح!' : 'تم جدولة الجولة بنجاح!',
      successMessage: 'سنرسل لك تأكيداً قريباً.',
      close: 'إغلاق',
      error: {
        generic: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        invalidDate: 'يرجى اختيار تاريخ ووقت صحيحين.',
        pastDate: 'يجب أن يكون التاريخ والوقت المحددين في المستقبل.',
        unavailable: 'هذا الموعد غير متاح. يرجى اختيار وقت آخر.'
      }
    }
  }

  const t = content[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate date and time
      if (!formData.date || !formData.time) {
        throw new Error('invalidDate')
      }

      // Combine date and time into booking_date
      const bookingDate = new Date(`${formData.date}T${formData.time}:00`)
      const now = new Date()

      // Check if selected date/time is in the past
      if (bookingDate <= now) {
        throw new Error('pastDate')
      }

      // Format datetime for API
      const booking_date = bookingDate.toISOString().slice(0, 19).replace('T', ' ')

      if (isReschedule && onSubmit) {
        await onSubmit(formData.date, formData.time)
      } else {
        // Create new booking request
        const formDataToSend = new URLSearchParams()
        formDataToSend.append('unit_id', property.id)
        formDataToSend.append('booking_date', booking_date)

        const response = await bookingAPI.createBookingRequest(Object.fromEntries(formDataToSend))

        if (!response.success) {
          throw new Error(response.message || 'generic')
        }
      }

      setIsSubmitted(true)

      // Close form after success
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Failed to schedule tour:', error)
      setError(
        t.error[error.message] ||
        error.response?.data?.message ||
        t.error.generic
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t.success}</h3>
            <p className="text-gray-600">{t.successMessage}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
            <p className="text-gray-600 mb-6">{t.subtitle}</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t.date}
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    required
                    min={today}
                    max={maxDateStr}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      setError(null)
                    }}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t.time}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-2 text-sm border rounded-lg ${formData.time === time
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300 hover:border-primary'
                        }`}
                      onClick={() => {
                        setFormData({ ...formData, time })
                        setError(null)
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.date || !formData.time}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
} 