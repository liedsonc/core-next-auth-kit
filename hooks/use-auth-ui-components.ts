"use client";

import type { AuthUIComponents } from "../types";
import { useAuthUIConfig } from "../context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

const defaultComponents: AuthUIComponents = {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

export function useAuthUIComponents(): AuthUIComponents {
  const config = useAuthUIConfig();
  return config.components ?? defaultComponents;
}
