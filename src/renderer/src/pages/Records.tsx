'use client'

import { FolderIcon, FileIcon, FileTextIcon, ImageIcon, FileSpreadsheetIcon, FileIcon as FilePresentationIcon, ChevronLeftIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { dummyFiles } from '@/lib/dummyData'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FileItem {
  name: string
  isDirectory: boolean
  children?: FileItem[]
}

function getFileIcon(fileName: string, isDirectory: boolean) {
  if (isDirectory) return FolderIcon
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
    case 'docx':
    case 'txt':
      return FileTextIcon
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return ImageIcon
    case 'xlsx':
    case 'csv':
      return FileSpreadsheetIcon
    case 'pptx':
      return FilePresentationIcon
    default:
      return FileIcon
  }
}

function truncateName(name: string, maxLength: number = 15) {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength) + '...'
}

export function Records() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentDirectory, setCurrentDirectory] = useState<FileItem[]>(dummyFiles)
  const [directoryHistory, setDirectoryHistory] = useState<FileItem[][]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])

  const filteredFiles = currentDirectory.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory && file.children) {
      setDirectoryHistory([...directoryHistory, currentDirectory])
      setCurrentDirectory(file.children)
      setCurrentPath([...currentPath, file.name])
    }
  }

  const handleBackClick = () => {
    if (directoryHistory.length > 0) {
      const previousDirectory = directoryHistory[directoryHistory.length - 1]
      setCurrentDirectory(previousDirectory)
      setDirectoryHistory(directoryHistory.slice(0, -1))
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Previous Records</h2>
      <div className="flex items-center mb-4">
        <Button
          onClick={handleBackClick}
          disabled={directoryHistory.length === 0}
          className="mr-2"
          variant="outline"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Input
          type="text"
          placeholder="Search files..."
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Current path: /{currentPath.join('/')}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFiles.map((file: FileItem) => {
          const IconComponent = getFileIcon(file.name, file.isDirectory)
          return (
            <Card 
              key={file.name} 
              className={`hover:shadow-lg transition-shadow duration-300 ${file.isDirectory ? 'cursor-pointer' : ''}`}
              onClick={() => handleFileClick(file)}
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

