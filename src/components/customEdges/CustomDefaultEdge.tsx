import { CircleX } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "reactflow";

const CustomDefaultEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: "#000", strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute transform h-fit -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{ left: labelX, top: labelY }}
        >
          <div className="bg-white rounded-full">
            <div
              className="cursor-pointer h-f bg-transparent border-none text-red-500"
              onClick={() => {
                setEdges((es) => es.filter((e) => e.id !== id));
              }}
            >
              <CircleX size={24} />
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomDefaultEdge;
