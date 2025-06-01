'use client';
import { Book, GraduationCap, Key, Menu } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import APIComponent from '@/features/dashboard/API';
import DocsPage from '@/features/dashboard/Docs';

// Dummy content components
const ResultsContent = () => <div className="p-4">MIET RESULTS display goes here.</div>;

export default function Component() {
  const [activeTab, setActiveTab] = React.useState('docs');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const tabs = [
    { id: 'docs', label: 'Docs', icon: Book, content: <DocsPage /> },
    { id: 'api', label: 'API Keys', icon: Key, content: <APIComponent /> },
    {
      id: 'results',
      label: 'MIET RESULTS',
      icon: GraduationCap,
      content: <ResultsContent />,
      onClick: () => window.open('https://miet-results.devxoshakya.xyz', '_blank'),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'block' : 'hidden'} w-full
        shrink-0 border-r border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700
        dark:bg-neutral-800 md:block md:w-64
      `}
      >
        <nav className="space-y-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`
                w-full justify-start text-neutral-700 transition-colors
                duration-200 dark:text-neutral-300
                ${activeTab === tab.id
              ? 'bg-neutral-300 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-100'
              : 'hover:bg-neutral-400 dark:hover:bg-neutral-600'}
              `}
              onClick={() => {
                if (tab.onClick) {
                  tab.onClick();
                } else {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }
              }}
            >
              <tab.icon className="mr-2 size-4" />
              {tab.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="grow bg-white p-6 dark:bg-neutral-900">
        <Button
          variant="outline"
          className="mb-4 text-neutral-700 transition-colors duration-200
                     hover:bg-neutral-200 dark:text-neutral-300
                     dark:hover:bg-neutral-700 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="mr-2 size-4" />
          Menu
        </Button>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </main>
    </div>
  );
}
