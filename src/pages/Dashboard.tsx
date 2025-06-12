import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { AddAlarmButton } from '../components/ui/AddAlarmButton';
import { AlarmForm } from '../components/alarms/AlarmForm';
import { AlarmList } from '../components/alarms/AlarmList';
import { useAlarms } from '../hooks/useAlarms';

export function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const { alarms, addAlarm, deleteAlarm } = useAlarms();

  const handleAddAlarm = async (alarm: any) => {
    try {
      await addAlarm(alarm);
      setShowForm(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Layout>
      <Header />
      <div className="max-w-4xl mx-auto">
        {!showForm && (
          <AddAlarmButton onClick={() => setShowForm(true)} />
        )}

        {showForm && (
          <AlarmForm 
            onSubmit={handleAddAlarm} 
            onCancel={() => setShowForm(false)} 
          />
        )}

        <AlarmList alarms={alarms} onDelete={deleteAlarm} />
      </div>
    </Layout>
  );
}