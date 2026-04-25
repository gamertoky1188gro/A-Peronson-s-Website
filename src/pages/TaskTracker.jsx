import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Check, X } from "lucide-react";
import tasksData from "../tasks.json";

function TreeNode({ task, onToggle, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = task.children && task.children.length > 0;
  const allDone = hasChildren && task.children.every((c) => c.isCompleted);

  const handleCheckbox = (e) => {
    e.stopPropagation();
    onToggle(task.id, !task.isCompleted);
  };

  const handleParentToggle = (e) => {
    e.stopPropagation();
    const newState = !allDone;
    task.children.forEach((child) => onToggle(child.id, newState));
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
          task.isCompleted
            ? "opacity-60"
            : ""
        }`}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}

        <button
          onClick={hasChildren ? handleParentToggle : handleCheckbox}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            allDone || task.isCompleted
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
          }`}
        >
          {(allDone || task.isCompleted) && <Check className="w-3 h-3" />}
        </button>

        <span
          className={`font-medium ${
            task.isCompleted ? "line-through text-slate-400" : ""
          }`}
        >
          {task.title}
        </span>

        {task.isCompleted && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Done
          </span>
        )}

        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-blue-500 hover:underline ml-2"
          >
            {task.link}
          </a>
        )}

        {task.issues && task.issues.length > 0 && (
          <span className="text-xs text-orange-500 ml-auto">
            {task.issues.length} issues
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="border-l border-slate-200 dark:border-slate-700 ml-6">
          {task.children.map((child) => (
            <TreeNode
              key={child.id}
              task={child}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskTracker() {
  const [tasks, setTasks] = useState(tasksData.tasks);
  const [saveStatus, setSaveStatus] = useState("");
  const [filter, setFilter] = useState("all");
  const [collapsedRoots, setCollapsedRoots] = useState({});

  const toggleTask = (id, isCompleted) => {
    const updateTasks = (taskList) =>
      taskList.map((task) => {
        if (task.id === id) {
          return { ...task, isCompleted };
        }
        if (task.children) {
          return { ...task, children: updateTasks(task.children) };
        }
        return task;
      });

    setTasks((prev) => updateTasks(prev));
  };

  useEffect(() => {
    const saveTasks = async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks, projectName: tasksData.projectName }),
        });
        if (response.ok) {
          setSaveStatus("Saved");
          setTimeout(() => setSaveStatus(""), 2000);
        }
      } catch {
        const blob = new Blob(
          [JSON.stringify({ tasks, projectName: tasksData.projectName }, null, 2)],
          { type: "application/json" },
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tasks.json";
        a.click();
        URL.revokeObjectURL(url);
        setSaveStatus("Downloaded");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    };

    const timer = setTimeout(saveTasks, 500);
    return () => clearTimeout(timer);
  }, [tasks]);

  const totalTasks = tasks.reduce(
    (acc, t) => acc + 1 + (t.children?.length || 0),
    0,
  );
  const completedTasks = tasks.reduce(
    (acc, t) =>
      acc +
      (t.isCompleted ? 1 : 0) +
      (t.children?.filter((c) => c.isCompleted).length || 0),
    0,
  );
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleRoot = (id) => {
    setCollapsedRoots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "pending"
        ? tasks.map((t) => ({
            ...t,
            children: t.children?.filter((c) => !c.isCompleted),
          })).filter((t) => t.children?.length > 0 || !t.isCompleted)
        : tasks.map((t) => ({
            ...t,
            children: t.children?.filter((c) => c.isCompleted),
          })).filter((t) => t.children?.length > 0 || t.isCompleted);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {tasksData.projectName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Task Progress Tracker
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {completedTasks} / {totalTasks} completed
              </div>
              <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {saveStatus && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div
                className="flex items-center gap-2 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                onClick={() => toggleRoot(task.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRoot(task.id);
                  }}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                >
                  {collapsedRoots[task.id] ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const allDone = task.children?.every((c) => c.isCompleted);
                    task.children?.forEach((c) =>
                      toggleTask(c.id, !allDone),
                    );
                  }}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    task.children?.every((c) => c.isCompleted)
                      ? "bg-blue-600 border-blue-600 text-white"
                      : task.isCompleted
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {(task.children?.every((c) => c.isCompleted) ||
                    task.isCompleted) && <Check className="w-4 h-4" />}
                </button>
                <span className="font-semibold text-lg flex-1">
                  {task.title}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {task.children?.length || 0} tasks
                </span>
              </div>

              {!collapsedRoots[task.id] && (
                <div className="px-4 pb-4">
                  {task.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 px-2">
                      {task.description}
                    </p>
                  )}
                  <div className="border-l border-slate-200 dark:border-slate-700 ml-3">
                    {task.children?.map((child) => (
                      <TreeNode
                        key={child.id}
                        task={child}
                        onToggle={toggleTask}
                        depth={1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}