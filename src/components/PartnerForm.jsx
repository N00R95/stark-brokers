import { useState } from 'react'

export default function PartnerForm({ language, type, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        notes: ''
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const content = {
        en: {
            title: type === 'renter' ? 'Renter Registration' : 'Owner Registration',
            name: 'Full Name',
            email: 'Email',
            phone: 'Phone Number',
            propertyType: 'Property Type',
            propertyOptions: {
                apartment: 'Apartment',
                villa: 'Villa',
                floor: 'Floor',
                land: 'Land',
                shop: 'Shop'
            },
            notes: 'Additional Notes',
            submit: 'Submit',
            successMessage: 'Form submitted successfully! We will contact you soon.',
            close: 'Close'
        },
        ar: {
            title: type === 'renter' ? 'تسجيل مستأجر' : 'تسجيل مالك',
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            propertyType: 'نوع العقار',
            propertyOptions: {
                apartment: 'شقة',
                villa: 'فيلا',
                floor: 'دور',
                land: 'ارض',
                shop: 'محل'
            },
            notes: 'ملاحظات إضافية',
            submit: 'إرسال',
            successMessage: 'تم إرسال النموذج بنجاح! سنتواصل معك قريباً',
            close: 'إغلاق'
        }
    }

    const t = content[language]

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))
            setIsSubmitted(true)
            // Close form after 3 seconds
            setTimeout(() => {
                onClose()
            }, 3000)
            console.log('Form submitted:', formData)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-gray-500" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </button>

                {isSubmitted ? (
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <svg 
                                className="mx-auto h-12 w-12 text-green-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className={`text-xl font-bold mb-4 ${
                            language === 'ar' ? 'font-arabic' : ''
                        }`}>
                            {t.successMessage}
                        </h3>
                        <button
                            onClick={onClose}
                            className="bg-[#BE092B]/90 text-white px-6 py-2 rounded-lg text-sm hover:bg-[#8a1328] transition-colors duration-200"
                        >
                            {t.close}
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className={`text-2xl font-black mb-6 ${
                            language === 'ar' ? 'font-arabic' : 'font-inter'
                        } text-center`}>
                            {t.title}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder={t.name}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#996D6D]"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder={t.email}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#996D6D]"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    placeholder={t.phone}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#996D6D]"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <select
                                    required
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#996D6D] appearance-none bg-white ${
                                        language === 'ar' ? 'font-arabic text-right' : ''
                                    } ${!formData.propertyType && 'text-gray-500'}`}
                                    value={formData.propertyType}
                                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                >
                                    <option value="" disabled>
                                        {t.propertyType}
                                    </option>
                                    {Object.entries(t.propertyOptions).map(([key, value]) => (
                                        <option 
                                            key={key} 
                                            value={key}
                                            className="bg-white hover:bg-white"
                                        >
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <textarea
                                    placeholder={t.notes}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#996D6D] min-h-[100px] ${
                                        language === 'ar' ? 'font-arabic text-right' : ''
                                    }`}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#BE092B]/90 text-white px-6 py-3 rounded-lg font-bold hover:bg-[#8a1328] transition-colors duration-200"
                            >
                                {t.submit}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
} 