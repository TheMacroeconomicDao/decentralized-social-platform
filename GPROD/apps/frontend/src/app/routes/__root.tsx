import type { RootRoute } from "@tanstack/react-router";
import { createRootRoute } from "@tanstack/react-router"
import { MainLayout } from "../layouts/main-layout/MainLayout";

export const Route: RootRoute = createRootRoute({
  component: MainLayout,
})