import React, { useCallback, useEffect, useRef, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Trash2, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface CustomImageNodeProps {
  onDelete: (id: string) => void;
  updateNodeData: (id: string, newData: object) => void;
}

type ExtendedNodeProps = NodeProps & CustomImageNodeProps;

const CustomImageNode: React.FC<ExtendedNodeProps> = ({
  id,
  data,
  updateNodeData,
  onDelete,
}) => {
  const [image, setImage] = useState<string | null>(data.image || null);
  const [imageName, setImageName] = useState<string>(data.imageName || "");
  const [imageSize, setImageSize] = useState<number>(data.imageSize || 0);
  const fileRef = useRef<HTMLInputElement>(null);

  const onImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageDataUrl = reader.result as string;
          setImage(imageDataUrl);
          setImageName(file.name);
          setImageSize(file.size);
          updateNodeData(id, {
            image: imageDataUrl,
            imageName: file.name,
            imageSize: file.size,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [id, updateNodeData]
  );

  useEffect(() => {
    const storedData = localStorage.getItem(id);
    if (storedData) {
      const { image, imageName, imageSize } = JSON.parse(storedData);
      setImage(image);
      setImageName(imageName);
      setImageSize(imageSize);
      updateNodeData(id, { image, imageName, imageSize });
    }
  }, [id, updateNodeData]);

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
      {image ? (
        <div className="w-60 flex flex-col justify-center">
          <img
            src={image}
            alt="Uploaded"
            className="max-w-full max-h-full object-contain"
          />
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div>{imageName}</div>
              <div className="text-sm opacity-40">
                {(imageSize / 1024).toFixed(2)} KB
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
            <div className="">Upload an image</div>
          </div>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  );
};

export default CustomImageNode;
