"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface CanvasErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[3d] scene failed", error, info.componentStack);
    this.props.onError();
  }

  render(): ReactNode {
    return this.state.hasError ? null : this.props.children;
  }
}