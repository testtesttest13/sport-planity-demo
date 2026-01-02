'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TourStep {
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface HelpTourProps {
  steps: TourStep[]
  onComplete?: () => void
}

export function HelpTour({ steps, onComplete }: HelpTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
      setIsOpen(false)
      if (onComplete) onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsCompleted(true)
  }

  const handleStart = () => {
    setIsOpen(true)
    setCurrentStep(0)
    setIsCompleted(false)
  }

  if (isCompleted && !isOpen) return null

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 transition-colors"
      >
        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-medium">Besoin d&apos;aide ?</span>
      </motion.button>

      {/* Tour Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Tour Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 left-4 sm:left-auto z-50 w-auto sm:w-80 max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)]"
            >
              <Card className="shadow-2xl border-2 border-green-200 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Étape {currentStep + 1} sur {steps.length}
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {steps[currentStep].content}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      className="h-full bg-green-600 rounded-full"
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      size="sm"
                      className="flex-1"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Précédent
                    </Button>
                    <Button
                      onClick={handleNext}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                      {currentStep < steps.length - 1 && (
                        <ChevronRight className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

