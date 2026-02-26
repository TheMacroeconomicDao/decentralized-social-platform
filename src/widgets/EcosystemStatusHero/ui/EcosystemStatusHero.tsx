'use client';

import { motion } from 'framer-motion';
import { ecosystemMetrics, getProjectsByStatus } from '@/shared/lib/ecosystem-data';
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

const productionCount = getProjectsByStatus('production').length;
const devCount = getProjectsByStatus('development').length;
const testnetCount = getProjectsByStatus('testnet').length;

const metrics = [
  { value: productionCount, label: 'Live', sub: 'in production', accent: 'cyan' as const },
  { value: devCount, label: 'In Dev', sub: 'building now', accent: 'gold' as const },
  { value: testnetCount, label: 'Testnet', sub: 'testing', accent: 'purple' as const },
  { value: ecosystemMetrics.technologies, suffix: '+', label: 'Technologies', sub: 'modern stack', accent: 'cyan' as const },
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
        Decentralized Ecosystem · 2026
      </motion.div>

      <motion.h1 variants={itemVariants} className={styles.title}>
        Gybernaty Ecosystem
      </motion.h1>

      <motion.p variants={itemVariants} className={styles.valueProp}>
        {ecosystemMetrics.totalProjects} interconnected projects across AI, DeFi, Blockchain & Web3 — from autonomous trading agents to enterprise infrastructure
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
            <div className={`${styles.metricCard} ${styles[m.accent]}`}>
              <div className={styles.metricValue}>
                <AnimatedCounter end={m.value} suffix={m.suffix ?? ''} />
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricSubtext}>{m.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className={styles.scrollHint}>
        Explore the ecosystem
        <span className={styles.scrollArrow}>↓</span>
      </motion.div>
    </motion.div>
  );
}
