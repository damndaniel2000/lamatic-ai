import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Trash2 } from "lucide-react";

interface CustomNodeProps {
  icon: ReactNode;
  onClick: () => void;
  onDelete: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popoverContent?: ComponentType<any>;
  updateNodeData: (id: string, newData: object) => void;
}

type ExtendedNodeProps = NodeProps & CustomNodeProps;

const CustomConditionNode: React.FC<ExtendedNodeProps> = ({
  icon,
  onClick,
  onDelete,
  popoverContent: PopoverContentComponent,
  updateNodeData,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (rest.data.isNew) {
      setIsOpen(true);
      rest.data.isNew = false;
    }
  }, [rest.data]);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Popover
        open={isOpen}
        onOpenChange={(val) => setIsOpen(val)}
      >
        <PopoverTrigger className="w-full">
          <div
            onClick={onClick}
            className="px-3 py-4 rounded-md bg-white w-[260px] shadow-md p-4 border border-gray-300"
          >
            <div className="flex justify-between w-full items-center">
              <div className="flex justify-start items-center">
                <div className="mr-2">{icon}</div>
                <div className="truncate w-[160px] text-left font-bold">
                  {rest.data.label}
                </div>
              </div>
              <Button
                variant="ghost"
                className="rounded-full"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(rest.id);
                }}
              >
                <Trash2 className="text-primary" />
              </Button>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {PopoverContentComponent ? (
            <PopoverContentComponent
              updateNodeData={(newData: object) => {
                updateNodeData(rest.id, newData);
              }}
              onClose={() => setIsOpen(false)}
              nodeData={{ ...rest.data }}
            />
          ) : (
            "Place content for the popover here."
          )}
        </PopoverContent>
      </Popover>
      <Handle
        type="source"
        id="if"
        position={Position.Left}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        id="else"
        position={Position.Right}
        style={{ background: "#555" }}
      />
    </>
  );
};

export default CustomConditionNode;
