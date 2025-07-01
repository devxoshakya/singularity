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
import { EnhancedStudentDialog } from "@/components/enhanced-student-dialog"

interface Student {
  _id: string
  fullName: string
  rollNo: string
  branch: string
  year: number
  SGPA: { [key: string]: number }
  fatherName: string
  enrollmentNo: string
  course?: string
  instituteName: string
  latestResultStatus: string
  totalMarksObtained: number
  CarryOvers: (string[] | {
    session: string
    sem: string
    cop: string
  })[]
  Subjects: Array<{
    subject: string
    code: string
    type: string
    internal: string
    external: string
  }>
  divison?: string
  cgpa?: string
  latestCOP?: string
  rank?: number // Add rank property
}

interface StudentInfoRowProps {
  searchValue?: string
  selectedYear?: string
}

// Memoized student row component with optimized props for large datasets
const StudentRow = memo(({ student, rank, branchCode }: { 
  student: Student; 
  rank: number; 
  branchCode: string;
}) => (
  <EnhancedStudentDialog student={student}>
    <TableRow className="cursor-pointer hover:bg-muted/30 transition-colors duration-200 border-b border-gray-100">
      <TableCell className="w-auto min-w-[55px] font-bold text-base sm:text-lg text-left py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300">
        {rank}
      </TableCell>
      <TableCell className="flex-1 text-sm sm:text-base text-left py-3 px-2 sm:px-4 font-medium text-slate-900 dark:text-slate-100">
        <div className="truncate max-w-full">
          {student.fullName}
        </div>
      </TableCell>
      <TableCell className="w-auto min-w-[70px] text-xs sm:text-sm text-center py-3 px-2 sm:px-4 font-semibold text-blue-600 dark:text-blue-400">
        {branchCode}
      </TableCell>
    </TableRow>
  </EnhancedStudentDialog>
), (prevProps, nextProps) => {
  // Strict equality check for better memoization with large datasets
  return prevProps.rank === nextProps.rank && 
         prevProps.student._id === nextProps.student._id &&
         prevProps.branchCode === nextProps.branchCode &&
         prevProps.student.fullName === nextProps.student.fullName
})

StudentRow.displayName = 'StudentRow'

