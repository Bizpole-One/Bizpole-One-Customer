import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, Sparkles } from "lucide-react";

const BusinessContent = ({ isRight, setIsRight }) => {
  return (
    <div className="p-8 lg:p-12 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!isRight ? (
          <motion.div
            key="new-company"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800">Bizpole</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Prime
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Let's talk business!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              To begin this journey, tell us what type of account you'd be opening.
            </p>

            <div className="space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsRight(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-between"
              >
                Start a New Company
                <ArrowRight className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-between"
              >
                Onboard Existing Company
                <ArrowRight className="w-6 h-6" />
              </motion.button>  
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-white relative">
              <h3 className="font-semibold text-lg mb-2">Not sure which to choose?</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Our business consultants can help you choose the right
                option tailored to your goals.
              </p>
              <button className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 absolute right-4 bottom-4">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Talk to an expert</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="business-type"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Business Type
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                "Private limited",
                "Limited Liability Partnership",
                "Partnership",
                "Solo Entrepreneur",
                "Sole Proprietorship",
                "Trust",
              ].map((type, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-3 px-4 border-2 border-yellow-400 rounded-xl text-gray-900 font-medium hover:bg-yellow-50"
                >
                  {type}
                </motion.button>
              ))}
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">Confused?</h3>
              <p className="text-gray-300 mb-4 text-sm">
                We're here to help! Your solution's just one step away.
              </p>
              <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500">
                Take Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessContent;