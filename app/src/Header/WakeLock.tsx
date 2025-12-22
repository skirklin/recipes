import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const IconButton = styled(Button)<{ $active?: boolean }>`
  background-color: ${props => props.$active ? 'var(--color-warning)' : 'transparent'};
  color: ${props => props.$active ? 'var(--color-text)' : 'white'};
  border: none;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.$active ? 'var(--color-text)' : 'white'};
    background-color: ${props => props.$active ? 'var(--color-warning)' : 'rgba(255, 255, 255, 0.15)'};
  }
`

function WakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);

      lock.addEventListener('release', () => {
        setWakeLock(null);
      });
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock, requestWakeLock]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  if (!isSupported) {
    return null;
  }

  const isActive = wakeLock !== null;

  return (
    <Tooltip title={isActive ? "Screen will stay on" : "Keep screen on"}>
      <IconButton
        $active={isActive}
        icon={isActive ? <BulbFilled /> : <BulbOutlined />}
        onClick={isActive ? releaseWakeLock : requestWakeLock}
      />
    </Tooltip>
  );
}

export default WakeLock;
