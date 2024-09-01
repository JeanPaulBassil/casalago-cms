"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Notification {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  dispatchNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dispatchNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, dispatchNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
