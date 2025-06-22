'use client';

import { useEffect } from 'react';
import { iPhoneDebug } from '../utils/iPhoneDebug';

export const IPhoneDebugComponent = () => {
  useEffect(() => {
    // Run comprehensive checks
    const env = iPhoneDebug.checkEnvironment();
    
    if (env.isIOS) {
      iPhoneDebug.log('iPhone/iOS detected - running compatibility checks');
      
      // Test localStorage
      try {
        const testKey = 'ios_test_' + Date.now();
        localStorage.setItem(testKey, 'test_value');
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (retrieved === 'test_value') {
          iPhoneDebug.log('localStorage test: PASSED');
        } else {
          iPhoneDebug.log('localStorage test: FAILED - value mismatch');
        }
      } catch (error) {
        iPhoneDebug.log('localStorage test: FAILED - exception', error);
      }
      
      // Test sessionStorage
      try {
        const testKey = 'ios_session_test_' + Date.now();
        sessionStorage.setItem(testKey, 'test_value');
        const retrieved = sessionStorage.getItem(testKey);
        sessionStorage.removeItem(testKey);
        
        if (retrieved === 'test_value') {
          iPhoneDebug.log('sessionStorage test: PASSED');
        } else {
          iPhoneDebug.log('sessionStorage test: FAILED - value mismatch');
        }
      } catch (error) {
        iPhoneDebug.log('sessionStorage test: FAILED - exception', error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default IPhoneDebugComponent;
