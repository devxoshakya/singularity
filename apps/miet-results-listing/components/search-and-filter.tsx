"use client"

import { useState } from "react"
import SearchInput from "./search-input"
import YearSelector from "./year-selector"

interface SearchAndFilterProps {
  onSearchChange?: (searchTerm: string) => void
  onYearChange?: (year: string) => void
  searchValue?: string
  selectedYear?: string
  className?: string
}

export default function SearchAndFilter({
  onSearchChange,
  onYearChange,
  searchValue = "",
  selectedYear = "All Years",
  className = ""
}: SearchAndFilterProps) {
  return (
    <div className={className}>
      <div className="flex flex-row gap-3 items-start max-w-lg mx-auto px-3 sm:px-0">
        <div className="flex-1 min-w-0">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Enter Name / Roll No."
            className="w-full"
          />
        </div>
        <div className="flex-shrink-0">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  )
}
