"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { TaskForm } from "@/components/tasks/task-form";

export function NewTaskButton({
  label = "New task",
  defaultProjectId,
}: {
  label?: string;
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="hover:-translate-y-px">
        <PlusIcon width={17} height={17} />
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create new task"
        description="Add the details below. You can change them later."
        size="lg"
      >
        <TaskForm
          defaults={defaultProjectId ? { projectId: defaultProjectId } : undefined}
          onCancel={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </Modal>
    </>
  );
}
