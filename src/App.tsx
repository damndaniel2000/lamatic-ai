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
} from "reactflow";

import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import NodeWrapper from "./components/NodeWrapper";
import CodeMenu from "./components/menus/CodeMenu";
import { camelCaseToSentenceCase } from "./utils/utils";
import { Toaster } from "./components/ui/toaster";
import { Code, Diamond, File, Image, Webhook } from "lucide-react";
import { IconDrive, IconGithub, IconSlack } from "./utils/icons";
//
let id = 0;
const getId = () => `dndnode_${id++}`;

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

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
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          popoverContent={CodeMenu}
          updateNodeData={updateNodeData}
        />
      ),
      api: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<Webhook />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
      condition: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<Diamond />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
      file: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<File />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
      image: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<Image />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
      googleDrive: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<IconDrive />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
      slack: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<IconSlack />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
      github: (props: NodeProps) => (
        <NodeWrapper
          {...props}
          icon={<IconGithub />}
          onClick={() => console.log("CLICKED")}
          onDelete={onDelete}
          updateNodeData={updateNodeData}
        />
      ),
    }),
    []
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
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

      const type = event.dataTransfer.getData("application/reactflow");
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { isNew: true, label: camelCaseToSentenceCase(type) },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleLoadContent = useCallback(() => {
    const savedData = localStorage.getItem("savedFlow");
    if (savedData) {
      const { structure } = JSON.parse(savedData);
      setNodes(structure.nodes || []);
      setEdges(structure.edges || []);
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
          <Sidebar />
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
