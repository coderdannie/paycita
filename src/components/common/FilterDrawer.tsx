/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onReset?: () => void;
  applyText?: string;
  resetText?: string;
  width?: string;
  form: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  title = "Filter",
  children,
  onReset,
  applyText = "Apply",
  resetText = "Reset",
  width = "350px",
  form,
  onSubmit,
}) => {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            onClick={onClose}
          />
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full bg-white shadow-xl z-50 rounded-lg"
              style={{ width }}
            >
              {/* Header */}
              <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose}>
                  <IoClose className="text-2xl text-[#667085]" />
                </button>
              </div>

              {/* Content */}
              <div className="pt-5 px-6 h-[calc(100%-120px)] overflow-y-auto">
                {children}
              </div>

              {/* Footer Buttons */}
              <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between gap-4">
                <button
                  className="flex-1 text-sm font-semibold px-4 py-2 border border-[#EA3D3D] text-[#EA3D3D] rounded-lg"
                  onClick={onReset}
                  type="button"
                >
                  {resetText}
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-primary font-semibold text-sm text-white rounded-lg"
                  type="submit"
                >
                  {applyText}
                </button>
              </div>
            </motion.div>
          </form>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
