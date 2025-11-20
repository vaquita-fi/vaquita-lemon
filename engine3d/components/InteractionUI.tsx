"use client";

import { useState } from "react";
import { useWorldStore } from "../stores/worldStore";

interface InteractionModalProps {
  element: any;
  isOpen: boolean;
  onClose: () => void;
}

function InteractionModal({ element, isOpen, onClose }: InteractionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Interacting with {element.type}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-gray-700 dark:text-gray-300">
            <p>
              You are interacting with a <strong>{element.type}</strong>.
            </p>
            {element.properties.resourceType && (
              <p>
                Resource type:{" "}
                <strong>{element.properties.resourceType}</strong>
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                console.log("Performing interaction with", element);
                // Aquí puedes agregar la lógica de interacción específica
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Confirm Interaction
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InteractionUI() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const playerInteraction = useWorldStore((s) => s.playerInteraction);
  const nearbyElements = playerInteraction.nearbyElements;

  const handleInteract = (element: any) => {
    setSelectedElement(element);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedElement(null);
  };

  if (nearbyElements.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/80 text-white rounded-lg p-4 min-w-[300px]">
        <h3 className="text-lg font-bold mb-2">Elements Nearby</h3>
        <div className="space-y-2">
          {nearbyElements.map((element) => (
            <div
              key={element.id}
              className="flex items-center justify-between p-2 bg-white/10 rounded"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    element.type === "tree"
                      ? "bg-green-500"
                      : element.type === "rock"
                        ? "bg-gray-500"
                        : element.type === "bush"
                          ? "bg-green-400"
                          : element.type === "ore"
                            ? "bg-blue-500"
                            : element.type === "water"
                              ? "bg-blue-400"
                              : "bg-yellow-500"
                  }`}
                />
                <span className="capitalize">{element.type}</span>
                {element.properties.resourceType && (
                  <span className="text-sm text-gray-300">
                    ({element.properties.resourceType})
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {element.properties.harvestable && (
                  <button className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs">
                    Harvest
                  </button>
                )}
                {element.properties.interactable && (
                  <button
                    onClick={() => handleInteract(element)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                  >
                    Interact
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <InteractionModal
        element={selectedElement}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
