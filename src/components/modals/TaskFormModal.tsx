import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaTimes, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { CreateTaskPayload } from "@/src/service/api/task.service";
import { useGetAllEmployees } from "@/src/hooks/task/useCreateTask";

interface TaskOutline {
  id: number;
  text: string;
}

interface Employee {
  id: string;
  name: string;
  avatar: string;
  email?: string | null;
}

const pickFirstNonEmptyString = (...values: unknown[]): string | null => {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  return null;
};

interface TaskFormModalProps {
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

const priorities = ["Medium", "Low", "High", "Critical"];

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const {
    data: employeesResponse,
    isLoading: isLoadingEmployees,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetAllEmployees();

  const [step, setStep] = useState(1);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [outlines, setOutlines] = useState<TaskOutline[]>([]);
  const [priority, setPriority] = useState(priorities[0]);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const employeeSearchInputRef = useRef<HTMLInputElement | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const assignableEmployees = useMemo(() => {
    const rawEmployees = (employeesResponse as any)?.data ?? employeesResponse;
    if (!Array.isArray(rawEmployees)) return [] as Employee[];

    const seenIds = new Set<string>();
    const mapped: Employee[] = [];

    rawEmployees.forEach((item: any, index: number) => {
      const rawIdCandidate = item?.id ?? item?.user_id;
      const normalizedId =
        pickFirstNonEmptyString(
          typeof rawIdCandidate === "number"
            ? rawIdCandidate.toString()
            : rawIdCandidate,
          index.toString()
        ) ?? index.toString();

      if (seenIds.has(normalizedId)) {
        return;
      }
      seenIds.add(normalizedId);

      mapped.push({
        id: normalizedId,
        name:
          pickFirstNonEmptyString(item?.full_name, item?.name) ??
          "Unnamed Employee",
        avatar:
          pickFirstNonEmptyString(
            item?.profile_picture,
            item?.avatar_url,
            item?.avatar
          ) ?? "/user.png",
        email: pickFirstNonEmptyString(item?.email),
      });
    });

    return mapped;
  }, [employeesResponse]);

  const availableEmployees = useMemo(() => {
    if (assignableEmployees.length === 0) return [] as Employee[];
    return assignableEmployees.filter(
      (employee) =>
        !selectedEmployees.some((selected) => selected.id === employee.id)
    );
  }, [assignableEmployees, selectedEmployees]);

  useEffect(() => {
    if (employeeDropdownOpen) {
      const timeout = window.setTimeout(() => {
        employeeSearchInputRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    setEmployeeSearchTerm("");
    return undefined;
  }, [employeeDropdownOpen]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = employeeSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return availableEmployees;
    }

    return availableEmployees.filter((employee) => {
      const name = (employee.name ?? "").toLowerCase();
      const email = (employee.email ?? "").toLowerCase();
      return (
        name.includes(normalizedSearch) || email.includes(normalizedSearch)
      );
    });
  }, [availableEmployees, employeeSearchTerm]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Outline handlers
  const handleOutlineChange = (id: number, value: string) => {
    setOutlines((prev) =>
      prev.map((o) => (o.id === id ? { ...o, text: value } : o))
    );
  };
  const handleAddOutline = () => {
    setOutlines((prev) => [...prev, { id: Date.now(), text: "" }]);
  };
  const handleRemoveOutline = (id: number) => {
    setOutlines((prev) => prev.filter((o) => o.id !== id));
  };

  // Employee handlers
  const handleSelectEmployee = (emp: Employee) => {
    if (!selectedEmployees.find((e) => e.id === emp.id)) {
      setSelectedEmployees((prev) => [...prev, emp]);
    }
    setEmployeeDropdownOpen(false);
  };
  const handleRemoveEmployee = (id: string) => {
    setSelectedEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // Stepper
  const Stepper = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
            step === 1 ? "bg-[#692E9F]" : "bg-gray-200 text-gray-700"
          }`}
        >
          1
        </div>
        <span
          className={`font-semibold ${
            step === 1 ? "text-[#692E9F]" : "text-gray-400"
          }`}
        >
          Create
        </span>
      </div>
      <div className="w-8 h-1 bg-gray-200 mx-2 rounded-full" />
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
            step === 2 ? "bg-[#692E9F]" : "bg-gray-200 text-gray-700"
          }`}
        >
          2
        </div>
        <span
          className={`font-semibold ${
            step === 2 ? "text-[#692E9F]" : "text-gray-400"
          }`}
        >
          Assign employee
        </span>
      </div>
    </div>
  );

  // Form submit (mock)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload: CreateTaskPayload = {
      name: taskName.trim(),
      description: description.trim() || undefined,
      outline:
        outlines.length > 0
          ? outlines
              .map((outline) => outline.text.trim())
              .filter((text) => text.length > 0)
          : undefined,
      priority: priority.toLowerCase(),
      start_date: startDate || undefined,
      end_date: dueDate || undefined,
      employee_ids:
        selectedEmployees.length > 0
          ? selectedEmployees.map((emp) => emp.id)
          : undefined,
    };

