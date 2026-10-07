"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export const RadioGroup = RadioGroupPrimitive.Root;

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn("h-4 w-4 rounded-full border border-primary data-[state=checked]:bg-primary", className)}
      {...props}
    />
  );
}
