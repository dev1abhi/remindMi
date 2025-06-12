import { useState, useEffect } from 'react';
import { alarmService } from '../services/alarmService';
import type { Alarm } from '../types';

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedAlarms = await alarmService.getAlarms();
      setAlarms(fetchedAlarms);
    } catch (err) {
      console.error("Error fetching alarms:", err);
      setError("Failed to fetch alarms");
    } finally {
      setIsLoading(false);
    }
  };

  const addAlarm = async (alarm: Alarm) => {
    const notifications = alarm.notifications;
    const isAnyNotificationEnabled = notifications?.call || notifications?.sms || notifications?.email;

    if (!isAnyNotificationEnabled) {
      console.log("No notification methods are enabled, skipping API request.");
      return;
    }

    try {
      await alarmService.createAlarm(alarm);
      console.log("Alarm added successfully", alarm);
      await fetchAlarms(); // Refresh alarms after adding
    } catch (error) {
      console.error("Error adding alarm:", error);
      setError("Failed to add alarm");
      throw error;
    }
  };

  const deleteAlarm = async (id: string) => {
    try {
      await alarmService.deleteAlarm(id);
      setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm._id !== id));
    } catch (error) {
      console.error("Error deleting alarm:", error);
      setError("Failed to delete alarm");
      throw error;
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  return {
    alarms,
    isLoading,
    error,
    addAlarm,
    deleteAlarm,
    fetchAlarms
  };
}