import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, Plus, Trash2, Calendar, Clock, Lock, User } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import type { Alarm } from './types';
import { jwtDecode } from 'jwt-decode';


function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/users/login", { email, password });
      localStorage.setItem("token", response.data.token); // Store token for session management
      onLogin();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-1 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="w-full max-w-md p-8 border border-purple-500/20 rounded-lg relative bg-gray-900/50 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          remindMi
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function MainApp() {
 
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Function to fetch alarms from backend
  const fetchAlarms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Don't fetch if no user is logged in

     // Make API request to fetch alarms
    try {
      const response = await axios.get("http://localhost:5000/alarms/getalarms", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedAlarms = response.data.alarms.map((alarm: Alarm) => ({
        id: alarm.id,
        title: alarm.title,
        datetime: alarm.datetime,
        notifications: alarm.notifications,
        contactInfo: alarm.contactInfo
      }));

      setAlarms(formattedAlarms);
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  // Fetch alarms when component mounts
  useEffect(() => {
    fetchAlarms();
  }, []);

  // Function to add an alarm
  const addAlarm = async (alarm: Alarm) => {
    if (!alarm.notifications?.call) {
      console.log("Call notification is not enabled, skipping API request.");
      return;
    }

    console.log(localStorage.getItem("token"));

    // Make API request to add alarm
    try {
      await axios.post("http://localhost:5000/alarms/createCallAlarm", {
        title: alarm.title,
        datetime: alarm.datetime,
        notifications: alarm.notifications,
        contactInfo: alarm.contactInfo,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Alarm added successfully", alarm);
      await fetchAlarms(); // Refresh alarms after adding
      setShowForm(false);
    } catch (error) {
      console.error("Error adding alarm:", error);
    }
  };

  //to-do:backend implementation
  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };


// MainApp component
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-1 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="min-h-[calc(100vh-8px)] border border-purple-500/20 rounded-lg relative bg-gray-900/50 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
              remindMi
            </h1>
            <p className="text-gray-400">Stay connected with multi-channel notifications</p>
          </header>

          <div className="max-w-4xl mx-auto">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-purple-500/30 rounded-xl p-4 flex items-center justify-center gap-2 text-purple-400 hover:bg-gray-800/70 transition-all duration-300 mb-8 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">Add New Alarm</span>
              </button>
            )}

            {showForm && (
              <AlarmForm onSubmit={addAlarm} onCancel={() => setShowForm(false)} />
            )}

            <div className="space-y-4">
              {alarms.map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} onDelete={deleteAlarm} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlarmForm({ onSubmit, onCancel }: { onSubmit: (alarm: Alarm) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Alarm>>({
    notifications: {
      email: false,
      whatsapp: false,
      sms: false,
      call: false
    },
    contactInfo: {
      email: '',
      phone: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now().toString(),
      title: formData.title || '',
      datetime: formData.datetime || '',
      notifications: formData.notifications!,
      contactInfo: formData.contactInfo!
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-purple-500/20">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            value={formData.title || ''}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            required
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            value={formData.datetime || ''}
            onChange={e => setFormData({ ...formData, datetime: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notification Methods</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(formData.notifications!).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 bg-gray-900/30 p-3 rounded-lg cursor-pointer hover:bg-gray-900/50 transition-colors">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e => setFormData({
                    ...formData,
                    notifications: {
                      ...formData.notifications!,
                      [key]: e.target.checked
                    }
                  })}
                  className="rounded text-purple-500 focus:ring-purple-500 bg-gray-700 border-gray-600"
                />
                <span className="capitalize text-gray-300">{key}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            value={formData.contactInfo?.email || ''}
            onChange={e => setFormData({
              ...formData,
              contactInfo: { ...formData.contactInfo!, email: e.target.value }
            })}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            value={formData.contactInfo?.phone || ''}
            onChange={e => setFormData({
              ...formData,
              contactInfo: { ...formData.contactInfo!, phone: e.target.value }
            })}
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Create Alarm
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AlarmCard({ alarm, onDelete }: { alarm: Alarm, onDelete: (id: string) => void }) {
  const notificationIcons = {
    email: <Mail size={16} />,
    whatsapp: <MessageSquare size={16} />,
    sms: <MessageSquare size={16} />,
    call: <Phone size={16} />
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{alarm.title}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar size={14} />
            <span>{format(new Date(alarm.datetime), "MMM d, yyyy")}</span>
            <Clock size={14} className="ml-2" />
            <span>{format(new Date(alarm.datetime), "h:mm a")}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(alarm.id)}
          className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(alarm.notifications).map(([method, enabled]) => 
            enabled && (
              <span key={method} className="inline-flex items-center gap-1 text-sm text-purple-300 bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                {notificationIcons[method as keyof typeof notificationIcons]}
                <span className="capitalize">{method}</span>
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-gray-400 flex items-center gap-2">
          <Mail size={14} className="text-gray-500" />
          {alarm.contactInfo.email}
        </p>
        <p className="text-gray-400 flex items-center gap-2">
          <Phone size={14} className="text-gray-500" />
          {alarm.contactInfo.phone}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: unknown = jwtDecode(token);
        const isTokenValid = (decoded as { exp: number }).exp * 1000 > Date.now();

        if (!isTokenValid) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    //passing the handleLogin function to the Login component
    return <Login onLogin={handleLogin} />;
  }

  return <MainApp />;
}

export default App;