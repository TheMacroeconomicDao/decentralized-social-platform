'use client';

import { ecosystemMetrics } from '@/shared/lib/ecosystem-data';
import { AnimatedCounter } from '@/shared/ui/AnimatedCounter';
import styles from './EcosystemStatusHero.module.scss';

export function EcosystemStatusHero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>GYBERNATY ECOSYSTEM</h1>
      <p className={styles.subtitle}>
        Комплексная децентрализованная экосистема из {ecosystemMetrics.totalProjects}+ взаимосвязанных проектов,
        объединяющая передовые технологии Web3, AI и блокчейн
      </p>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            <AnimatedCounter end={ecosystemMetrics.totalProjects} suffix="+" />
          </div>
          <div className={styles.metricLabel}>Проектов</div>
          <div className={styles.metricSubtext}>
            {ecosystemMetrics.productionReady} Production Ready
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            {ecosystemMetrics.developmentCost}
          </div>
          <div className={styles.metricLabel}>Стоимость разработки</div>
          <div className={styles.metricSubtext}>оценочно</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            <AnimatedCounter end={ecosystemMetrics.technologies} suffix="+" />
          </div>
          <div className={styles.metricLabel}>Технологий</div>
          <div className={styles.metricSubtext}>современных</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricValue}>
            <AnimatedCounter end={ecosystemMetrics.teamSize} suffix="+" />
          </div>
          <div className={styles.metricLabel}>Команда</div>
          <div className={styles.metricSubtext}>экспертов</div>
        </div>
      </div>
    </div>
  );
}
