import { useState, useEffect } from 'react';

export function useSecretCode(secretCode: string) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let input = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      input += e.key;
      if (input.length > secretCode.length) {
        input = input.slice(input.length - secretCode.length);
      }
      if (input.toLowerCase() === secretCode.toLowerCase()) {
        setSuccess(true);
        input = ''; // reset
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretCode]);

  return { success, reset: () => setSuccess(false) };
}
