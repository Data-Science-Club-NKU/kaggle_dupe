"use client";

import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Tabs,
  Tab,
  Switch,
  Input,
  Textarea,
} from "@nextui-org/react";
import DataTab from "./tabs/data";
import LeaderboardTab from "./tabs/leaderboard";
import RulesTab from "./tabs/rules";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function CompetitionPage() {
  const [selectedTab, setSelectedTab] = useState<string>("data");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Initialize dark mode based on system preference
  useEffect(() => {
    // Check if user has a saved preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
    
    // Simulate auth check
    setTimeout(() => setIsLoggedIn(true), 1000);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save preference
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async () => {
    if (!teamName || !teamMembers || !selectedFile) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("teamName", teamName);
    formData.append("teamMembers", teamMembers);
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Submission successful!");
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed due to an error.");
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "data":
        return <DataTab />;
      case "leaderboard":
        return <LeaderboardTab />;
      case "rules":
        return <RulesTab />;
      default:
        return <DataTab />;
    }
  };

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 transition-all duration-300">
        {/* Simplified header - removed duplicate Join Competition button */}
        <Navbar 
          isBordered 
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50"
        >
          <NavbarBrand>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Mathematical Olympiad
              </h1>
            </div>
          </NavbarBrand>
          <NavbarContent justify="end" className="gap-4">
            <NavbarItem>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {isDarkMode ? "Dark" : "Light"}
                </span>
                <button
                  onClick={toggleDarkMode}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white dark:bg-indigo-400 transition-transform`} />
                </button>
              </div>
            </NavbarItem>
            <NavbarItem>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button 
                    color="primary" 
                    radius="md" 
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  >
                    Join Competition
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        {!isLoggedIn ? (
          <div className="flex flex-col justify-center items-center h-[80vh] px-4">
            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
              <svg className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Join the Competition</h2>
              <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
                Sign in to submit your solutions and compete in the AI Mathematical Olympiad.
              </p>
              <SignInButton mode="modal">
                <Button
                  color="primary"
                  radius="md"
                  variant="solid"
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In to Join
                </Button>
              </SignInButton>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mt-8 p-4 pb-16">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 sm:p-10 transition-all duration-300 border border-slate-100 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 p-1 text-indigo-600 dark:text-indigo-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    Progress Prize 2
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                    Solve national-level math challenges using AI models.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">7 days left</span>
                  </div>
                </div>
              </div>

              <Tabs
                aria-label="Competition Sections"
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(String(key))}
                className="mt-4"
                color="primary"
                variant="underlined"
              >
                <Tab key="data" title="Data" />
                <Tab key="leaderboard" title="Leaderboard" />
                <Tab key="rules" title="Rules" />
              </Tabs>

              <div className="mt-6 min-h-32">{renderTabContent()}</div>

                <SignedIn>
                <div className="mt-10 bg-indigo-50 dark:bg-slate-700/30 rounded-xl p-6 border border-indigo-100 dark:border-slate-600 shadow-sm">
  <div className="flex items-center gap-3 mb-5">
    <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg text-white">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Your Solution</h3>
  </div>
  
  <div className="space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  <div className="space-y-1">
    <Textarea
      label="Team Name"
      placeholder="Enter your team name"
      value={teamName}
      onChange={(e) => setTeamName(e.target.value)}
      variant="flat"
      radius="sm"
      labelPlacement="outside"
      minRows={2}
      maxRows={3}
      classNames={{
        label: "text-sm font-medium text-slate-700 dark:text-slate-300",
        input: "text-slate-900 dark:text-white",
        inputWrapper: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm"
      }}
      startContent={
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
    />
    <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">This will be displayed on the leaderboard</p>
  </div>
  <div className="space-y-1">
    <Textarea
      label="Team Members"
      placeholder="Enter team member names, separated by commas"
      value={teamMembers}
      onChange={(e) => setTeamMembers(e.target.value)}
      variant="flat"
      radius="sm"
      labelPlacement="outside"
      minRows={2}
      maxRows={3}
      classNames={{
        label: "text-sm font-medium text-slate-700 dark:text-slate-300",
        input: "text-slate-900 dark:text-white",
        inputWrapper: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm"
      }}
      startContent={
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      }
    />
    <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">Include all team members who contributed</p>
  </div>
</div>

    <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600 group">
      <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          {selectedFile ? (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-indigo-700 dark:text-indigo-300">{selectedFile.name}</span>
              <button 
                className="ml-2 p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Drag and drop your solution file
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  or <span className="text-indigo-600 dark:text-indigo-400 font-medium">click to browse</span> (ZIP, PDF, or TXT)
                </p>
              </div>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          accept=".csv"
        />
      </label>
    </div>

    <div className="flex justify-end items-center gap-4 pt-2">
      
      <Button
        color="primary"
        radius="md"
        variant="light"
        className="font-medium text-indigo-700 dark:text-indigo-300 bg-transparent"
      >
        Save Draft
      </Button>
      <Button
        color="primary"
        radius="md"
        variant="solid"
        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors shadow-md hover:shadow-lg px-6"
        onClick={handleSubmit}
        size="lg"
        endContent={
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        }
      >
        Submit Solution
      </Button>
    </div>
  </div>
</div>
                </SignedIn>
            </div>
          </div>
        )}
      </div>
    </ClerkProvider>
  );
}