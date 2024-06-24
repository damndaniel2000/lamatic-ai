import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CodeEditor from "../CodeEditor";

type CodeMenuProps = {
  updateNodeData: (newData: object) => void;
  nodeData: {
    label: string;
    code: string;
  };
  onClose: () => void;
};

const CodeMenu: React.FC<CodeMenuProps> = ({
  updateNodeData,
  nodeData,
  onClose,
}) => {
  const [tempNodeData, setTempNodeData] = useState(nodeData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempNodeData({ ...tempNodeData, [name]: value });
  };

  const handleSaveClick = () => {
    updateNodeData(tempNodeData);
    onClose();
  };

  const handleCancelClick = () => {
    setTempNodeData(nodeData);
    onClose();
  };

  const isSaveDisabled = !tempNodeData.label || !tempNodeData.code;

  return (
    <div className="space-y-4">
      <Input
        name="label"
        value={tempNodeData.label}
        onChange={handleChange}
        placeholder="Node Name"
      />

      <CodeEditor
        value={tempNodeData.code}
        onValueChange={(code) => setTempNodeData({ ...tempNodeData, code })}
        maxRows={5}
      />
      <div className="flex justify-end">
        <Button
          className="mr-2 w-20"
          size="sm"
          variant="outline"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
        <Button
          className="w-20"
          size="sm"
          onClick={handleSaveClick}
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CodeMenu;
