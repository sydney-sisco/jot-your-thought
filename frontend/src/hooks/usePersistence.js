import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const generateDeviceId = () => {
  return 'device-' + uuidv4();
};

const getOrGenerateDeviceId = () => {
  const existingDeviceId = localStorage.getItem('deviceId');
  if (existingDeviceId) {
    return existingDeviceId;
  } else {
    const newDeviceId = generateDeviceId();
    localStorage.setItem('deviceId', newDeviceId);
    return newDeviceId;
  }
};

export const usePersistence = () => {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    setDeviceId(getOrGenerateDeviceId());
  }, []);

  return { deviceId };
};
