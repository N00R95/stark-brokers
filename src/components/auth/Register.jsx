import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { authAPI } from '../../services/api'
import { formatPhoneNumber, validateSaudiPhone } from '../../utils/phoneUtils'

export default function Register({ language, userType }) {
  const { register, error: authError } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('register') // 'register' | 'otp'
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    business_name: userType === 'owner' ? '' : undefined,
    business_license: userType === 'owner' ? '' : undefined,
    type: userType
  })
  const [otp, setOtp] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const content = {
    en: {
      title: userType === 'renter' ? 'Renter Registration' : 'Owner Registration',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      businessName: 'Business Name',
      businessLicense: 'Business License Number',
      submit: 'Send OTP',
      otpTitle: 'Verify OTP',
      otpMessage: 'Please enter the verification code sent to your phone',
      otpPlaceholder: 'Enter OTP',
      verifyButton: 'Verify & Register',
      successMessage: 'Registration successful! Redirecting...',
      invalidOtp: 'Invalid OTP. Please try again.',
      resendOtp: 'Resend OTP',
      loginLink: 'Already have an account? Login',
      validationErrors: {
        fullNameRequired: 'Full name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid Saudi phone number',
        addressRequired: 'Address is required',
        businessNameRequired: 'Business name is required for owners',
        businessLicenseRequired: 'Business license is required for owners',
        phoneExists: 'This phone number is already registered'
      },
      placeholders: {
        name: 'Enter your full name',
        email: 'example@email.com',
        phone: '5XXXXXXXX',
        address: 'Enter your address',
        businessName: 'Enter your business name',
        businessLicense: 'Enter your business license number'
      }
    },
    ar: {
      title: userType === 'renter' ? 'تسجيل مستأجر' : 'تسجيل مالك',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      address: 'العنوان',
      businessName: 'اسم الشركة',
      businessLicense: 'رقم الرخصة التجارية',
      submit: 'إرسال رمز التحقق',
      otpTitle: 'التحقق من الرمز',
      otpMessage: 'الرجاء إدخال رمز التحقق المرسل إلى هاتفك',
      otpPlaceholder: 'أدخل رمز التحقق',
      verifyButton: 'تحقق وتسجيل',
      successMessage: 'تم التسجيل بنجاح! جاري التحويل...',
      invalidOtp: 'رمز التحقق غير صحيح. حاول مرة أخرى.',
      resendOtp: 'إعادة إرسال الرمز',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
      validationErrors: {
        fullNameRequired: 'الاسم الكامل مطلوب',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
        phoneRequired: 'رقم الهاتف مطلوب',
        phoneInvalid: 'يرجى إدخال رقم هاتف سعودي صحيح',
        addressRequired: 'العنوان مطلوب',
        businessNameRequired: 'اسم الشركة مطلوب للملاك',
        businessLicenseRequired: 'رقم الرخصة التجارية مطلوب للملاك',
        phoneExists: 'رقم الهاتف مسجل بالفعل'
      },
      placeholders: {
        name: 'أدخل اسمك الكامل',
        email: 'example@email.com',
        phone: '5XXXXXXXX',
        address: 'أدخل عنوانك',
        businessName: 'أدخل اسم الشركة',
        businessLicense: 'أدخل رقم الرخصة التجارية'
      }
    }
  }

  const t = content[language]

  const validateForm = () => {
    // Basic required fields validation
    if (!formData.full_name?.trim() || !formData.email?.trim() || !formData.phone?.trim() || !formData.address?.trim()) {
      setError(language === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields are required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t.validationErrors.emailInvalid);
      return false;
    }

    // Phone validation
    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!validateSaudiPhone(formattedPhone)) {
      setError(t.validationErrors.phoneInvalid);
      return false;
    }

    // Owner-specific validation
    if (userType === 'owner') {
      if (!formData.business_name?.trim()) {
        setError(t.validationErrors.businessNameRequired);
        return false;
      }
      if (!formData.business_license?.trim()) {
        setError(t.validationErrors.businessLicenseRequired);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);

      const registrationData = {
        ...formData,
        phone: formattedPhone,
        type: userType,
        ...(userType === 'owner' ? {
          business_name: formData.business_name,
          business_license: formData.business_license
        } : {})
      };

      console.log('🔄 Sending Registration Request:', registrationData);

      const response = await authAPI.register(registrationData);

      if (response.success) {
        localStorage.setItem('auth_phone', formattedPhone);
        localStorage.setItem('auth_type', userType);
        setStep('otp');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration Error:', error);

      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => err.messages).join('\n');
        setError(errorMessages || error.message || 'Registration failed');
      } else {
        setError(error.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const storedPhone = localStorage.getItem('auth_phone');
      const storedType = localStorage.getItem('auth_type');

      console.log('🔄 Sending OTP Verification:', {
        otp,
        phone: storedPhone,
        type: storedType
      });

      const response = await authAPI.verifyOTP({
        otp,
        phone: storedPhone,
        type: storedType
      });

      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);

        const userResponse = await authAPI.getUserProfile();
        if (userResponse.success && userResponse.data) {
          localStorage.setItem('user', JSON.stringify(userResponse.data));
        }

        setIsSubmitted(true);

        setTimeout(() => {
          const dashboardPath = storedType === 'renter' ? '/renter/dashboard' : '/owner/dashboard';
          navigate(dashboardPath);
        }, 2000);
      } else {
        setError(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('❌ OTP Verification Error:', error);
      setError(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (step === 'register') {
        localStorage.removeItem('auth_phone');
        localStorage.removeItem('auth_type');
      }
    };
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                      {t.name} *
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      required
                      placeholder={t.placeholders.name}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t.email} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder={t.placeholders.email}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t.phone} *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">+966</span>
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder={t.placeholders.phone}
                        className="pl-16 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.phone.replace(/^\+966/, '')}
                        onChange={(e) => {
                          const input = e.target.value.replace(/\D/g, '');
                          const phone = input.length > 0 ? `+966${input}` : '';
                          setFormData({ ...formData, phone });
                        }}
                        maxLength="9"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      {t.address} *
                    </label>
                    <input
                      id="address"
                      type="text"
                      required
                      placeholder={t.placeholders.address}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  {userType === 'owner' && (
                    <>
                      <div>
                        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                          {t.businessName} *
                        </label>
                        <input
                          id="business_name"
                          type="text"
                          required
                          placeholder={t.placeholders.businessName}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                          value={formData.business_name}
                          onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label htmlFor="business_license" className="block text-sm font-medium text-gray-700">
                          {t.businessLicense} *
                        </label>
                        <input
                          id="business_license"
                          type="text"
                          required
                          placeholder={t.placeholders.businessLicense}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                          value={formData.business_license}
                          onChange={(e) => setFormData({ ...formData, business_license: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? '...' : t.submit}
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