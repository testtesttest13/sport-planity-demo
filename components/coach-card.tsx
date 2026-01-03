'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Clock } from 'lucide-react'
import { Coach } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CoachCardProps {
  coach: Coach
  onBook: (coach: Coach) => void
  className?: string
}

export function CoachCard({ coach, onBook, className }: CoachCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Compact Layout: Image + Content side by side on larger screens */}
      <div className="flex flex-col sm:flex-row">
        {/* Coach Image - Smaller, more compact */}
        <div className="relative w-full sm:w-24 sm:h-24 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
          <Image
            src={coach.photoUrl}
            alt={coach.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        </div>

        {/* Card Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {/* Name & Rating */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1">{coach.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{coach.age} ans</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 border border-gray-200 flex-shrink-0">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">{coach.rating}</span>
              </div>
            </div>

            {/* Speciality Badge */}
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs w-fit">
              {coach.speciality}
            </Badge>

            {/* Bio - Compact */}
            {coach.bio && (
              <p className="text-xs text-gray-600 line-clamp-2 leading-snug">
                {coach.bio}
              </p>
            )}
          </div>

          {/* Footer: Price + Button */}
          <div className="flex items-center justify-between pt-2 mt-auto gap-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-bold text-gray-900">
                {coach.hourlyRate}€<span className="text-xs text-gray-500 font-normal">/h</span>
              </span>
            </div>
            
            <Button
              onClick={() => onBook(coach)}
              size="sm"
              className="rounded-full px-4 text-xs h-8 active:scale-95 transition-transform flex-shrink-0"
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
