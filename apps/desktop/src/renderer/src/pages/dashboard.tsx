import React, { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ResultExtraction from "@/pages/ResultExtraction"
import { Records } from "./Records"

export function Dashboard() {
  // State to store the current URL selected from the sidebar
  const [currentUrl, setCurrentUrl] = useState("/result-extraction")

  return (
    <SidebarProvider>
      {/* Pass the setter to AppSidebar */}
      <AppSidebar setter={setCurrentUrl} />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {currentUrl === "/result-extraction"
                    ? "Result Extraction"
                    : "Records"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentUrl === "/result-extraction"
                    ? ""
                    : "Detailed View"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Dynamically render the selected component */}
          {currentUrl === "/result-extraction" ? (
            <ResultExtraction />
          ) : (
            <Records />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
