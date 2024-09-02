import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { db, auth } from './firebase'; // Adjust the path if necessary
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const icons = {
  name: (
    <svg
      className="w-5 h-5 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.121 17.804A4.5 4.5 0 015 13.5V9a7 7 0 0114 0v4.5a4.5 4.5 0 01-.121 4.304M9 17.5v4m6-4v4m-3-4v4"
      />
    </svg>
  ),
  weight: (
    <svg
      className="w-5 h-5 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4.75V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v.75m6 0V4a2 2 0 012-2h2a2 2 0 012 2v.75M9.5 10.5h.01M14.5 10.5h.01M8 18.5a6 6 0 108 0"
      />
    </svg>
  ),
  age: (
    <svg
      className="w-5 h-5 text-purple-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 11.25V4a4 4 0 118 0v7.25M5 20h14a1 1 0 001-1v-5a1 1 0 00-1-1H5a1 1 0 00-1 1v5a1 1 0 001 1z"
      />
    </svg>
  ),
  gender: (
    <svg
      className="w-5 h-5 text-pink-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zM12 14c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4z"
      />
    </svg>
  ),
  allergy: (
    <svg
      className="w-5 h-5 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 14.5c-3.866 0-7-1.343-7-3V8.5c0-1.657 3.134-3 7-3s7 1.343 7 3v3c0 1.657-3.134 3-7 3zm0 2c4.418 0 8 1.343 8 3v3H4v-3c0-1.657-3.582-3-8-3z"
      />
    </svg>
  ),
  lifestyle: (
    <svg
      className="w-5 h-5 text-yellow-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 12h-4v8H8v-8H4m6-8l4-4 4 4M4 12h16M4 22h16"
      />
    </svg>
  ),
  height: (
    <svg
      className="w-5 h-5 text-indigo-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18V6h12v12M9 9h6M9 15h6"
      />
    </svg>
  ),
  discharged: (
    <svg
      className="w-5 h-5 text-teal-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
};

const Modal = ({ isOpen, onClose, userData }) => {
  const [bpData, setBpData] = useState([]);

  const [reportMessage, setReportMessage] = useState('');


  const handleButtonClick = () => {
    
    setReportMessage('Your blood report indicates problems in the kidney.');
    console.log("Personalised Diagnostic button clicked");
  };

  useEffect(() => {
    const fetchBPData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const email = user.email;
          const q = query(
            collection(db, 'bloodPressure', email, 'records'),
            orderBy('timestamp', 'asc')
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => doc.data());
          setBpData(data);
        }
      } catch (error) {
        console.error('Failed to fetch BP data', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, fetchBPData);
    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const chartData = {
    labels: bpData.map(record => new Date(record.timestamp.toDate()).toLocaleDateString()),
    datasets: [
      {
        label: 'Systolic',
        data: bpData.map(record => record.systolic),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Diastolic',
        data: bpData.map(record => record.diastolic),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Blood Pressure (mmHg)',
        },
      },
    },
  };


  const fetchAndSendReport = async () => {
    try {
      if (userData && userData.email) {
        const email = userData.email;

        // Fetch data from users collection (filter by email if needed)
        const userSnapshot = await getDocs(
          query(collection(db, 'users'), where('email', '==', email))
        );
        const users = userSnapshot.docs.map(doc => doc.data());

        // Fetch data from bloodReports collection for the specific user
        const bloodReportsSnapshot = await getDocs(
          query(collection(db, 'bloodReports'), where('email', '==', email))
        );
        const bloodReports = bloodReportsSnapshot.docs.map(doc => doc.data());

        // Fetch data from bloodPressure collection for the specific user
        const bpSnapshot = await getDocs(
          collection(db, 'bloodPressure', email, 'records')
        );
        const bloodPressure = bpSnapshot.docs.map(doc => doc.data());

        // Fetch data from UrineReport collection for the specific user
        const urineReportSnapshot = await getDocs(
          query(collection(db, 'UrineReport'), where('email', '==', email))
        );
        const urineReports = urineReportSnapshot.docs.map(doc => doc.data());

        // Prepare the data to be sent in JSON format
        const reportData = {
          users,
          bloodReports,
          bloodPressure,
          urineReports
        };

        // Convert the data to a JSON string
        const jsonData = JSON.stringify(reportData);
        console.log( jsonData);

        // Define the server endpoint URL
        const serverUrl = ' http://127.0.0.1:5000'; // Replace with your server URL

        // Send the POST request
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonData,
        });

        // Check for successful response
        if (response.ok) {
          console.log('Report sent successfully');
        } else {
          console.error('Failed to send report:', response.statusText);
        }
      } else {
        console.error('User data is not available or missing email.');
      }
    } catch (error) {
      console.error('Failed to fetch and send report', error);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-blue-100 to-white p-8 rounded-2xl shadow-lg w-11/12 max-w-lg relative">
        <button
          className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Patient Details</h2>
        <div className="text-gray-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Displaying user data */}
            <div className="flex items-center space-x-3">
              {icons.name}
              <div>
                <p className="font-semibold">First Name:</p>
                <p className="text-sm text-gray-700">{userData.FirstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.name}
              <div>
                <p className="font-semibold">Last Name:</p>
                <p className="text-sm text-gray-700">{userData.LastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.weight}
              <div>
                <p className="font-semibold">Weight:</p>
                <p className="text-sm text-gray-700">{userData.Weight} kg</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.age}
              <div>
                <p className="font-semibold">Age:</p>
                <p className="text-sm text-gray-700">{userData.Age} years</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.gender}
              <div>
                <p className="font-semibold">Gender:</p>
                <p className="text-sm text-gray-700">{userData.Gender}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.allergy}
              <div>
                <p className="font-semibold">Allergy:</p>
                <p className="text-sm text-gray-700">{userData.Allergy}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.lifestyle}
              <div>
                <p className="font-semibold">Lifestyle:</p>
                <p className="text-sm text-gray-700">{userData.Lifestyle}</p>
              </div>
            </div>
          </div>
        </div>
        {/* BP Chart */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Blood Pressure Chart</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        {/* New Personalised Diagnostic Button */}
        <div className="flex justify-start mt-6">
          {/* <button
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:from-purple-600 hover:to-purple-800 transition duration-300"
            onClick={() => {
              // Implement personalized diagnostic action here
              console.log("Personalised Diagnostic button clicked");
            }}
          >
            Personalised Diagnostic
          </button> */}
          <div className=' px-10'></div>
          <div className="report-container">
      {/* Step 3: Button to trigger the action */}
      <button
        className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:from-purple-600 hover:to-purple-800 transition duration-300"
        onClick={handleButtonClick}
      >
        Send Report
      </button>

      {/* Step 4: Conditionally render the report message */}
      {reportMessage && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {reportMessage}
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;