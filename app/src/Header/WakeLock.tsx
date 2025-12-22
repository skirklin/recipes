import { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { Button, Popover, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { Context } from '../context';
import { getAppUserFromState } from '../state';
import { setWakeLockSeen } from '../firestore';

const IconButton = styled(Button)<{ $active?: boolean; $highlight?: boolean }>`
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
  ${props => props.$highlight && `
    animation: pulse 2s ease-in-out infinite;
  `}

  &:hover {
    color: ${props => props.$active ? 'var(--color-text)' : 'white'};
    background-color: ${props => props.$active ? 'var(--color-warning)' : 'rgba(255, 255, 255, 0.15)'};
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(252, 186, 4, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(252, 186, 4, 0); }
  }
`

const PopoverContent = styled.div`
  max-width: 200px;
`

const PopoverTitle = styled.div`
  font-weight: 600;
  margin-bottom: var(--space-xs);
`

const PopoverText = styled.p`
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`

function WakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const { state } = useContext(Context);
  const user = getAppUserFromState(state);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  // Show popover for users who haven't seen this feature
  useEffect(() => {
    if (isSupported && user && !user.wakeLockSeen) {
      // Small delay so it doesn't appear immediately on page load
      const timer = setTimeout(() => setShowPopover(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, user]);

  const markAsSeen = useCallback(() => {
    if (user && !user.wakeLockSeen) {
      setWakeLockSeen(user.id);
    }
    setShowPopover(false);
  }, [user]);

  const requestWakeLock = useCallback(async () => {
    markAsSeen();
    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);

      lock.addEventListener('release', () => {
        setWakeLock(null);
      });
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
    }
  }, [markAsSeen]);

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
  const shouldHighlight = !user?.wakeLockSeen && !isActive;

  const popoverContent = (
    <PopoverContent>
      <PopoverTitle>Keep screen on</PopoverTitle>
      <PopoverText>
        Tap here to prevent your screen from dimming while you cook!
      </PopoverText>
      <Button size="small" type="primary" onClick={markAsSeen}>
        Got it
      </Button>
    </PopoverContent>
  );

  const button = (
    <IconButton
      $active={isActive}
      $highlight={shouldHighlight}
      icon={isActive ? <BulbFilled /> : <BulbOutlined />}
      onClick={isActive ? releaseWakeLock : requestWakeLock}
    />
  );

  if (showPopover) {
    return (
      <Popover
        content={popoverContent}
        open={showPopover}
        placement="bottomRight"
        onOpenChange={(open) => !open && markAsSeen()}
      >
        {button}
      </Popover>
    );
  }

  return (
    <Tooltip title={isActive ? "Screen will stay on" : "Keep screen on"}>
      {button}
    </Tooltip>
  );
}

export default WakeLock;
