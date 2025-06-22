"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Enter Name / Roll No.",
  className = "",
}: SearchInputProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-[1.2rem] transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id={id}
          placeholder={placeholder}
          value={onChange ? value : internalValue}
          onChange={handleChange}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      <p
        className="text-muted-foreground mt-2 text-xs text-left pl-1 hidden sm:block"
        role="region"
        aria-live="polite"
      >
        Search with Roll Number or Name to find student results
      </p>
    </div>
  );
}
