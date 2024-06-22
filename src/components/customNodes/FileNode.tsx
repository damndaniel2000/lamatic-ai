import React, { useCallback, useRef, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { File, Trash2, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface CustomFileNodeProps {
  onDelete: (id: string) => void;
  updateNodeData: (id: string, newData: object) => void;
}

type ExtendedNodeProps = NodeProps & CustomFileNodeProps;

const CustomFileNode: React.FC<ExtendedNodeProps> = ({
  id,
  data,
  updateNodeData,
  onDelete,
}) => {
  const [fileName, setFileName] = useState<string>(data.fileName || "");
  const [fileSize, setFileSize] = useState<number>(data.fileSize || 0);
  const [fileData, setFileData] = useState<string | null>(
    data.fileData || null
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileDataUrl = reader.result as string;
          setFileData(fileDataUrl);
          setFileName(file.name);
          setFileSize(file.size);
          updateNodeData(id, {
            fileData: fileDataUrl,
            fileName: file.name,
            fileSize: file.size,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [id, updateNodeData]
  );

  return (
    <div
      className="bg-white shadow-md rounded-md p-4 border border-gray-300 flex items-center justify-center relative"
      onClick={() => fileRef.current?.click()}
    >
      <Handle
        type="target"
        position={Position.Top}
      />
      <Handle
        type="source"
        position={Position.Bottom}
      />
      {fileData ? (
        <div className="w-[320px] flex flex-col justify-center">
          <div className="mt-2 space-x-3 flex items-center justify-between">
            <div>
              <File />
            </div>
            <div>
              <div className="truncate w-[220px]">{fileName}</div>
              <div className="text-sm opacity-40">
                {(fileSize / 1024).toFixed(2)} KB
              </div>
            </div>
            <Button
              variant="ghost"
              className="rounded-full"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <Trash2 className="text-primary" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-[280px] py-6 border border-dashed border-gray-400 rounded-md hover:border-primary items-center text-center">
          <div className="flex items-center space-x-4">
            <Upload className="" />
            <div className="">Upload a file</div>
          </div>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
};

export default CustomFileNode;
