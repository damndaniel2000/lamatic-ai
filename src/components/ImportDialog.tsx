import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getGitFiles } from "@/utils/api";
import { Edge, Node, useReactFlow } from "reactflow";

interface Template {
  templateName: string;
  templateDescription: string;
  previewImage: string;
  flowStructure: {
    nodes: Node[];
    edges: Edge[];
  };
}

const imageWidth = 800;
const imageHeight = 200;

const ImportTemplateDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    const fetchTemplates = async () => {
      const files = await getGitFiles();
      if (files) {
        const parsedTemplates: Template[] = files
          .map((file) => {
            try {
              const parsedContent = JSON.parse(file.content);
              return parsedContent;
            } catch (error) {
              console.error(`Error parsing file content`, error);
              return null; // Return null if parsing fails
            }
          })
          .filter((parsedContent) => parsedContent !== null); // Filter out null values

        setTemplates(parsedTemplates);
      }
    };

    fetchTemplates();
  }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  const onImport = () => {
    if (selectedTemplate) {
      const selected = templates.find(
        (template) => template.templateName === selectedTemplate
      );
      if (selected) {
        const { flowStructure } = selected;
        setNodes(flowStructure.nodes);
        setEdges(flowStructure.edges);
        console.log(`Imported template: ${selectedTemplate}`);
        onClose();
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger
        className="w-full"
        asChild
      >
        <Button
          size="sm"
          variant="outline"
        >
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
          <DialogDescription>
            Click to select and then import a template
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`relative p-2 border rounded-md cursor-pointer ${
                selectedTemplate === template.templateName
                  ? "border-primary"
                  : "border-slate-200"
              }`}
              onClick={() => setSelectedTemplate(template.templateName)}
            >
              <img
                src={template.previewImage}
                alt={template.templateName}
                className="rounded-md"
                style={{
                  width: imageWidth,
                  height: imageHeight,
                }}
              />
              <div className="mt-3">
                <div className="text-sm font-bold">{template.templateName}</div>
                <div className="text-[12px]">
                  {template.templateDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="w-20"
          >
            Close
          </Button>
          <Button
            size="sm"
            onClick={onImport}
            className="w-20"
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTemplateDialog;
