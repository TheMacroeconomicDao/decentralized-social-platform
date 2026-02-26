'use client';

import { motion } from 'framer-motion';
import { ecosystemMetrics, getProjectsByStatus } from '@/shared/lib/ecosystem-data';
import { AnimatedCounter } from '@/shared/ui/AnimatedCounter';
import styles from './MetricsDashboard.module.scss';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
};

const barVariants = {
  hidden: { width: '0%' },
  visible: (width: string) => ({
    width,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.3 },
  }),
};

export function MetricsDashboard() {
  const productionProjects = getProjectsByStatus('production');
  const developmentProjects = getProjectsByStatus('development');
  const testnetProjects = getProjectsByStatus('testnet');

  const metrics = [
    { icon: '🚀', value: productionProjects.length, label: 'Production Ready' },
    { icon: '⚙️', value: developmentProjects.length, label: 'In Development' },
    { icon: '🧪', value: testnetProjects.length, label: 'Testnet' },
    { icon: '💻', value: ecosystemMetrics.technologies, suffix: '+', label: 'Technologies' },
  ];

  const statusBars = [
    {
      label: 'Production',
      count: productionProjects.length,
      width: `${(productionProjects.length / ecosystemMetrics.totalProjects) * 100}%`,
      className: 'production',
    },
    {
      label: 'Development',
      count: developmentProjects.length,
      width: `${(developmentProjects.length / ecosystemMetrics.totalProjects) * 100}%`,
      className: 'development',
    },
    {
      label: 'Testnet',
      count: testnetProjects.length,
      width: `${(testnetProjects.length / ecosystemMetrics.totalProjects) * 100}%`,
      className: 'testnet',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        Key Ecosystem Metrics
      </motion.h2>

      <motion.div
        className={styles.metricsGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{
              scale: 1.04,
              y: -4,
              transition: { type: 'spring', stiffness: 400, damping: 17 },
            }}
          >
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>{m.icon}</div>
              <div className={styles.metricValue}>
                <AnimatedCounter end={m.value} suffix={m.suffix ?? ''} />
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={styles.statusBreakdown}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.2 }}
      >
        <h3 className={styles.subtitle}>Status Distribution</h3>
        <div className={styles.progressBars}>
          {statusBars.map((bar) => (
            <div key={bar.className} className={styles.progressItem}>
              <div className={styles.progressLabel}>
                <span>{bar.label}</span>
                <span>{bar.count}</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div
                  className={`${styles.progressFill} ${styles[bar.className]}`}
                  variants={barVariants}
                  custom={bar.width}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
