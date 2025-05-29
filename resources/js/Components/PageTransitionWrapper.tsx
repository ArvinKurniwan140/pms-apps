// components/PageTransitionWrapper.tsx
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: 'easeIn' } },
};

type Props = {
  children: React.ReactNode;
};

const PageTransitionWrapper: React.FC<Props> = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={typeof window !== 'undefined' ? window.location.pathname : 'page'}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
