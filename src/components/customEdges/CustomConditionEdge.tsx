import { CircleX } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "reactflow";

const CustomConditionEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeColor = data.condition === "if" ? "blue" : "green";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: edgeColor, strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          className="flex items-center absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-white p-1.5 rounded border border-gray-300 text-xs"
          style={{ left: labelX, top: labelY }}
        >
          <span className=" text-base ">{data.condition}</span>
          <div
            className="ml-2 cursor-pointer bg-transparent border-none text-red-500"
            onClick={() => {
              setEdges((es) => es.filter((e) => e.id !== id));
            }}
          >
            <CircleX size={20} />
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomConditionEdge;
