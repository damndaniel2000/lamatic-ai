import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

interface ConditionFormProps {
  nodeData: {
    label: string;
    condition: string;
    variable: string;
    value: string;
  };
  updateNodeData: (newData: object) => void;
  onClose: () => void;
}

interface Option {
  value: string;
  label: string;
}

const ConditionMenu: React.FC<ConditionFormProps> = ({
  nodeData,
  updateNodeData,
  onClose,
}) => {
  const {
    variable: initialVariable,
    condition: initialCondition,
    value: initialValue,
  } = nodeData;

  const [variable, setVariable] = useState<string>(initialVariable || "");
  const [condition, setCondition] = useState<string>(initialCondition || "");
  const [value, setValue] = useState<string>(initialValue || "");

  const variables: Option[] = [
    { value: "a", label: "Variable A" },
    { value: "b", label: "Variable B" },
    { value: "c", label: "Variable C" },
  ];

  const conditions: Option[] = [
    { value: "greater", label: "Greater than" },
    { value: "equal", label: "Equal to" },
    { value: "less", label: "Less than" },
  ];

  const getVariableOptions = (): Option[] => {
    return variables.filter((v) => v.value !== variable);
  };

  const values: Record<string, Option[]> = {
    a: getVariableOptions(),
    b: getVariableOptions(),
    c: getVariableOptions(),
  };

  useEffect(() => {
    // Reset condition and value when variable changes
    setCondition(initialCondition || "");
    setValue(initialValue || "");
  }, [variable, initialCondition, initialValue]);

  const handleSave = () => {
    updateNodeData({ variable, condition, value });
    onClose();
  };

  return (
    <div className="px-4 py-2">
      <div className="mb-4">
        <label
          htmlFor="variable"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Variable
        </label>
        <Select
          onValueChange={setVariable}
          value={variable}
        >
          <SelectTrigger>
            {variable
              ? variables.find((v) => v.value === variable)?.label
              : "Select variable"}
          </SelectTrigger>
          <SelectContent>
            {variables.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Condition
        </label>
        <Select
          onValueChange={setCondition}
          value={condition}
        >
          <SelectTrigger>
            {condition
              ? conditions.find((c) => c.value === condition)?.label
              : "Select condition"}
          </SelectTrigger>
          <SelectContent>
            {conditions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="value"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Value
        </label>
        <Select
          onValueChange={setValue}
          value={value}
        >
          <SelectTrigger>
            {value
              ? values[variable]?.find((val) => val.value === value)?.label
              : "Select value"}
          </SelectTrigger>
          <SelectContent>
            {values[variable]?.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          className="mr-2 w-20"
          size="sm"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="w-20"
          size="sm"
          onClick={handleSave}
          disabled={!variable || !condition || !value}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ConditionMenu;
