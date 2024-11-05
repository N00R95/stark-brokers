import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OwnerRegistration({ language }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    businessLicense: '',
  })

  const navigate = useNavigate()

  const content = {
    en: {
      title: 'Property Owner Registration',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone Number',
      businessName: 'Business Name',
      businessLicense: 'Business License Number',
      submit: 'Register',
      loginLink: 'Already have an account? Login',
    },
    ar: {
      title: 'تسجيل مالك العقار',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      phone: 'رقم الهاتف',
      businessName: 'اسم الشركة',
      businessLicense: 'رقم الرخصة التجارية',
      submit: 'تسجيل',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
    },
  }

  const t = content[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add registration logic here
    try {
      // API call to register owner
      navigate('/owner/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {t.title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Form fields similar to RenterRegistration but with owner-specific fields */}
            {/* ... */}
          </form>
        </div>
      </div>
    </div>
  )
} 