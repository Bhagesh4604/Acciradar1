import { useState, useEffect, useRef } from 'react';
import { SensorData } from '../types';

const ACCELERATION_THRESHOLD = 15; // m/s^2

const useSensors = () => {
  const [accelerometerData, setAccelerometerData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [gyroscopeData, setGyroscopeData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [accidentDetected, setAccidentDetected] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [sensorError, setSensorError] = useState<string | null>(null);
  
  const accelerometer = useRef<any>(null);
  const gyroscope = useRef<any>(null);

  const requestPermissions = async () => {
    // Fix: Cast DeviceMotionEvent to any to access the non-standard requestPermission method on iOS.
    if (typeof(DeviceMotionEvent) !== 'undefined' && typeof((DeviceMotionEvent as any).requestPermission) === 'function') {
        try {
            const permission = await (DeviceMotionEvent as any).requestPermission();
            if (permission === 'granted') {
                setPermissionState('granted');
            } else {
                setPermissionState('denied');
            }
        } catch(e) {
            console.error(e);
            setPermissionState('denied');
        }
    } else {
        setPermissionState('granted');
    }
  };

  // Effect to initialize and manage real sensors
  useEffect(() => {
    if (permissionState !== 'granted' || sensorError) return;

    const sensorAPIsExist = 'Accelerometer' in window && 'Gyroscope' in window;
    if (!sensorAPIsExist) {
      setSensorError('Sensor APIs not supported. Displaying simulated data.');
      return;
    }

    const handleError = (event: any) => {
      console.error(`${event.target.constructor.name} error:`, event.error.name, event.error.message);
      if (event.error.name === 'NotReadableError') {
        setSensorError('Could not connect to device sensors. Displaying simulated data.');
      }
    };

    try {
      // @ts-ignore
      accelerometer.current = new Accelerometer({ frequency: 10 });
      accelerometer.current.addEventListener('reading', () => setAccelerometerData({ x: accelerometer.current.x, y: accelerometer.current.y, z: accelerometer.current.z }));
      accelerometer.current.addEventListener('error', handleError);

      // @ts-ignore
      gyroscope.current = new Gyroscope({ frequency: 10 });
      gyroscope.current.addEventListener('reading', () => setGyroscopeData({ x: gyroscope.current.x, y: gyroscope.current.y, z: gyroscope.current.z }));
      gyroscope.current.addEventListener('error', handleError);
    } catch (error) {
       console.warn("Error initializing sensors. Falling back to simulated data.", error);
       setSensorError('Error initializing sensors. Displaying simulated data.');
    }

    return () => {
      try {
        if (accelerometer.current) accelerometer.current.stop();
        if (gyroscope.current) gyroscope.current.stop();
      } catch (e) {
        // Ignore errors on stop
      }
    };
  }, [permissionState, sensorError]);

  // Effect to start/stop sensors based on monitoring state
  useEffect(() => {
    if (sensorError) return;

    if (isMonitoring) {
      try {
        accelerometer.current?.start();
        gyroscope.current?.start();
      } catch (error) {
        console.error("Error starting sensors:", error);
        setSensorError('Failed to start sensors. Displaying simulated data.');
      }
    } else {
      try {
        accelerometer.current?.stop();
        gyroscope.current?.stop();
      } catch (e) {
        // Ignore errors on stop
      }
    }
  }, [isMonitoring, sensorError]);

  // Effect for data simulation as a fallback
  useEffect(() => {
    if (!sensorError || !isMonitoring) return;
    
    const intervalId = setInterval(() => {
        setAccelerometerData({
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: 9.8 + (Math.random() * 2 - 1),
        });
        setGyroscopeData({
            x: Math.random() * 0.5 - 0.25,
            y: Math.random() * 0.5 - 0.25,
            z: Math.random() * 0.5 - 0.25,
        });
    }, 500);
    return () => clearInterval(intervalId);
  }, [sensorError, isMonitoring]);

  // Accident detection logic
  useEffect(() => {
    if (accidentDetected || !isMonitoring) return;

    const totalAcceleration = Math.sqrt(
      accelerometerData.x ** 2 + accelerometerData.y ** 2 + accelerometerData.z ** 2
    );

    if (totalAcceleration > ACCELERATION_THRESHOLD) {
      console.log('Accident detected! Acceleration:', totalAcceleration);
      setAccidentDetected(true);
    }
  }, [accelerometerData, accidentDetected, isMonitoring]);

  const resetAccident = () => setAccidentDetected(false);
  const toggleMonitoring = () => setIsMonitoring(prev => !prev);

  return { accelerometerData, gyroscopeData, isMonitoring, accidentDetected, permissionState, requestPermissions, resetAccident, toggleMonitoring, sensorError };
};

export default useSensors;