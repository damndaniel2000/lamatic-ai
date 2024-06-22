import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { toPng } from "html-to-image";
import { FileToUpload } from "@/utils/types";
import { getGitFiles, uploadFile } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { convertToCamelCase } from "@/utils/utils";

const imageWidth = 2000;
const imageHeight = 750;

const SaveTemplateDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { getNodes, toObject } = useReactFlow();
  const { toast } = useToast();

  const onClose = () => {
    setIsOpen(false);
  };

  // Function to generate an image of the current flow
  const generateImage = useCallback(() => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    const viewPort = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;

    if (!viewPort) return;

    toPng(viewPort, {
      backgroundColor: "#1a365d",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString() + "px",
        height: imageHeight.toString() + "px",
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then((res) => setImageData(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNodes]);

  // Function to save the template
  const saveTemplate = async () => {
    setIsSaving(true);
    try {
      const folderName = templateName;

      // Get the current flow structure
      const flowStructure = toObject();

      // Create JSON content with template name, description, and flow structure
      const jsonContent = JSON.stringify(
        {
          templateName,
          templateDescription,
          flowStructure,
          previewImage: imageData,
        },
        null,
        2
      );

      // Create JSON file
      const jsonFile: FileToUpload = {
        name: convertToCamelCase(templateName) + ".json",
        content: jsonContent,
      };

      // Array of files to upload
      const filesToUpload = [jsonFile];

      await uploadFile(filesToUpload, folderName);
      toast({
        variant: "success",
        title: "Template saved successfully",
      });
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Effect to generate image when the dialog opens
  useEffect(() => {
    getGitFiles().then((res) => console.log(res));
    if (isOpen) {
      generateImage();
    }
  }, [isOpen, generateImage]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger>
        <div className="text-[12px] text-blue-500 cursor-pointer mt-2 ml-1">
          Save as template?
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Provide a name and description for your template.
          </DialogDescription>
        </DialogHeader>
        {imageData && (
          <img
            className="rounded-md"
            src={imageData}
            alt="Generated"
          />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveTemplate();
          }}
          className="space-y-4 mt-4"
        >
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Name"
            required
          />
          <Textarea
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onClose}
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              className="w-24"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateDialog;
