"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ProjectRef, ShellUser } from "@/types";

type Workspace = {
  user: ShellUser;
  projects: ProjectRef[];
  assignees: string[];
  preview: boolean;
};

const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({ value, children }: { value: Workspace; children: ReactNode }) {
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
