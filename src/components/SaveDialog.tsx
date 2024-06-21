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

const SaveDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentName, setContentName] = useState("");

  const handleSaveContent = () => {
    // Add your save content logic here
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger
          className="w-full"
          asChild
        >
          <Button size="sm">Save</Button>
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
