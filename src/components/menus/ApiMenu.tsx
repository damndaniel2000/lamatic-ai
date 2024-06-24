import React, { useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const requestTypes = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PATCH", label: "PATCH" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

type ApiMenuProps = {
  updateNodeData: (newData: object) => void;
  nodeData: {
    label: string;
    route: string;
    headers: string;
    payload: string;
    requestType: string;
  };
  onClose: () => void;
};

const ApiMenu = ({ updateNodeData, nodeData, onClose }: ApiMenuProps) => {
  const [tempNodeData, setTempNodeData] = useState(nodeData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempNodeData({ ...tempNodeData, [name]: value });
  };

  const handleRequestTypeChange = (value: string) => {
    setTempNodeData({ ...tempNodeData, requestType: value });
  };

  const handleSaveClick = () => {
    updateNodeData(tempNodeData);
    onClose();
  };

  const handleCancelClick = () => {
    setTempNodeData(nodeData);
    onClose();
  };

  return (
    <div className="space-y-4">
      <Input
        name="label"
        value={tempNodeData.label}
        onChange={handleChange}
        placeholder="Node Name"
      />

      <Input
        name="route"
        value={tempNodeData.route}
        onChange={handleChange}
        placeholder="API Route"
      />

      <Select
        onValueChange={handleRequestTypeChange}
        value={tempNodeData.requestType}
      >
        <SelectTrigger>
          {tempNodeData.requestType
            ? requestTypes.find(
                (type) => type.value === tempNodeData.requestType
              )?.label
            : "Select Request Type"}
        </SelectTrigger>
        <SelectContent>
          {requestTypes.map((type) => (
            <SelectItem
              key={type.value}
              value={type.value}
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        name="headers"
        value={tempNodeData.headers}
        onChange={handleChange}
        placeholder="Headers (JSON format)"
        rows={3}
      />

      <Textarea
        name="payload"
        value={tempNodeData.payload}
        onChange={handleChange}
        placeholder="Payload (JSON format)"
        rows={3}
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
          disabled={!tempNodeData.label || !tempNodeData.route}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ApiMenu;