export default function StudentInfoRow({ searchValue = "", selectedYear = "All Years" }: StudentInfoRowProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Use deferred values for better performance during rapid changes
  const deferredSearchValue = useDeferredValue(searchValue)
  const deferredSelectedYear = useDeferredValue(selectedYear)

  // IndexedDB setup
  const DB_NAME = 'miet_students_db'
  const DB_VERSION = 1
  const STORE_NAME = 'students'
  const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

  // Initialize IndexedDB
  const initDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }, [])

  // Get cached data from IndexedDB
  const getCachedData = useCallback(async (): Promise<{ data: Student[], timestamp: number } | null> => {
    try {
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('students_cache')
      
      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const result = request.result
          if (result && result.data && Array.isArray(result.data)) {
            resolve({ data: result.data, timestamp: result.timestamp })
          } else {
            resolve(null)
          }
        }
      })
    } catch (error) {
      console.error('Error getting cached data:', error)
      return null
    }
  }, [initDB])

  // Set cached data in IndexedDB
  const setCachedData = useCallback(async (data: Student[]) => {
    try {
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      
      await new Promise((resolve, reject) => {
        const request = store.put({
          id: 'students_cache',
          data: data,
          timestamp: Date.now()
        })
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })
    } catch (error) {
      console.error('Error setting cached data:', error)
    }
  }, [initDB])

  // Check if cache is valid
  const isCacheValid = useCallback((timestamp: number): boolean => {
    return (Date.now() - timestamp) < CACHE_DURATION
  }, [CACHE_DURATION])

  // Fetch students from API
  const fetchStudentsFromAPI = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setIsUpdating(true)
      
      const response = await fetch('https://student-pearl-alpha.vercel.app/api/student')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const jsonResponse = await response.json()
      const data: Student[] = jsonResponse.data

      if (Array.isArray(data)) {
        setStudents(data)
        setCachedData(data) // Cache in background
        if (!isBackground) setLoading(false)
      } else {
        console.error('API response is not an array:', data)
        if (!isBackground) {
          setStudents([])
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      if (!isBackground) {
        setStudents([])
        setLoading(false)
      }
    } finally {
      setIsUpdating(false)
    }
  }, [setCachedData])

  // Initial data load with background update strategy
  useEffect(() => {
    const loadData = async () => {
      const cached = await getCachedData()
      
      if (cached && cached.data.length > 0) {
        // Always show cached data immediately for instant loading
        setStudents(cached.data)
        setLoading(false)
        
        // Always fetch in background to keep data fresh, regardless of cache age
        fetchStudentsFromAPI(true)
      } else {
        // No cache, fetch fresh data
        fetchStudentsFromAPI(false)
      }
    }
    
    loadData()
  }, [getCachedData, fetchStudentsFromAPI])

  // Branch mapping object - optimized with useMemo
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

  // Virtual scrolling optimization - only render visible items
  const ITEMS_PER_PAGE = 50 // Reduced for better performance
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: ITEMS_PER_PAGE })

  // Optimized filtering with useMemo
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return []

    let filtered = students

    // Filter by year - optimized conditions
    if (deferredSelectedYear !== "All Years") {
      const yearMap: { [key: string]: number } = {
        "1st Year": 1,
        "2nd Year": 2,
        "3rd Year": 3,
        "4th Year": 4,
        "2024 Batch": 2024
      }
      
      if (yearMap[deferredSelectedYear]) {
        filtered = students.filter(student => student.year === yearMap[deferredSelectedYear])
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

    // Sort by SGPA and assign ranks
    const sortedByPerformance = [...filtered].sort((a, b) => {
      const sgpaA = getLatestSGPA(a.SGPA || {})
      const sgpaB = getLatestSGPA(b.SGPA || {})
      return sgpaB - sgpaA // Highest SGPA first
    })

    // Pre-calculate ranks and branch codes for performance
    const rankedFiltered = sortedByPerformance.map((student, index) => ({
      ...student,
      rank: index + 1,
      branchCode: getBranchCode(student.branch)
    }))

    // Apply sort order
    if (sortOrder === 'desc') {
      rankedFiltered.reverse()
    }

    return rankedFiltered
  }, [students, deferredSearchValue, deferredSelectedYear, sortOrder, getLatestSGPA, getBranchCode])

  // Virtualized students - render all visible items for smoother scrolling
  const displayedStudents = useMemo(() => {
    // For search/filter results, show all to maintain UX
    if (deferredSearchValue.trim() || deferredSelectedYear !== "All Years") {
      return filteredStudents
    }
    
    // For full list, use virtual scrolling to handle 6000+ students
    return filteredStudents.slice(0, Math.min(100, filteredStudents.length)) // Cap at 1000 for performance
  }, [filteredStudents, deferredSearchValue, deferredSelectedYear])

  const handleRankSort = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    )
  }

  return (
    <div className="w-full px-2 overflow-x-auto">
      <div className="w-full md:max-w-3xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
        {/* Simple header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              
            </h2>
            {isUpdating && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Updating...
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {filteredStudents.length} students
            {filteredStudents.length > 100 && deferredSearchValue.trim() === "" && deferredSelectedYear === "All Years" && (
              <span className="ml-2 text-xs text-orange-600">(showing top 100)</span>
            )}
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-background/95 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
                <TableHead className="w-auto min-w-[55px] text-base font-bold cursor-pointer text-left py-4 px-2 sm:px-4 text-slate-800 dark:text-slate-200" onClick={handleRankSort}>
                  Rank <span className="md:text-lg text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                </TableHead>
                <TableHead className="flex-1 text-base font-bold text-left py-4 px-2 sm:px-4 text-slate-800 dark:text-slate-200">Name</TableHead>
                <TableHead className="w-auto min-w-[70px] text-base font-bold text-center py-4 px-2 sm:px-4 text-slate-800 dark:text-slate-200">Branch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-gray-100">
                <TableCell className="w-auto min-w-[55px] font-bold text-base sm:text-lg text-left py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300">
                  -1
                </TableCell>
                <TableCell className="flex-1 text-sm sm:text-base text-left py-3 px-2 sm:px-4 font-medium text-slate-900 dark:text-slate-100">
                  <div className="truncate max-w-full">
                    AKSHITA SRIVASTAVA
                  </div>
                </TableCell>
                <TableCell className="w-auto min-w-[70px] text-xs sm:text-sm text-center py-3 px-2 sm:px-4 font-semibold text-blue-600 dark:text-blue-400">
                  CSE
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-100">
                <TableCell className="w-auto min-w-[55px] font-bold text-base sm:text-lg text-left py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300">
                  0
                </TableCell>
                <TableCell className="flex-1 text-sm sm:text-base text-left py-3 px-2 sm:px-4 font-medium text-slate-900 dark:text-slate-100">
                  <div className="truncate max-w-full">
                    DEV SHAKYA
                  </div>
                </TableCell>
                <TableCell className="w-auto min-w-[70px] text-xs sm:text-sm text-center py-3 px-2 sm:px-4 font-semibold text-blue-600 dark:text-blue-400">
                  CSE
                </TableCell>
              </TableRow>
              {displayedStudents.map((student) => (
                <StudentRow 
                  key={student._id} 
                  student={student} 
                  rank={student.rank || 0} 
                  branchCode={student.branchCode || getBranchCode(student.branch)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        
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