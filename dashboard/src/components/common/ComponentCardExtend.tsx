import React from "react";
import { MdAddCircleOutline, MdOutlineRefresh, MdDelete } from "react-icons/md";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  features: (e: string) => void;
}

const ComponentCardExtend: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  features,
}) => {
  const handleFeature = (e: React.MouseEvent<HTMLButtonElement>) => {
    features(e.currentTarget.value);
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {/* Features: CREATE, REFRESH, DELETE & UPDATE */}
        <div className="features flex">
          {/* delete */}
          <button
            className="block rounded-lg bg-red-500 mr-5 p-3"
            type="button"
            value="delete"
            onClick={handleFeature}
          >
            <MdDelete className="size-6 text-white" />
          </button>
          {/* create */}
          <button
            className="block rounded-lg bg-cyan-500 mr-5 p-3"
            type="button"
            value="create"
            onClick={handleFeature}
          >
            <MdAddCircleOutline className="size-6 text-white" />
          </button>
          {/* refresh */}
          <button
            className="block rounded-lg bg-gray-700 p-3"
            type="button"
            value="refresh"
            onClick={handleFeature}
          >
            <MdOutlineRefresh className="size-6 text-white" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCardExtend;
