"use client"

import { useState, useEffect } from "react"
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface FileItem {
  name: string
  isDirectory: boolean
}

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pdf":
    case "docx":
    case "txt":
      return FileTextIcon
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return ImageIcon
    case "xlsx":
    case "csv":
      return FileSpreadsheetIcon
    case "pptx":
      return PresentationIcon
    default:
      return FileIcon
  }
}

function truncateName(name: string, maxLength: number = 15) {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength) + "..."
}

export function Records() {
  const [searchTerm, setSearchTerm] = useState("")
  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const directoryPath = await (window as any).api.getDocumentsPath()
        const fileList: string[] = await (window as any).api.getFiles(directoryPath)

        // Filter out directories and exclude ".json" folder
        const onlyFiles: FileItem[] = fileList
          .filter((fileName) => fileName !== ".json") // Exclude the .json folder
          .map((fileName) => ({
            name: fileName,
            isDirectory: false,
          }))

        setFiles(onlyFiles)
      } catch (error) {
        console.error("Error fetching files:", error)
      }
    }

    fetchFiles()
  }, [])

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openFile = async (fileName: string) => {
    try {
      const directoryPath = await (window as any).api.getDocumentsPath()
      const filePath = `${directoryPath}/${fileName}`
      const result = await (window as any).api.openFile(filePath)
      alert(result)
    } catch (error) {
      console.error("Error opening file:", error)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Previous Records
      </h2>
      <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Search files..."
          className="flex-grow dark:bg-gray-800 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFiles.map((file: FileItem) => {
          const IconComponent = getFileIcon(file.name)
          return (
            <Card
              key={file.name}
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => openFile(file.name)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <IconComponent className="w-16 h-16 text-gray-600 dark:text-gray-400 mb-2" />
                <p className="text-sm text-center font-medium text-gray-700 dark:text-gray-300 truncate w-full">
                  {truncateName(file.name)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
