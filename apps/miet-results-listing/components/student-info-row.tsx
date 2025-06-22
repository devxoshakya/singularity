"use client"

import { useState, useEffect, useMemo, memo, useCallback, useDeferredValue } from "react"
import { Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Student {
  _id: string
  fullName: string
  rollNo: number
  branch: string
  year: number
  SGPA: { [key: string]: number }
  fatherName: string
  enrollmentNo: string
  instituteName: string
  latestResultStatus: string
  totalMarksObtained: number
  CarryOvers: string[][]
  Subjects: Array<{
    subject: string
    code: string
    type: string
    internal: string
    external: string
  }>
  rank?: number // Add rank property
}

interface StudentInfoRowProps {
  searchValue?: string
  selectedYear?: string
}

// Memoized student row component with optimized props
const StudentRow = memo(({ student, rank, branchCode }: { 
  student: Student; 
  rank: number; 
  branchCode: string;
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <TableRow className="cursor-pointer hover:bg-muted/30 transition-colors duration-200 border-b border-gray-100">
        <TableCell className="font-bold text-base sm:text-lg text-left py-3 px-4 text-slate-700 dark:text-slate-300 w-20">
          {rank}
        </TableCell>
        <TableCell className="text-sm sm:text-base text-left py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
          <div className="truncate max-w-xs sm:max-w-none">
            {student.fullName}
          </div>
        </TableCell>
        <TableCell className="text-xs sm:text-sm text-center py-3 px-4 font-semibold text-blue-600 dark:text-blue-400 w-24">
          {branchCode}
        </TableCell>
      </TableRow>
    </DialogTrigger>
    <DialogContent className="max-w-4xl h-[80vh]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-blue-600">
          {student.fullName} - Student Details
        </DialogTitle>
      </DialogHeader>
      
      <div className="p-4">
        <div className="text-center text-muted-foreground">
          Student details will be updated soon...
        </div>
      </div>
    </DialogContent>
  </Dialog>
), (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return prevProps.rank === nextProps.rank && 
         prevProps.student._id === nextProps.student._id &&
         prevProps.branchCode === nextProps.branchCode
})

StudentRow.displayName = 'StudentRow'

export default function StudentInfoRow({ searchValue = "", selectedYear = "All Years" }: StudentInfoRowProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc') // Start with asc for best students first
  const [loading, setLoading] = useState(true)

  // Use deferred values for better performance during rapid changes
  const deferredSearchValue = useDeferredValue(searchValue)
  const deferredSelectedYear = useDeferredValue(selectedYear)

  // Branch mapping object - moved to useMemo for better performance
  const branches = useMemo(() => ({
    "BIOTECHNOLOGY": "BT",
    "CIVIL ENGINEERING": "CE", 
    "COMPUTER SCIENCE AND ENGINEERING": "CSE",
    "CHEMICAL ENGINEERING": "CH",
    "COMPUTER SCIENCE": "CS",
    "COMPUTER SCIENCE AND ENGINEERING ARTIFICIAL INTELLIGENCE": "CSE (AI)",
    "COMPUTER SCIENCE AND ENGINEERINGARTIFICIAL INTELLIGENCE & MACHINE LEARNING": "CSE (AIML)",
    "COMPUTER SCIENCE AND ENGINEERINGDATA SCIENCE": "CSE (DS)",
    "COMPUTER SCIENCE AND ENGINEERINGINTERNET OF THINGS": "CSE (IoT)",
    "ELECTRONICS AND COMMUNICATION ENGINEERING": "ECE",
    "ELECTRICAL ENGINEERING": "EE",
    "INFORMATION TECHNOLOGY": "IT", 
    "MECHANICAL ENGINEERING": "ME",
    "COMPUTER SCIENCE AND INFORMATION TECHNOLOGY": "CSIT",
  }), [])

  // Function to get branch code - optimized
  const getBranchCode = useCallback((branchName: string): string => {
    const upperBranch = branchName.toUpperCase()
    return branches[upperBranch as keyof typeof branches] || branchName.slice(0, 3).toUpperCase()
  }, [branches])

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://student-pearl-alpha.vercel.app/api/student')
        const jsonResponse = await response.json()
        console.log('Fetched students:', jsonResponse)
        const data: Student[] = jsonResponse.data;
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setStudents(data)
        } else {
          console.error('API response is not an array:', data)
          setStudents([])
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching students:', error)
        setStudents([])
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Get latest SGPA for ranking - memoized for performance
  const getLatestSGPA = useCallback((sgpaObj: { [key: string]: number }): number => {
    const semesters = Object.keys(sgpaObj).filter(key => key.startsWith('sem'))
    if (semesters.length === 0) return 0
    
    const latestSem = semesters.sort((a, b) => {
      const semA = parseInt(a.replace('sem', ''))
      const semB = parseInt(b.replace('sem', ''))
      return semB - semA
    })[0]
    
    return sgpaObj[latestSem] || 0
  }, [])

  // Filter and sort students - heavily optimized for performance
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return []

    let filtered = students // No need to spread since we're not mutating

    // Filter by year - optimized conditions
    if (deferredSelectedYear !== "All Years") {
      if (deferredSelectedYear === "2024 Batch") {
        filtered = students.filter(student => student.year === 2024) // Assuming 2024 Batch is equivalent to 4th Year
      } else {
        const yearMap: { [key: string]: number } = {
          "1st Year": 1,
          "2nd Year": 2,
          "3rd Year": 3,
          "4th Year": 4,
          "2024 Batch": 2024 // Assuming 2024 Batch is equivalent to 4th Year
        }
        
        if (yearMap[deferredSelectedYear]) {
          filtered = students.filter(student => student.year === yearMap[deferredSelectedYear])
        }
      }
    }

    // Filter by search term - optimized string operations
    if (deferredSearchValue.trim()) {
      const searchLower = deferredSearchValue.toLowerCase()
      filtered = filtered.filter(student => 
        student.fullName?.toLowerCase().includes(searchLower) ||
        student.rollNo?.toString().includes(deferredSearchValue)
      )
    }

    // Sort by SGPA and assign relative ranks within the filtered set
    const sortedByPerformance = [...filtered].sort((a, b) => {
      const sgpaA = getLatestSGPA(a.SGPA || {})
      const sgpaB = getLatestSGPA(b.SGPA || {})
      return sgpaB - sgpaA // Highest SGPA first
    })

    // Assign relative ranks and pre-calculate branch codes
    const rankedFiltered = sortedByPerformance.map((student, index) => ({
      ...student,
      rank: index + 1,
      branchCode: getBranchCode(student.branch) // Pre-calculate for better performance
    }))

    // Sort by rank based on sort order
    rankedFiltered.sort((a, b) => {
      const rankA = a.rank || 0
      const rankB = b.rank || 0
      return sortOrder === 'asc' ? rankA - rankB : rankB - rankA
    })

    return rankedFiltered
  }, [students, deferredSearchValue, deferredSelectedYear, sortOrder, getLatestSGPA, getBranchCode])

  const handleRankSort = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="md:max-w-3xl max-w-[370px] mx-auto px-0 sm:px-6 lg:px-8 py-6">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-background/95 sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
              <TableHead className="w-1/3 text-base font-bold cursor-pointer text-left py-4 px-4 text-slate-800 dark:text-slate-200" onClick={handleRankSort}>
                Rank <span className="md:text-lg text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              </TableHead>
              <TableHead className="w-1/3 text-base sm:text-lg font-bold text-left py-4 px-4 text-slate-800 dark:text-slate-200">Name</TableHead>
              <TableHead className="w-1/3 text-base sm:text-lg font-bold text-center py-4 px-4 text-slate-800 dark:text-slate-200">Branch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <StudentRow 
                key={student._id} 
                student={student} 
                rank={student.rank || 0} 
                branchCode={student.branchCode || getBranchCode(student.branch)}
              />
            ))}
          </TableBody>
        </Table>
        
        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No students found matching your search criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search terms or year filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}