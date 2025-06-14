import axios from 'axios';
import type { Alarm } from '../types';

const API_BASE_URL = 'https://remind-mi-backend.vercel.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`
  };
};

export const alarmService = {
  async getAlarms(): Promise<Alarm[]> {
    const response = await axios.get(`${API_BASE_URL}/alarms/getalarms`, {
      headers: getAuthHeaders()
    });

    return response.data.alarms.map((alarm: Alarm) => ({
      _id: alarm._id,
      title: alarm.title,
      datetime: alarm.datetime,
      notifications: alarm.notifications,
      contactInfo: alarm.contactInfo
    }));
  },

  async createAlarm(alarm: Alarm): Promise<void> {
    
    //saving in UTC format
    const utcDateTime = new Date(alarm.datetime).toISOString();
    await axios.post(
      `${API_BASE_URL}/alarms/createCallAlarm`,
      {
        title: alarm.title,
        datetime: utcDateTime,
        notifications: alarm.notifications,
        contactInfo: alarm.contactInfo,
      },
      {
        headers: getAuthHeaders(),
      }
    );
  },

  async deleteAlarm(id: string): Promise<void> {
    const response = await axios.delete(`${API_BASE_URL}/alarms/delete/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log(response.data.message);
  }
};