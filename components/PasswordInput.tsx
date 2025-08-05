"use client";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative w-full">
        <Input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-2 flex items-center p-1"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-5 w-5 text-gray-500" />
          ) : (
            <Eye className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";