"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-16 h-16"
        >
          <Image
            src="/assets/logo.jpg" 
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 font-medium"
        >
          Loading...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay; 