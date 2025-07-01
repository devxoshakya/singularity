"use client"

import { useState } from "react"
import { ExternalLink, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsDialogProps {
  isOpen: boolean
  onAccept: () => void
  onReject: () => void
}

export default function TermsDialog({ isOpen, onAccept, onReject }: TermsDialogProps) {
  const handleAccept = async () => {
    // Mark terms as accepted in IndexedDB
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
          id: 'terms_accepted',
          value: true,
          timestamp: Date.now()
        })
      }
    } catch (error) {
      console.error('Error saving terms acceptance:', error)
    }
    
    onAccept()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-[370px] sm:max-w-md mx-auto max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl font-bold">Terms & Conditions</DialogTitle>
          <DialogDescription className="text-sm">
            MIET Results Listing - Please read carefully before proceeding
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="px-4 sm:px-6 py-4 max-h-96 overflow-x-hidden">
          <div className="space-y-4 text-xs sm:text-sm max-w-full">
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">Terms & Conditions of MIET Results Listing</h3>
              <p className="text-gray-600 mb-4 text-xs sm:text-sm">Last Updated: June 24, 2025</p>
              
              <p className="mb-4 break-words">
                Welcome to the MIET Results Listing, a project proudly presented as part of the <strong>Singularity Project</strong> by <strong>Dev Shakya</strong> and <strong>Akshita Srivastava</strong> ("We", "Us", or "The Creators").
              </p>
              
              <p className="mb-4 break-words">
                By using this platform, you ("The User") agree to the following terms and conditions. If you're here just to check your result and maybe your crush's SGPA — well, read on. There's important stuff ahead.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">1. Consent to Display Academic Details</h4>
              <p className="mb-2 break-words">By accessing or using this website, you explicitly consent to have the following details displayed publicly:</p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
                <li className="break-words">Full Name</li>
                <li className="break-words">Father's Name</li>
                <li className="break-words">Roll Number</li>
                <li className="break-words">Enrollment Number</li>
                <li className="break-words">Subject-wise Marks</li>
                <li className="break-words">Number of Carry Over/Back Papers</li>
                <li className="break-words">Semester-wise SGPA</li>
                <li className="break-words">Result Status (Pass/Fail/Incomplete etc.)</li>
              </ul>
              <p className="mb-4 break-words">
                You acknowledge that since you're viewing others' results, it's only fair yours is visible too. Transparency is a two-way street.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">2. No Legal Funny Business</h4>
              <p className="mb-2 break-words">By agreeing to these terms, you hereby waive any right to initiate legal action, complaints, or cybercrime reports against:</p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
                <li className="break-words">Dev Shakya</li>
                <li className="break-words">Akshita Srivastava</li>
                <li className="break-words">The Singularity Project Team</li>
              </ul>
              <p className="mb-4 break-words">
                for the publication, formatting, accuracy, or implications of your academic data presented here.
              </p>
              <p className="mb-4 break-words">
                This platform does not claim to be an official source. All information is derived from already publicly available institutional resources. If you've got issues with the data, take it up with your college, not us.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">3. Disclaimer of Accuracy</h4>
              <p className="mb-2 break-words">While we try our best to keep data updated, readable, and error-free, we make no guarantees about:</p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
                <li className="break-words">Real-time accuracy</li>
                <li className="break-words">Completeness</li>
                <li className="break-words">Data integrity</li>
                <li className="break-words">Server uptime</li>
              </ul>
              <p className="mb-4 break-words">This is a passion project, not a million-dollar operation.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">4. No Responsibility for Consequences</h4>
              <p className="mb-2 break-words">Whether you passed, failed, or found out your friend topped — this platform is not liable for any:</p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
                <li className="break-words">Emotional damage</li>
                <li className="break-words">Friend breakups</li>
                <li className="break-words">Parental scolding</li>
                <li className="break-words">Career decisions</li>
                <li className="break-words">Memes made about your grades</li>
              </ul>
              <p className="mb-4 break-words">Use the information wisely and don't shoot the messenger.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">5. Data Ownership</h4>
              <p className="mb-4 break-words">
                The academic data displayed here is institutional property, and this site merely organizes and presents it for academic curiosity, transparency, and community access.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">6. You Are Being Watched (Technically)</h4>
              <p className="mb-4 break-words">
                For analytics and improvement, we may collect anonymous information like your IP address, browser type, and visit time. No shady tracking — just the basics. Still paranoid? Use incognito.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">7. Modification of Terms</h4>
              <p className="mb-4 break-words">
                We may update these terms any time, especially if someone tries something funny. Keep checking back. Or not — up to you.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">8. Closing Note</h4>
              <p className="mb-4 break-words">
                This is not just a results site — it's part of a revolution in how students engage with their academic records. It's faster, cleaner, and smarter than anything your institute thought of. We just ask for a little trust, a little respect, and if you like the effort…
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg break-words">
                <Github className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-medium text-center sm:text-left">🌟 Star the GitHub Repo.</span>
                <span className="text-gray-600 text-center sm:text-left">It means a lot.</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onReject}
              className="flex-1 text-sm"
            >
              I Don't Agree
            </Button>
            <Button 
              onClick={handleAccept}
              className="flex-1 text-sm"
            >
              I Accept Terms & Conditions
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
