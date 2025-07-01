"use client"

import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccessDeniedProps {
  onRetry: () => void
}

export default function AccessDenied({ onRetry }: AccessDeniedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg  p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          You must accept our Terms & Conditions to access the MIET Results Listing. 
          We need your consent to display academic information as outlined in our terms.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Review Terms & Conditions
          </Button>
          
          <p className="text-xs text-gray-500">
            By accepting, you agree to our data display policies and usage terms.
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            MIET Results Listing - Singularity Project
            <br />
            By Dev Shakya & Akshita Srivastava
          </p>
        </div>
      </div>
    </div>
  )
}
