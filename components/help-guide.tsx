'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    id: 1,
    title: 'Bienvenue sur Simpl. 👋',
    content: 'Simpl. vous permet de réserver facilement des cours avec les meilleurs coachs sportifs près de chez vous.',
  },
  {
    id: 2,
    title: '1️⃣ Trouvez votre club',
    content: 'Parcourez les clubs disponibles, filtrez par sport ou recherchez par nom ou ville. Cliquez sur un club pour voir ses coachs.',
  },
  {
    id: 3,
    title: '2️⃣ Choisissez votre coach',
    content: 'Consultez les profils des coachs : leurs spécialités, tarifs et disponibilités. Sélectionnez celui qui vous convient.',
  },
  {
    id: 4,
    title: '3️⃣ Réservez votre cours',
    content: 'Choisissez une date et un créneau horaire disponible. Vous pouvez payer en ligne ou sur place.',
  },
  {
    id: 5,
    title: '4️⃣ Gérez vos réservations',
    content: 'Consultez vos cours à venir dans "Mes cours", annulez si nécessaire, ou réservez à nouveau un coach.',
  },
]

export function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsOpen(false)
      setCurrentStep(0)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
        aria-label="Besoin d'aide ?"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Guide Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Guide d&apos;utilisation</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex gap-2 mb-2">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Étape {currentStep + 1} sur {steps.length}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="mb-6 min-h-[120px]">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {steps[currentStep].content}
                      </p>
                    </motion.div>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1"
                      >
                        Précédent
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                    >
                      {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                      {currentStep < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

