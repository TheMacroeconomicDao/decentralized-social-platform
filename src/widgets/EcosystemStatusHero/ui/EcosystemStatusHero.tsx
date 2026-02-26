'use client';

import { motion } from 'framer-motion';
import { ecosystemMetrics } from '@/shared/lib/ecosystem-data';
import { AnimatedCounter } from '@/shared/ui/AnimatedCounter';
import styles from './EcosystemStatusHero.module.scss';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
      delay: 0.3 + i * 0.1,
    }
  })
};

const metrics = [
  { value: ecosystemMetrics.totalProjects, suffix: '+', label: 'Projects', sub: `${ecosystemMetrics.productionReady} Production Ready` },
  { value: null, display: ecosystemMetrics.developmentCost, label: 'Development Cost', sub: 'estimated' },
  { value: ecosystemMetrics.technologies, suffix: '+', label: 'Technologies', sub: 'modern stack' },
  { value: ecosystemMetrics.teamSize, suffix: '+', label: 'Team', sub: 'experts' },
];

export function EcosystemStatusHero() {
  return (
    <motion.div
      className={styles.hero}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className={styles.eyebrow}>
        GYBERNATY · DECENTRALIZED ECOSYSTEM · 2026
      </motion.div>

      <motion.h1 variants={itemVariants} className={styles.title}>
        GYBERNATY ECOSYSTEM
      </motion.h1>

      <motion.p variants={itemVariants} className={styles.subtitle}>
        A comprehensive decentralized ecosystem of {ecosystemMetrics.totalProjects}+ interconnected projects,
        combining cutting-edge Web3, AI and blockchain technologies
      </motion.p>

      <div className={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.03,
              y: -4,
              transition: { type: 'spring', stiffness: 400, damping: 17 },
            }}
          >
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>
                {m.value !== null
                  ? <AnimatedCounter end={m.value} suffix={m.suffix ?? ''} />
                  : m.display
                }
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricSubtext}>{m.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
