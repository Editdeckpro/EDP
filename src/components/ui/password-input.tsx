"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface FormPasswordFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function FormPasswordField<T extends FieldValues>({
  form,
  name,
  label = "Password",
  placeholder = "Enter your password",
}: FormPasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <Label
              htmlFor={name}
              className="block text-sm font-medium text-foreground"
            >
              {label}
            </Label>
          )}
          <div className="relative">
            <FormControl>
              <Input
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="pr-10"
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
              aria-label="Toggle password visibility"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
