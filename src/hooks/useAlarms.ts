import { useState, useEffect } from 'react';
import { alarmService } from '../services/alarmService';
import { handleApiError } from '../utils/errorHandler';
import { useAuth } from './useAuth';
import type { Alarm } from '../types';
import toast from 'react-hot-toast';

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleSessionExpired } = useAuth();

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
      handleApiError(err, handleSessionExpired);
      setError("Failed to fetch alarms");
    } finally {
      setIsLoading(false);
    }
  };

  const addAlarm = async (alarm: Alarm) => {
    const notifications = alarm.notifications;
    const isAnyNotificationEnabled = notifications?.call || notifications?.sms || notifications?.email;

    if (!isAnyNotificationEnabled) {
      toast.error("Please select at least one notification method");
      return;
    }

    try {
      await alarmService.createAlarm(alarm);
      toast.success("Alarm created successfully!");
      await fetchAlarms(); // Refresh alarms after adding
    } catch (error) {
      console.error("Error adding alarm:", error);
      handleApiError(error, handleSessionExpired);
      throw error;
    }
  };

  const deleteAlarm = async (id: string) => {
    try {
      await alarmService.deleteAlarm(id);
      setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm._id !== id));
      toast.success("Alarm deleted successfully!");
    } catch (error) {
      console.error("Error deleting alarm:", error);
      handleApiError(error, handleSessionExpired);
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