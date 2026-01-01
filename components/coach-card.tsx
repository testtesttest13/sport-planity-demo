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
        'group overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300',
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Rating Badge Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold">{coach.rating}</span>
          <span className="text-xs text-gray-500">({coach.reviewCount})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Name & Age */}
        <div>
          <h3 className="text-xl font-bold text-gray-900">{coach.name}</h3>
          <p className="text-sm text-gray-500">{coach.age} ans</p>
        </div>

        {/* Speciality Badge */}
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
          {coach.speciality}
        </Badge>

        {/* Bio */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {coach.bio}
        </p>

        {/* Footer: Price + Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">
              {coach.hourlyRate}€
            </span>
            <span className="text-sm text-gray-500">/heure</span>
          </div>
          
          <Button
            onClick={() => onBook(coach)}
            size="sm"
            className="rounded-full px-5 active:scale-95 transition-transform"
          >
            Réserver
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

