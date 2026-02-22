"use client";

import { useAuthUIConfig } from "../context";
import { useAuthUIComponents } from "../hooks/use-auth-ui-components";
import { cn } from "../utils";

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
  const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } = useAuthUIComponents();

  return (
    <Card
      className={cn("auth-ui-card flex flex-col gap-4 px-6 sm:px-8", className)}
    >
      <CardHeader className="space-y-2 pt-0 px-0">
        {config.logo && (
          <div className="flex justify-center mb-2" aria-hidden="true">
            {config.logo}
          </div>
        )}
        <CardTitle className="text-center text-5xl">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-center text-xl">{subtitle}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 px-0">{children}</CardContent>
      {footer && <CardFooter className="flex flex-col gap-2 pt-0 px-0">{footer}</CardFooter>}
    </Card>
  );
}
