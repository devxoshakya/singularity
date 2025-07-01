"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import OnboardingDialog from "@/components/onboarding-dialog"
import TermsDialog from "@/components/terms-dialog"
import AccessDenied from "@/components/access-denied"

interface AppWrapperProps {
  children: React.ReactNode
}

type AppState = 'loading' | 'onboarding' | 'terms' | 'access-denied' | 'ready'

export default function AppWrapper({ children }: AppWrapperProps) {
  const [appState, setAppState] = useState<AppState>('loading')

  // Check user preferences from IndexedDB
  useEffect(() => {
    const checkUserPreferences = async () => {
      try {
        const request = indexedDB.open('miet_app_preferences', 1)
        
        request.onupgradeneeded = () => {
          const db = request.result
          if (!db.objectStoreNames.contains('user_preferences')) {
            db.createObjectStore('user_preferences', { keyPath: 'id' })
          }
        }
        
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction(['user_preferences'], 'readonly')
          const store = transaction.objectStore('user_preferences')
          
          // Check onboarding status
          const onboardingRequest = store.get('onboarding_completed')
          onboardingRequest.onsuccess = () => {
            const onboardingCompleted = onboardingRequest.result?.value || false
            
            // Check terms acceptance status
            const termsRequest = store.get('terms_accepted')
            termsRequest.onsuccess = () => {
              const termsAccepted = termsRequest.result?.value || false
              
              if (!onboardingCompleted) {
                setAppState('onboarding')
              } else if (!termsAccepted) {
                setAppState('terms')
              } else {
                setAppState('ready')
              }
            }
          }
        }
        
        request.onerror = () => {
          // If IndexedDB fails, start from onboarding
          setAppState('onboarding')
        }
      } catch (error) {
        console.error('Error checking user preferences:', error)
        setAppState('onboarding')
      }
    }

    checkUserPreferences()
  }, [])

  const handleOnboardingComplete = () => {
    setAppState('terms')
  }

  const handleTermsAccept = () => {
    setAppState('ready')
  }

  const handleTermsReject = () => {
    setAppState('access-denied')
  }

  const handleRetryTerms = () => {
    setAppState('terms')
  }

  // Show loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-black" />
      </div>
    )
  }

  // Show access denied page
  if (appState === 'access-denied') {
    return <AccessDenied onRetry={handleRetryTerms} />
  }

  // Show main content when ready
  return (
    <>
      {children}
      
      <OnboardingDialog 
        isOpen={appState === 'onboarding'}
        onComplete={handleOnboardingComplete}
      />
      
      <TermsDialog
        isOpen={appState === 'terms'}
        onAccept={handleTermsAccept}
        onReject={handleTermsReject}
      />
    </>
  )
}
