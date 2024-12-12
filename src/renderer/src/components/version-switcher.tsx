"use client"

import * as React from "react"
<<<<<<< HEAD
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
=======
import { GalleryVerticalEnd } from "lucide-react"
>>>>>>> 70895407abfbc1ab4160418203bee91cb89f25c3

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
<<<<<<< HEAD
=======
import { CheckIcon, CaretSortIcon } from "@radix-ui/react-icons"
>>>>>>> 70895407abfbc1ab4160418203bee91cb89f25c3

export function VersionSwitcher({
  versions,
  defaultVersion,
}: {
  versions: string[]
  defaultVersion: string
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Documentation</span>
                <span className="">v{selectedVersion}</span>
              </div>
<<<<<<< HEAD
              <ChevronsUpDown className="ml-auto" />
=======
              <CaretSortIcon className="ml-auto" />
>>>>>>> 70895407abfbc1ab4160418203bee91cb89f25c3
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
<<<<<<< HEAD
                {version === selectedVersion && <Check className="ml-auto" />}
=======
                {version === selectedVersion && <CheckIcon className="ml-auto" />}
>>>>>>> 70895407abfbc1ab4160418203bee91cb89f25c3
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
