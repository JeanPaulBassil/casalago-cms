'use client'

import React, { createContext, useContext } from 'react';

interface SidebarContextType {
  onToggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ onToggle: () => void; children: React.ReactNode }> = ({ onToggle, children }) => (
  <SidebarContext.Provider value={{ onToggle }}>{children}</SidebarContext.Provider>
);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};
