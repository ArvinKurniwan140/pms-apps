// components/SuccessAnimation.tsx
import { motion } from 'framer-motion';

export default function SuccessAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <h3 className="text-lg font-semibold text-green-700">Account Created Successfully!</h3>
      <p className="text-sm text-gray-500 mt-1">Redirecting to dashboard...</p>
    </motion.div>
  );
}
