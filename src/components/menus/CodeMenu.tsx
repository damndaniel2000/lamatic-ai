import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type CodeMenuProps = {
  updateNodeData: (newData: object) => void;
  nodeData: {
    label: string;
    code: string;
  };
};

const CodeMenu = ({ updateNodeData, nodeData }: CodeMenuProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateNodeData({ [name]: value });
  };

  return (
    <div>
      <Input
        name="label"
        defaultValue={nodeData.label}
        onChange={handleChange}
        placeholder="Node Name"
      />
      <Textarea
        name="code"
        onChange={handleChange}
        defaultValue={nodeData.code}
        className="mt-3"
        placeholder="Write Code Here"
      />
    </div>
  );
};

export default CodeMenu;
