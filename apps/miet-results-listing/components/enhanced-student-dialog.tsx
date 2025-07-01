"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GraduationCap, User, BookOpen, Award, AlertTriangle, TrendingUp, Calendar, XCircle, Clock } from "lucide-react"
import { log } from "console"

interface Subject {
  subject: string
  code: string
  type: string
  internal: string
  external: string
}

interface CarryOver {
  session?: string
  sem?: string
  cop?: string
}

interface StudentData {
  _id: string
  rollNo: string
  enrollmentNo: string
  fullName: string
  fatherName: string
  course?: string
  branch: string
  year: number
  SGPA: Record<string, number>
  CarryOvers: (CarryOver | string[])[]
  divison?: string
  cgpa?: string
  instituteName: string
  Subjects: Subject[]
  latestResultStatus: string
  totalMarksObtained: number
  latestCOP?: string
}

function parseLatestCOP(latestCOP: string): string[] {
  if (!latestCOP || latestCOP === "COP :" || latestCOP === "NO Backlogs") return []
  const copPart = latestCOP.split("COP : ")[1]
  return copPart
    ? copPart
        .split(",")
        .map((code) => code.trim())
        .filter(Boolean)
    : []
}

function SGPACard({ sgpaData }: { sgpaData: Record<string, number> }) {
const semesters = Object.keys(sgpaData).sort((a, b) => {
    const semA = Number.parseInt(a.replace("sem", ""))
    const semB = Number.parseInt(b.replace("sem", ""))
    return semA - semB
})

semesters.pop() // Remove the last semester (sem8) for display

  const getGradeColor = (sgpa: number) => {
    if (sgpa >= 9) return "bg-emerald-500"
    if (sgpa >= 8) return "bg-green-500"
    if (sgpa >= 7) return "bg-blue-500"
    if (sgpa >= 6) return "bg-yellow-500"
    if (sgpa >= 4) return "bg-orange-500"
    return "bg-red-500"
  }

  const getGradeLabel = (sgpa: number) => {
    if (sgpa >= 9) return "Outstanding"
    if (sgpa >= 8) return "Excellent"
    if (sgpa >= 7) return "Very Good"
    if (sgpa >= 6) return "Good"
    if (sgpa >= 4) return "Average"
    return "Poor"
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          SGPA Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {semesters.map((sem) => {
            const sgpa = sgpaData[sem]
            return (
              <div key={sem} className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase">
                  {sem.replace("sem", "Sem ")}
                </div>
                <div className={`${getGradeColor(sgpa)} text-white rounded-lg p-3 shadow-md`}>
                  <div className="text-xl font-bold">{sgpa}</div>
                  <div className="text-xs opacity-90">{getGradeLabel(sgpa)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function StudentDialogContent({ student }: { student: StudentData }) {
  const hasBacklogs = student.CarryOvers.some((co) =>
    Array.isArray(co) ? !co.includes("No Backlogs") : co.cop && co.cop !== "COP :",
  )

  const latestCOPSubjects = parseLatestCOP(student.latestCOP || "")

  let currentSemester = Object.keys(student.SGPA)
  .filter(key => key.startsWith("sem"))
  .sort((a, b) => Number(a.replace("sem", "")) - Number(b.replace("sem", "")))
  .pop();
  
  currentSemester = currentSemester?.replace("sem", "");

  const yearOfStudy = student.year;

  const getResultStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PASS":
        return "default"
      case "FAIL":
        return "destructive"
      case "PCP":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getResultStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "PCP":
        return "Pass with Carry Papers"
      case "FAIL":
        return "FAIL"
      case "PASS":
        return "PASS"
      default:
        return status || "In Progress"
    }
  }

  return (
    <DialogContent className="md:!max-w-3xl mx-auto sm:!max-w-xl !max-w-[370px] max-h-[90vh] p-0 overflow-hidden">
      <DialogHeader className="px-6 py-4">
        <DialogTitle className="flex items-center gap-3 text-xl">
          <GraduationCap className="h-6 w-6" />
          Student Academic Profile
        </DialogTitle>
      </DialogHeader>

      <ScrollArea className="max-h-[calc(90vh-80px)]">
        <div className="p-6 space-y-6">
          {/* Student Info Header */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Student Details</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{student.fullName}</h2>
                    <p className="text-muted-foreground">C/O {student.fatherName}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Roll No:</span>
                      <p className="text-muted-foreground">{student.rollNo}</p>
                    </div>
                    <div>
                      <span className="font-medium">Enrollment:</span>
                      <p className="text-muted-foreground">{student.enrollmentNo}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Academic Info</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">{student.course || "B.TECH"}</span>
                      <p className="text-sm text-muted-foreground">{student.branch}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Year {yearOfStudy}</Badge>
                      <Badge variant="secondary">Sem {currentSemester}</Badge>
                      {student.cgpa && student.cgpa !== "---" && student.cgpa !== "" && (
                        <Badge variant="outline" className="bg-primary/10">
                          CGPA: {student.cgpa}
                        </Badge>
                      )}
                      {student.divison && student.divison !== "NOT AWARDED" && (
                        <Badge variant="outline">{student.divison}</Badge>
                      )}
                      {student.divison === "NOT AWARDED" && <Badge variant="destructive">Division Not Awarded</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SGPA Performance */}
          {Object.keys(student.SGPA).length > 0 && <SGPACard sgpaData={student.SGPA} />}

          {/* Academic Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-4 w-4" />
                  Academic Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Result Status:</span>
                  <Badge variant={getResultStatusColor(student.latestResultStatus)}>
                    {getResultStatusLabel(student.latestResultStatus)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Marks:</span>
                 <Badge variant={"default"}>
                    {student.totalMarksObtained}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Backlogs:</span>
                  <Badge variant={hasBacklogs ? "destructive" : "default"}>{hasBacklogs ? "Yes" : "None"}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Latest COP */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Latest Carry Overs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestCOPSubjects.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-destructive mb-2">
                      {latestCOPSubjects.length} Subject{latestCOPSubjects.length > 1 ? "s" : ""} Pending
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {latestCOPSubjects.map((subject, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm">No pending backlogs</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Carry Overs History */}
          {hasBacklogs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Complete Backlog History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.CarryOvers.map((co, index) => {
                    if (Array.isArray(co) && co.includes("No Backlogs")) return null
                    if (Array.isArray(co)) return null
                    return (
                      <div key={index} className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="font-medium text-destructive">{co.session}</div>
                          <Badge variant="outline" className="w-fit">
                            Semester: {co.sem}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Subjects: </span>
                          {co.cop
                            ?.split("COP : ")[1]
                            ?.split(",")
                            .map((subject, idx) => (
                              <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs">
                                {subject.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Subjects */}
          {student.Subjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Current Semester Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.Subjects.map((subject, index) => {
                    const isAbsent = subject.external === "ABS"
                    const isFailed =
                      (subject.external !== "ABS" &&
                        subject.external !== "" &&
                        Number.parseInt(subject.external) < 20) ||
                      (subject.internal !== "" && Number.parseInt(subject.internal) < 20)

                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors ${
                          isAbsent ? "border-red-300 bg-red-50" : isFailed ? "border-orange-300 bg-orange-50" : ""
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{subject.subject}</h4>
                              {isAbsent && <XCircle className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>Code: {subject.code}</span>
                              <Badge variant="outline" className="text-xs">
                                {subject.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm">
                            {/* Mobile view - single line */}
                            <div className="sm:hidden">
                              <span className="text-xs">
                                Internal {" :"} <b>{subject.internal || "N/A"} {" "} {" "}{" "}{" "} </b> External  {" :"} <b>{subject.external || "N/A"}</b>
                              </span>
                            </div>
                            {/* Desktop view - separate columns */}
                            <div className="hidden sm:flex gap-4">
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground">Internal</div>
                                <div className="font-semibold">{subject.internal || "N/A"}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground">External</div>
                                <div className={`font-semibold ${isAbsent ? "text-red-600" : ""}`}>
                                  {subject.external || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isAbsent && (
                          <div className="mt-2 text-xs text-red-600 font-medium">⚠️ Absent in External Examination</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Institute Info */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-primary">{student.instituteName}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </DialogContent>
  )
}

export function EnhancedStudentDialog({ student, children }: { student: StudentData; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <StudentDialogContent student={student} />
    </Dialog>
  )
}
