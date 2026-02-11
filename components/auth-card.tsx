"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthUIConfig } from "../context";
import { cn } from "@/lib/utils";
import "@/auth-ui/styles/index.css";

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  const config = useAuthUIConfig();

  return (
    <Card className={cn("auth-ui-card", className)}>
      <CardHeader className="space-y-1">
        {config.logo && (
          <div className="flex justify-center mb-2" aria-hidden="true">
            {config.logo}
          </div>
        )}
        <CardTitle className="text-center">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-center">{subtitle}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="flex flex-col gap-2">{footer}</CardFooter>}
    </Card>
  );
}
