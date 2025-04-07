"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrintButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button variant="outline" size="icon" onClick={handlePrint} aria-label="Print CV">
      <Printer className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Print CV</span>
    </Button>
  )
}

