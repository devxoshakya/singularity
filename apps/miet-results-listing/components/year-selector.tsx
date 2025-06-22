"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface YearSelectorProps {
  selectedYear?: string
  onYearChange?: (year: string) => void
  className?: string
}

const years = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year', '2024 Batch']

export default function YearSelector({ 
  selectedYear = "All Years", 
  onYearChange,
  className = "" 
}: YearSelectorProps) {
  const [internalSelectedYear, setInternalSelectedYear] = useState(selectedYear)

  const handleYearSelect = (year: string) => {
    setInternalSelectedYear(year)
    onYearChange?.(year)
  }

  const currentYear = onYearChange ? selectedYear : internalSelectedYear

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between min-w-[140px]">
            {currentYear}
            <ChevronDownIcon
              className="ml-2 h-4 w-4 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[100px]">
          {years.map((year) => (
            <DropdownMenuCheckboxItem
              key={year}
              checked={currentYear === year}
              onCheckedChange={(checked) => {
                if (checked) handleYearSelect(year)
              }}
            >
              {year}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