    try {
      setFormError(null);
      await onSubmit(payload);
      setStep(1);
      setTaskName("");
      setDescription("");
      setOutlines([]);
      setPriority(priorities[0]);
      setStartDate("");
      setDueDate("");
      setSelectedEmployees([]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create task. Please try again.";
      setFormError(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-2 p-6 relative animate-fadeIn max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-2 mt-8 px-6 text-left">
          Create Task
        </h2>
        <Stepper />
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full px-6 space-y-6 pb-6">
            {formError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2 rounded-md">
                {formError}
              </div>
            )}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 mb-2"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 min-h-[60px] mb-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Outline
                  </label>
                  <div className="space-y-2">
                    {outlines.length === 0 ? (
                      <button
                        type="button"
                        onClick={handleAddOutline}
                        className="flex items-center gap-1 text-[#692E9F] font-medium mt-1"
                      >
                        <FaPlus /> Add outline
                      </button>
                    ) : (
                      <>
                        {outlines.map((outline, idx) => (
                          <div
                            key={outline.id}
                            className="flex items-center gap-2 relative"
                          >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 font-bold text-[#692E9F]">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              className="flex-1 border rounded-md px-3 py-2"
                              placeholder={`Enter ${
                                idx === 0
                                  ? "first"
                                  : idx === 1
                                  ? "second"
                                  : "next"
                              } requirement ...`}
                              value={outline.text}
                              onChange={(e) =>
                                handleOutlineChange(outline.id, e.target.value)
                              }
                              required
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOutline(outline.id)}
                              className="text-gray-400 hover:text-red-500 text-lg"
                            >
                              <FaTimes />
                            </button>
                            {/* Progress indicator */}
                            {idx < outlines.length - 1 && (
                              <span
                                className="absolute left-3 top-6 w-0.5 h-6 bg-gray-200"
                                style={{ zIndex: 0 }}
                              />
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddOutline}
                          className="flex items-center gap-1 text-[#692E9F] font-medium mt-1"
                        >
                          <FaPlus /> Add more outline
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 mb-2"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Start
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full border rounded-md px-3 py-2 pr-10"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Due
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full border rounded-md px-3 py-2 pr-10"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full border rounded-md px-3 py-2 text-left bg-white focus:outline-none focus:ring-2 focus:ring-[#692E9F]/40"
                      onClick={() =>
                        setEmployeeDropdownOpen((previous) => !previous)
                      }
                    >
                      <span className="text-gray-400">Search and select</span>
                    </button>
                    {employeeDropdownOpen && (
                      <div className="absolute left-0 right-0 bg-white border rounded-md shadow-lg mt-1 z-10">
                        <div className="p-2 border-b">
                          <input
                            ref={employeeSearchInputRef}
                            type="text"
                            value={employeeSearchTerm}
                            onChange={(event) =>
                              setEmployeeSearchTerm(event.target.value)
                            }
                            placeholder="Search employees by name or email"
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#692E9F]"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1">
                          {isLoadingEmployees && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Loading employees...
                            </div>
                          )}
                          {isEmployeesError && !isLoadingEmployees && (
                            <div className="px-3 py-2 text-sm text-red-500">
                              {employeesError instanceof Error
                                ? employeesError.message
                                : "Failed to load employees"}
                            </div>
                          )}
                          {!isLoadingEmployees &&
                            !isEmployeesError &&
                            (filteredEmployees.length === 0 ? (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                {availableEmployees.length === 0
                                  ? "No employees available"
                                  : `No matches for "${employeeSearchTerm.trim()}"`}
                              </div>
                            ) : (
                              filteredEmployees.map((emp) => (
                                <button
                                  key={emp.id}
                                  type="button"
                                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                                  onClick={() => handleSelectEmployee(emp)}
                                >
                                  <Image
                                    src={emp.avatar}
                                    alt={emp.name}
                                    width={28}
                                    height={28}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
                                      {emp.name}
                                    </span>
                                    {emp.email && (
                                      <span className="text-xs text-gray-500">
                                        {emp.email}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ))
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                      >
                        <Image
                          src={emp.avatar}
                          alt={emp.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-sm">{emp.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmployee(emp.id)}
                          className="ml-1 text-gray-400 hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Sticky action buttons */}
          <div className="sticky bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-2 z-10">
            {step === 1 && (
              <button
                type="button"
                className="w-full mt-4 bg-[#692E9F] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#5b23b6] transition"
                onClick={() => setStep(2)}
                disabled={
                  isSubmitting || !taskName.trim() || !startDate || !dueDate
                }
              >
                Continue
              </button>
            )}
            {step === 2 && (
              <>
                <button
                  type="submit"
                  className="w-full mt-4 bg-[#692E9F] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#5b23b6] transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Finish"}
                </button>
                <button
                  type="button"
                  className="w-full mt-2 border border-[#692E9F] text-[#692E9F] py-3 rounded-lg font-semibold text-base bg-white hover:bg-gray-50 transition"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
