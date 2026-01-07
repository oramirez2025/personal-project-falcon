import { useState, useEffect } from 'react';

/**
 * CountdownTimer component displays a countdown to August 14th
 * Shows "So it begins" message during the event period (Aug 14-16)
 */
export default function CountdownTimer() {
  // State to store the calculated time remaining (days, hours, minutes, seconds)
  const [timeRemaining, setTimeRemaining] = useState(null);
  // State to track if we're currently within the event period
  const [isEventTime, setIsEventTime] = useState(false);

  useEffect(() => {
    /**
     * Calculates the time remaining until August 14th
     * Handles different states: before event, during event, and after event
     */
    const calculateTimeRemaining = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Define event dates (month is 0-indexed, so 7 = August)
      const eventStart = new Date(currentYear, 7, 14); // August 14th
      const eventEnd = new Date(currentYear, 7, 16, 23, 59, 59); // August 16th end of day
      const resetDate = new Date(currentYear, 7, 17); // August 17th (day after event ends)

      // Check if we're currently within the event period
      if (now >= eventStart && now <= eventEnd) {
        setIsEventTime(true);
        setTimeRemaining(null);
        return;
      }

      setIsEventTime(false);

      // Determine target date: this year's Aug 14 or next year's Aug 14
      let targetDate;
      if (now >= resetDate) {
        // After Aug 16, countdown to next year's event
        targetDate = new Date(currentYear + 1, 7, 14);
      } else {
        // Before Aug 14, countdown to this year's event
        targetDate = new Date(currentYear, 7, 14);
      }

      // Calculate the time difference in milliseconds
      const difference = targetDate - now;

      // Convert milliseconds to days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Update state with calculated time
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate immediately on mount
    calculateTimeRemaining();
    // Update every second to keep countdown current
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // During event period: show event message
  if (isEventTime) {
    return (
      <div className="countdown-container" style={styles.container}>
        <h1 style={styles.eventMessage}>So it begins</h1>
      </div>
    );
  }

  // Before calculation completes: show loading state
  if (!timeRemaining) {
    return (
      <div className="countdown-container" style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  // Main countdown display: show days, hours, minutes, seconds
  return (
    <div className="countdown-container" style={styles.container}>
      <h2 style={styles.title}>Countdown to August 14th</h2>
      <div style={styles.timeDisplay}>
        <div style={styles.timeUnit}>
          <span style={styles.timeValue}>{timeRemaining.days}</span>
          <span style={styles.timeLabel}>Days</span>
        </div>
        <div style={styles.timeUnit}>
          <span style={styles.timeValue}>{timeRemaining.hours}</span>
          <span style={styles.timeLabel}>Hours</span>
        </div>
        <div style={styles.timeUnit}>
          <span style={styles.timeValue}>{timeRemaining.minutes}</span>
          <span style={styles.timeLabel}>Minutes</span>
        </div>
        <div style={styles.timeUnit}>
          <span style={styles.timeValue}>{timeRemaining.seconds}</span>
          <span style={styles.timeLabel}>Seconds</span>
        </div>
      </div>
    </div>
  );
}

// Inline styles for the countdown timer component
const styles = {
  // Main container: centers content with padding
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  // Countdown title styling
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  // Event message shown during Aug 14-16
  eventMessage: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#2d3748',
    animation: 'pulse 2s infinite',
  },
  // Wrapper for all time units (days, hours, minutes, seconds)
  timeDisplay: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  // Individual time unit container (holds value and label)
  timeUnit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '80px',
  },
  // Numeric value styling (e.g., "365")
  timeValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  // Label styling (e.g., "DAYS")
  timeLabel: {
    fontSize: '1rem',
    color: '#718096',
    textTransform: 'uppercase',
    marginTop: '0.5rem',
  },
};
