import React, { useState, useCallback } from 'react';

export function useHash() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const calculateHash = useCallback(async (content: string | File) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      let hashBuffer: ArrayBuffer;
      
      if (typeof content === 'string') {
        // String content
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
      } else {
        // File content
        const arrayBuffer = await readFileAsArrayBuffer(content);
        hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      }
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
      setIsCalculating(false);
      return hashHex;
    } catch (err) {
      setError(err as Error);
      setIsCalculating(false);
      return null;
    }
  }, []);

  return {
    calculateHash,
    hash,
    isCalculating,
    error,
  };
}

// Helper function to read file as ArrayBuffer
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
} 