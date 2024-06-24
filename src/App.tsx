import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeProps,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import NodeWrapper from "./components/NodeWrapper";
import CodeMenu from "./components/menus/CodeMenu";
import { Toaster } from "./components/ui/toaster";
import { Code, Diamond, Webhook } from "lucide-react";
import CustomImageNode from "./components/customNodes/ImageNode";
import CustomFileNode from "./components/customNodes/FileNode";
import CustomConditionNode from "./components/customNodes/ConditionNode";
import ConditionMenu from "./components/menus/ConditionMenu";
import ApiMenu from "./components/menus/ApiMenu";
import CustomConditionEdge from "./components/customEdges/CustomConditionEdge";
import CustomDefaultEdge from "./components/customEdges/CustomDefaultEdge";

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [workflowName, setWorkFlowName] = useState<string>("");

  const updateNodeData = (id: string, newData: object) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  const nodeTypes = useMemo(
    () => ({
      code: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<Code />}
          onDelete={onDelete}
          popoverContent={CodeMenu}
          updateNodeData={updateNodeData}
        />
      ),
      api: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<Webhook />}
          onDelete={onDelete}
          popoverContent={ApiMenu}
          updateNodeData={updateNodeData}
        />
      ),
      condition: (props: NodeProps) => (
        <CustomConditionNode
          {...props}
          icon={<Diamond />}
          onDelete={onDelete}
          popoverContent={ConditionMenu}
          updateNodeData={updateNodeData}
        />
      ),
      file: (props: NodeProps) => (
        <CustomFileNode
          onDelete={onDelete}
          updateNodeData={updateNodeData}
          {...props}
        />
      ),
      image: (props: NodeProps) => (
        <CustomImageNode
          onDelete={onDelete}
          updateNodeData={updateNodeData}
          {...props}
        />
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const edgeTypes = {
    default: CustomDefaultEdge,
    condition: CustomConditionEdge,
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      let nodeParams = { ...params, type: "default" };

      if (nodeParams.sourceHandle) {
        const condition = params.sourceHandle === "if" ? "if" : "else";
        nodeParams = {
          ...params,
          type: "condition",
          data: { condition },
        };
      }
      setEdges((eds) => addEdge(nodeParams, eds));
    },
    [setEdges]
  );

  const onDelete = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData("application/nodeType");
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const nodeLabel = event.dataTransfer.getData("application/nodeLabel");

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          isNew: true,
          label: nodeLabel,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleLoadContent = useCallback(() => {
    const savedData = localStorage.getItem("savedFlow");
    if (savedData) {
      const { structure, name } = JSON.parse(savedData);
      setNodes(structure.nodes || []);
      setEdges(structure.edges || []);
      setWorkFlowName(name);

      const maxId = structure.nodes.reduce((max: number, node: Node) => {
        const nodeId = parseInt(node.id.split("_")[1], 10);
        return nodeId > max ? nodeId : max;
      }, 0);
      id = maxId + 1;
    }
  }, [setEdges, setNodes]);

  useEffect(() => {
    handleLoadContent();
  }, [handleLoadContent]);

  return (
    <div className="h-screen w-screen flex justify-end bg-[#f5f3f1]">
      <Toaster />
      <ReactFlowProvider>
        <div className="absolute z-50 h-[calc(100vh-80px)]  top-10 left-4 ">
          <Sidebar
            onWorkflowSave={handleLoadContent}
            workflowName={workflowName}
          />
        </div>
        <div
          className="h-full w-[calc(100vw-300px)]"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 0.8,
            }}
          >
            <Controls />

            <Background
              color="#f5f3f1"
              gap={0}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
