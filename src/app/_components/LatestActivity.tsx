'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  type: string;
  documentType: string;
  purpose?: string | null;
  status: string;
  createdAt: string;
  fullName: string;
}

export function LatestActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activity');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'request':
        return '📝';
      default:
        return '🔔';
    }
  };

  const getActivityText = (activity: Activity) => {
    if (activity.type === 'document') {
      return `Administrative document "${activity.documentType}" was uploaded`;
    } else {
      return `${activity.fullName} requested "${activity.documentType}"`;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "ml-2 px-2 py-1 text-xs rounded-full";
    switch (status) {
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-2/3 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-gray-600">
        <p>🕒 No activity yet.</p>
        <p>Once residents interact with the site, activity appears.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0"
        >
          <span className="text-xl">{getActivityIcon(activity.type)}</span>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {getActivityText(activity)}
              {getStatusBadge(activity.status)}
            </p>
            {activity.purpose && (
              <p className="text-xs text-gray-500 italic">{activity.purpose}</p>
            )}
            <p className="text-xs text-gray-400">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 