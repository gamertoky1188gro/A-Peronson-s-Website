import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const MotionLink = motion.create(Link)

export default function MagneticButton({ to, onClick, className = '', children, ...rest }) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.45 })
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.45 })
  const maxShift = 10

  function handleMove(event) {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width
    const relY = (event.clientY - rect.top) / rect.height
    x.set((relX - 0.5) * 2 * maxShift)
    y.set((relY - 0.5) * 2 * maxShift)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const commonProps = {
    className,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: reduceMotion ? undefined : { x: springX, y: springY },
    ...rest,
  }

  if (to) {
    return (
      <MotionLink to={to} {...commonProps}>
        {children}
      </MotionLink>
    )
  }

  return (
    <motion.button type="button" onClick={onClick} {...commonProps}>
      {children}
    </motion.button>
  )
}
