
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserData } from '../types';
import { AlertCircle, AlertTriangle, Siren, UserCircle, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          toast.error('User data not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  // Function to play alert sound and flash the screen
  const triggerAlert = async (alertType: 'ALERT' | 'DANGER' | 'EMERGENCY') => {
    // Play alert sound
    const audio = new Audio('src/components/sounds/alert.mp3'); // Replace with the path to your alert sound file
    audio.play();

    // Attempt to activate the flashlight
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];

      if ('ImageCapture' in window) {
        const imageCapture = new (window as any).ImageCapture(track); // Workaround if ImageCapture is not typed
        const photoCapabilities = await imageCapture.getPhotoCapabilities();

        if (photoCapabilities && 'torch' in photoCapabilities) {
          // Torch functionality
          const constraints: MediaTrackConstraints = {
            advanced: [{ torch: true }]
          };

          await track.applyConstraints(constraints);

          // Flash for a few seconds
          setTimeout(() => {
            track.stop();
          }, 5000);
        }
      } else {
        toast.error('Torch is not supported on this device');
      }
    } catch (err) {
      console.error('Error enabling flashlight:', err);
      toast.error('Failed to activate flashlight');
    }

    toast.success(`${alertType} alert triggered`);
  };

  // Render loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Emergency SOS</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Profile"
            >
              <UserCircle className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Alert Buttons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <AlertButton
            type="ALERT"
            color="yellow"
            icon={<AlertCircle className="h-16 w-16 text-yellow-600 mb-4" />}
            description="Low-priority alert"
            onClick={() => triggerAlert('ALERT')}
          />
          <AlertButton
            type="DANGER"
            color="orange"
            icon={<AlertTriangle className="h-16 w-16 text-orange-600 mb-4" />}
            description="Medium-priority alert"
            onClick={() => triggerAlert('DANGER')}
          />
          <AlertButton
            type="EMERGENCY"
            color="red"
            icon={<Siren className="h-16 w-16 text-red-600 mb-4" />}
            description="High-priority alert"
            onClick={() => triggerAlert('EMERGENCY')}
          />
        </div>

        {/* User Information Section */}
        {userData && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserInfo label="Name" value={userData.name} />
              <UserInfo label="Blood Group" value={userData.bloodGroup} />
              <UserInfo
                label="Emergency Contact"
                value={`${userData.fatherName} (${userData.fatherMobile})`}
              />
              <UserInfo
                label="Secondary Contact"
                value={`${userData.friendName} (${userData.friendMobile})`}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Reusable components for better readability
interface AlertButtonProps {
  type: 'ALERT' | 'DANGER' | 'EMERGENCY';
  color: 'yellow' | 'orange' | 'red';
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

const AlertButton = ({ type, color, icon, description, onClick }: AlertButtonProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-8 bg-${color}-100 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 transform`}
  >
    {icon}
    <span className={`text-xl font-medium text-${color}-800`}>{type}</span>
    <p className={`mt-2 text-sm text-${color}-600`}>{description}</p>
  </button>
);

const UserInfo = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default HomePage;
