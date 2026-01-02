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
        'group overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300',
        className
      )}
    >
      {/* Coach Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={coach.photoUrl}
          alt={coach.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Rating Badge Overlay - Smaller on mobile */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs sm:text-sm font-bold">{coach.rating}</span>
          <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">({coach.reviewCount})</span>
        </div>
      </div>

      {/* Card Content - Better mobile spacing */}
      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
        {/* Name & Age */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-1">{coach.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{coach.age} ans</p>
        </div>

        {/* Speciality Badge */}
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs">
          {coach.speciality}
        </Badge>

        {/* Bio - Better line clamp */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {coach.bio}
        </p>

        {/* Footer: Price + Button - Better mobile layout */}
        <div className="flex items-center justify-between pt-1 sm:pt-2 gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
              {coach.hourlyRate}€
            </span>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap hidden sm:inline">/heure</span>
          </div>
          
          <Button
            onClick={() => onBook(coach)}
            size="sm"
            className="rounded-full px-3 sm:px-4 md:px-5 text-xs sm:text-sm h-8 sm:h-9 md:h-10 active:scale-95 transition-transform flex-shrink-0"
          >
            Réserver
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
