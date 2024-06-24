import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Ensure this import path matches your setup
import { Button } from "./ui/button";
import { useReactFlow } from "reactflow";
import { useToast } from "./ui/use-toast";

type SaveDialogTypes = {
  workflowName: string;
  onSaveComplete?: () => void;
};

const SaveDialog: React.FC<SaveDialogTypes> = ({
  workflowName,
  onSaveComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentName, setContentName] = useState("");

  const { toObject } = useReactFlow();
  const { toast } = useToast();

  const handleSaveContent = () => {
    const flowStructure = toObject();
    const saveData = {
      name: workflowName.length > 0 ? workflowName : contentName,
      structure: flowStructure,
    };

    localStorage.setItem("savedFlow", JSON.stringify(saveData));
    toast({
      variant: "success",
      title: "Workflow saved",
    });

    setIsOpen(false);

    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  const handleButtonClick = () => {
    const existingData = localStorage.getItem("savedFlow");

    if (existingData) {
      handleSaveContent();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div>
      <Button
        size="sm"
        onClick={handleButtonClick}
        className="w-full"
      >
        Save
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger
          className="w-full"
          asChild
        >
          <div />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Workflow</DialogTitle>
            <DialogDescription>
              Enter a name for your workflow
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveContent();
            }}
            className="space-y-4"
          >
            <Input
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              placeholder="Name"
              required
            />

            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className="w-20"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                className="w-20"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SaveDialog;
