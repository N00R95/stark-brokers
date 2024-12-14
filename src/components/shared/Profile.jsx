import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile({ language, userType }) {
  const navigate = useNavigate();
  const { user, token, loading: authLoading, logout, updateAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login/' + userType);
      return;
    }
    loadProfile();
  }, [token, userType]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.getUserProfile();
      console.log('👤 Profile data:', response.data);

      if (response.success && response.data) {
        // Update global user data with profile response
        updateAuth(null, response.data);
      } else if (response.status === 401) {
        await logout();
        navigate('/login/' + userType, { 
          state: { message: 'Session expired. Please login again.' }
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('❌ Profile error:', err);
      setError('Unable to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const content = {
    en: {
      title: 'Profile',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email',
      type: 'Account Type',
      businessName: 'Business Name',
      businessLicense: 'Business License',
      address: 'Address',
      memberSince: 'Member Since',
      loading: 'Loading profile...',
      retry: 'Retry',
      noData: 'No profile data available',
      types: {
        owner: 'Property Owner',
        renter: 'Renter'
      }
    },
    ar: {
      title: 'الملف الشخصي',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      type: 'نوع الحساب',
      businessName: 'اسم الشركة',
      businessLicense: 'رخصة التجارة',
      address: 'العنوان',
      memberSince: 'تاريخ الإنضمام',
      loading: 'جاري تحميل الملف الشخصي...',
      retry: 'إعادة المحاولة',
      noData: 'لا توجد بيانات متاحة',
      types: {
        owner: 'مالك عقار',
        renter: 'مستأجر'
      }
    }
  };

  const t = content[language];

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadProfile}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  // Use either loaded profile data or auth context user data
  const profileData = user || authUser;

  if (!profileData) {
    return (
      <div className="text-center py-8">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {t.title}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.fullName}
            </label>
            <div className="mt-1 text-gray-900">
              {user?.full_name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.phone}
            </label>
            <div className="mt-1 text-gray-900 font-mono">
              {user?.phone}
            </div>
          </div>

          {user?.email && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.email}
              </label>
              <div className="mt-1 text-gray-900">
                {user?.email}
              </div>
            </div>
          )}

          {user?.type === 'owner' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t.businessName}
                </label>
                <div className="mt-1 text-gray-900">
                  {user?.business_name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t.businessLicense}
                </label>
                <div className="mt-1 text-gray-900">
                  {user?.business_license}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t.address}
                </label>
                <div className="mt-1 text-gray-900">
                  {user?.address}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.type}
            </label>
            <div className="mt-1 text-gray-900">
              {t.types[user?.type]}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.memberSince}
            </label>
            <div className="mt-1 text-gray-900">
              {user?.created_at}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 