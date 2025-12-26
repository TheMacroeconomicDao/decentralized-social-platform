"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Функциональная обертка для класс-компонента ErrorBoundary
// В Next.js 15 нужно использовать функциональную обертку для класс-компонентов
// в серверных компонентах, чтобы избежать ошибки "Cannot read properties of undefined"
export function ErrorBoundaryWrapper({
  children,
  fallback,
}: ErrorBoundaryWrapperProps) {
  // Используем JSX напрямую - React.createElement может вызывать проблемы
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;
