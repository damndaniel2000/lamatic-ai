import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Button } from "./ui/button";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Trash2 } from "lucide-react";

interface CustomNodeProps {
  icon: ReactNode;
  onDelete: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popoverContent?: ComponentType<any>;
  updateNodeData: (id: string, newData: object) => void;
}

type ExtendedNodeProps = NodeProps & CustomNodeProps;

const NodeWrapper: React.FC<ExtendedNodeProps> = ({
  icon,
  onDelete,
  popoverContent: PopoverContentComponent,
  updateNodeData,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (rest.data.isNew) {
      setIsOpen(true);
      delete rest.data.isNew;
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
          <div className="px-3 py-4 rounded-md bg-white w-[260px] shadow-md p-4 border border-gray-300">
            <div className="flex justify-between w-full items-center">
              <div className="flex justify-start items-center">
                <div className="mr-2">{icon}</div>
                <div className="truncate w-[160px] text-left font-bold">
                  {" "}
                  {rest.data.label}{" "}
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
              nodeData={{ ...rest.data }}
              onClose={onClose}
            />
          ) : (
            "Place content for the popover here."
          )}
        </PopoverContent>
      </Popover>
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};

export default NodeWrapper;
