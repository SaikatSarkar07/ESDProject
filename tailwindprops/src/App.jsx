import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = '045150f7-6f53-4775-a689-008875cea3a1'; 
  const mask = 'https://blinkit.com/prn/hicks-5-in-1-filteration-n95-mask-white/prid/573201';

  const fetchAQI = async () => {
    if (!city || !state || !country) {
      setError('Please enter all fields');
      return;
    }
    setError(null);
    const apiUrl = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === 'success' && data.data?.current?.pollution?.aqius !== undefined) {
        const aqi = data.data.current.pollution.aqius;
        let airQualityCategory = "";
        let healthImplication = "";
        let bgColor = "bg-gray-100";
        let backgroundImage = "Backgroundimage.jpg";

        if (aqi <= 50) {
          airQualityCategory = "Good";
          healthImplication = "Air quality is considered satisfactory, and air pollution poses little or no risk.";
          bgColor = "bg-green-400";
          backgroundImage = "image1.jpg";
        } else if (aqi <= 100) {
          airQualityCategory = "Moderate";
          healthImplication = "Air quality is acceptable; however, some pollutants may pose a moderate health concern for sensitive individuals.";
          bgColor = "bg-green-800";
          backgroundImage = "image2.jpg";
        } else if (aqi <= 150) {
          airQualityCategory = "Unhealthy for Sensitive Groups";
          healthImplication = "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
          bgColor = "bg-yellow-400";
          backgroundImage = "image3.jpg";
        } else if (aqi <= 200) {
          airQualityCategory = "Unhealthy";
          healthImplication = "Everyone may begin to experience health effects; sensitive groups may experience more serious effects.";
          bgColor = "bg-orange-500";
          backgroundImage = "image4.jpg";
        } else if (aqi <= 300) {
          airQualityCategory = "Very Unhealthy";
          healthImplication = "Health alert: everyone may experience serious health effects.";
          bgColor = "bg-red-600";
          backgroundImage = "image5.jpg";
        } else {
          airQualityCategory = "Hazardous Air Quality"
          healthImplication = "⚠️Alert: Area has become Unsafe for breathing. Please wear your gas masks and move out from this place."
          bgColor = "bg-violet-400"
          backgroundImage = "image6.jpg"
        }

        setAqiData({ aqi, airQualityCategory, healthImplication, bgColor, backgroundImage });
      } else {
        setError(`API Error: ${data.message || "Unexpected response format"}`);
      }
    } catch (err) {
      setError(`Error fetching AQI data: ${err.message}`);
    }
  };

  return (
    <div className="p-0 min-h-screen w-full" style={{
      backgroundImage: "url(/assets/Backgroundimage.jpg)",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <h1 className='bg-gray-300 text-black p-9 rounded-xl text-center text-2xl font-bold'>🌍 Welcome to the Air Quality Checker! 🌿<br />Breathe easy – enter your location and stay informed about your air quality.</h1>
      <div className='mt-4 flex justify-center items-center space-x-4'>
        <input className='border p-2' type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <input className='border p-2' type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <input className='border p-2' type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <button className='bg-blue-500 text-white p-2 rounded' onClick={fetchAQI}>Check AQI</button>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
      {aqiData && (
         <div className={`mt-4 p-5 rounded ${aqiData.bgColor} max-w-xl w-full mx-auto text-center shadow-lg`}>
         <h2 className="text-xl font-bold">Current AQI in {city}: {aqiData.aqi}</h2>
         <p className="mt-2"><strong>Air Quality Category:</strong> {aqiData.airQualityCategory}</p>
         <p className="mt-2"><strong>Health Implications:</strong> {aqiData.healthImplication}</p>
         <button className='bg-blue-600 text-white px-6 py-3 mt-4 rounded-lg' onClick={() => window.open(mask, '_blank')}>
           Get Mask
         </button>
       </div>
      )}
      {aqiData && (
        <div className="mt-4 flex justify-center">
          <img src={`/assets/${aqiData.backgroundImage}`} alt="AQI Condition" className="rounded-lg w-full max-w-3xl shadow-lg" />
        </div>
      )}
    </div>
  );
}

export default App;
