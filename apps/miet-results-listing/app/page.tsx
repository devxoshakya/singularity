
"use client"

import { useState } from "react"
import HeroSection from "@/components/hero-section"
import StudentInfoRow from "@/components/student-info-row"
import SearchAndFilter from "@/components/search-and-filter"

export default function Home() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedYear, setSelectedYear] = useState("All Years")

  return (
    <div>
      <HeroSection />
      
      {/* Search and Filter Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <SearchAndFilter 
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>
      
      <StudentInfoRow 
        searchValue={searchValue}
        selectedYear={selectedYear}
      />
    </div>
  );
}
