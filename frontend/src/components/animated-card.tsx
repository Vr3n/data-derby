import { motion, MotionProps } from "framer-motion";

type AnimatedCardProps = React.HTMLAttributes<HTMLDivElement> & MotionProps & {
  children: React.ReactNode;
}


export function AnimatedCard({ children, ...props }: AnimatedCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }

  return (
    <motion.div {...props} variants={item}>
      {children}
    </motion.div>
  )

}
