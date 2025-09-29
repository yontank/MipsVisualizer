import React from 'react'
import { type Node } from "@xyflow/react"

export type MuxNodeData = {
    label: string,
}


interface TrapezoidProps {
    borderColor?: string;
    bgColor?: string;
    borderWidth?: number; // in pixels
    height?: string;
    width?: string;
}

const Trapezoid: React.FC<TrapezoidProps> = ({
    borderColor = 'bg-black',
    bgColor = 'bg-blue-500',
    borderWidth = 4,
    height = '150px',
    width = '300px',
}) => {
    const outerClipPath = 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)';
    const innerClipPath = 'polygon(12% 0%, 88% 0%, 98% 100%, 2% 100%)'; // slightly smaller to simulate border

    return (
        <div
            className={`relative ${borderColor}`}
            style={{
                height,
                width,
                clipPath: outerClipPath,
            }}
        >
            <div
                className={`absolute top-0 left-0 w-full h-full ${bgColor}`}
                style={{
                    clipPath: innerClipPath,
                    margin: `${borderWidth}px`,
                }}
            />
        </div>
    );
};




export type BlackBoxNode = Node<MuxNodeData, 'MuxNodeData'>;
function Mux() {
    return (
        <Trapezoid borderWidth={0} />

    )
}

export default Mux