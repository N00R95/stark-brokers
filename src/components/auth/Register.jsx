import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { authAPI } from '../../services/api'

export default function Register({ language, userType }) {
  const { register, error: authError } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('register') // 'register' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [otp, setOtp] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const content = {
    en: {
      title: userType === 'renter' ? 'Renter Registration' : 'Owner Registration',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      submit: 'Send OTP',
      otpTitle: 'Verify OTP',
      otpMessage: 'Please enter the verification code sent to your phone',
      otpPlaceholder: 'Enter OTP',
      verifyButton: 'Verify & Register',
      successMessage: 'Registration successful! Redirecting...',
      invalidOtp: 'Invalid OTP. Please try again.',
      resendOtp: 'Resend OTP',
      loginLink: 'Already have an account? Login',
    },
    ar: {
      title: userType === 'renter' ? 'تسجيل مستأجر' : 'تسجيل مالك',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      submit: 'إرسال رمز التحقق',
      otpTitle: 'التحقق من الرمز',
      otpMessage: 'الرجاء إدخال رمز التحقق المرسل إلى هاتفك',
      otpPlaceholder: 'أدخل رمز التحقق',
      verifyButton: 'تحقق وتسجيل',
      successMessage: 'تم التسجيل بنجاح! جاري التحويل...',
      invalidOtp: 'رمز التحقق غير صحيح. حاول مرة أخرى.',
      resendOtp: 'إعادة إرسال الرمز',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
    }
  }

  const t = content[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: userType
      })

      if (response.success) {
        localStorage.setItem('temp_registration_id', response.data.registration_id)
        setStep('otp')
      }
    } catch (error) {
      console.error('Failed to register:', error)
      setError(language === 'ar'
        ? 'حدث خطأ أثناء التسجيل'
        : 'Registration failed'
      )
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const registrationId = localStorage.getItem('temp_registration_id')
      const response = await authAPI.verifyOTP({
        registration_id: registrationId,
        otp: otp,
        ...formData
      })

      if (response.success) {
        localStorage.setItem('token', response.data.token)
        
        await register({
          ...formData,
          type: userType,
          id: response.data.user.id
        })

        setIsSubmitted(true)
        localStorage.removeItem('temp_registration_id')
        
        setTimeout(() => {
          if (userType === 'renter') {
            navigate('/properties/available')
          } else {
            navigate('/owner/dashboard')
          }
        }, 2000)
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
      setError(t.invalidOtp)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {step === 'register' ? t.title : t.otpTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t.successMessage}
              </h3>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
                  {error}
                </div>
              )}

              {step === 'register' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder={t.name}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder={t.email}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder={t.phone}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200"
                  >
                    {t.submit}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className={`text-sm text-gray-600 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.otpMessage}
                  </p>
                  <input
                    type="text"
                    placeholder={t.otpPlaceholder}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200"
                  >
                    {t.verifyButton}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('register')}
                    className="w-full text-gray-600 text-sm hover:text-gray-900"
                  >
                    {t.resendOtp}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link
                  to={`/login/${userType}`}
                  className="text-sm font-medium text-primary hover:text-primary-hover"
                >
                  {t.loginLink}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 