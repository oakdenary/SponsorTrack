"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
