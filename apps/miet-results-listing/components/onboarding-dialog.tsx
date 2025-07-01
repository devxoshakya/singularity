"use client"

import { useState, useEffect } from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OnboardingDialogProps {
  isOpen: boolean
  onComplete: () => void
}

export default function OnboardingDialog({ isOpen, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(1)

  const stepContent = [
  {
    title: "Welcome to MIET Results Listing",
    description:
      "Built under the Singularity Project by Dev Shakya and Akshita Srivastava — this platform is your gateway to transparent and lightning-fast access to MIET academic records.",
  },
  {
    title: "Full Academic Transparency",
    description:
      "View subject-wise marks, SGPA, backlogs, internal marks, and more — for yourself and others. Spot inconsistencies, claim unfair grading, or just satisfy your curiosity.",
  },
  {
    title: "Verified History, Placement Ready",
    description:
      "Recruiters and placement cells can verify student academic background instantly. From carry overs to comebacks — the full journey is visible.",
  },
  {
    title: "Explore the Academic Network",
    description:
      "Rankings, branches, semesters — all connected. Discover how you stack up and use it to drive change, push for fairness, or just flex your progress.",
  },
];

  const totalSteps = stepContent.length

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    // Mark onboarding as completed in IndexedDB
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
        const transaction = db.transaction(['user_preferences'], 'readwrite')
        const store = transaction.objectStore('user_preferences')
        store.put({
          id: 'onboarding_completed',
          value: true,
          timestamp: Date.now()
        })
      }
    } catch (error) {
      console.error('Error saving onboarding completion:', error)
    }
    
    onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  // Reset step when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white max-w-[370px] sm:max-w-md">
        {/* <div className="p-1 sm:p-2">
          <div className="w-full h-28 sm:h-32 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 flex items-left justify-left">
            <div className="text-white text-center">
              <h3 className="text-lg sm:text-xl font-bold">MIET Results</h3>
              <p className="text-xs sm:text-sm opacity-90">Singularity Project</p>
            </div>
          </div>
        </div> */}
        <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 pt-3 pb-4 sm:pb-6">
          <DialogHeader>
            <DialogTitle className="text-left text-base sm:text-lg">{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription className="text-left text-sm">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4">
            <div className="flex justify-left space-x-1.5">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    index + 1 === step ? "bg-blue-600" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
            <DialogFooter className="flex-row justify-between">
              <Button type="button" variant="ghost" onClick={handleSkip} className="text-sm">
                Skip
              </Button>
              <Button
                className="group text-sm"
                type="button"
                onClick={handleContinue}
              >
                {step < totalSteps ? "Next" : "Get Started"}
                <ArrowRightIcon
                  className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={14}
                  aria-hidden="true"
                />
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
