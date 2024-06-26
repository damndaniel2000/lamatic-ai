// App.tsx
import React, { ReactNode } from "react";
import { FlowNode } from "../utils/types";
import { Button } from "./ui/button";
import { nameToKeyMap } from "@/utils/utils";
import SaveDialog from "./SaveDialog";
import SaveTemplateDialog from "./SaveAsTemplateDialog";
import ImportTemplateDialog from "./ImportDialog";
import { Code, Diamond, File, Image, Webhook } from "lucide-react";

const ICON_SIZE = 16;
const data: FlowNode[] = [
  {
    title: "FLOW",
    items: [
      { name: "API", icon: <Webhook size={ICON_SIZE} /> },
      { name: "Code", icon: <Code size={ICON_SIZE} /> },
      { name: "Condition", icon: <Diamond size={ICON_SIZE} /> },
      { name: "File", icon: <File size={ICON_SIZE} /> },
      { name: "Image", icon: <Image size={ICON_SIZE} /> },
    ],
  },
];

type SidebarComponentTypes = {
  workflowName: string;
  onWorkflowSave: () => void;
};

const Sidebar: React.FC<SidebarComponentTypes> = ({
  workflowName,
  onWorkflowSave,
}) => {
  return (
    <div className="p-4 w-[280px] relative mx-auto bg-card h-full rounded-md border border-gray-300 shadow-md overflow-hidden">
      {workflowName.length > 0 && (
        <div className="mb-3 font-semibold">{workflowName}</div>
      )}
      <div className="flex flex-col space-y-4">
        {data.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            items={section.items}
          />
        ))}
      </div>
      <div className="absolute left-0 bottom-4 w-full px-4">
        <div className="grid grid-cols-2 gap-x-3">
          <ImportTemplateDialog />
          <SaveDialog
            onSaveComplete={onWorkflowSave}
            workflowName={workflowName}
          />
        </div>
        <SaveTemplateDialog />
      </div>
    </div>
  );
};

const Section: React.FC<FlowNode> = ({ title, items }) => {
  return (
    <div>
      <h2 className="text-gray-400 text-xs tracking-wider font-semibold mb-2">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <Node
            key={index}
            name={item.name}
            icon={item.icon}
            title={title}
          />
        ))}
      </div>
    </div>
  );
};

interface NodeProps {
  name: string;
  icon?: ReactNode;
  title: string;
}

const Node: React.FC<NodeProps> = ({ name, icon, title }) => {
  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/nodeType", nameToKeyMap[nodeType]);
    event.dataTransfer.setData("application/nodeLabel", nodeType);

    event.dataTransfer.effectAllowed = "move";
  };

  const getButtonColor = (title: string) => {
    switch (title) {
      case "FLOW":
        return "border-red-200";
      case "INTEGRATIONS":
        return "border-green-200";
      default:
        return "";
    }
  };
  return (
    <Button
      className={`text-gray-600 text-xs ${getButtonColor(title)}`}
      variant="outline"
      size="sm"
      onDragStart={(e) => onDragStart(e, name)}
      draggable
    >
      <div className="flex items-center w-full">
        <div className="mr-2">{icon}</div>
        {name}
      </div>
    </Button>
  );
};

export default Sidebar;
