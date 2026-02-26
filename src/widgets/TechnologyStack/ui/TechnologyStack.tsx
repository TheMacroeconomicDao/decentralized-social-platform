'use client';

import { motion } from 'framer-motion';
import { getAllTechnologies } from '@/shared/lib/ecosystem-data';
import styles from './TechnologyStack.module.scss';

const tagContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.1 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  },
};

const categoryColors: Record<string, string> = {
  Frontend: '#42b8f3',
  Backend: '#d49d32',
  Blockchain: '#f5576c',
  Database: '#4caf50',
  Infrastructure: '#9c27b0',
  'AI/ML': '#00d4ff',
  Other: '#ff9800',
};

export function TechnologyStack() {
  const technologies = getAllTechnologies();

  const frontend = technologies.filter(tech =>
    tech.includes('React') || tech.includes('Next.js') || tech.includes('TypeScript') ||
    tech.includes('Tailwind') || tech.includes('SCSS') || tech.includes('Framer')
  );

  const backend = technologies.filter(tech =>
    tech.includes('NestJS') || tech.includes('Node.js') || tech.includes('Go') ||
    tech.includes('Python') || tech.includes('Bun') || tech.includes('Hono')
  );

  const blockchain = technologies.filter(tech =>
    tech.includes('Solidity') || tech.includes('BSC') || tech.includes('NEAR') ||
    tech.includes('Substrate') || tech.includes('Rust') || tech.includes('DAML')
  );

  const database = technologies.filter(tech =>
    tech.includes('PostgreSQL') || tech.includes('Redis') || tech.includes('Prisma') ||
    tech.includes('Drizzle') || tech.includes('ObjectBox') || tech.includes('CockroachDB')
  );

  const infrastructure = technologies.filter(tech =>
    tech.includes('Docker') || tech.includes('Kubernetes') || tech.includes('IPFS') ||
    tech.includes('gRPC') || tech.includes('Kafka') || tech.includes('Firebase')
  );

  const aiMl = technologies.filter(tech =>
    tech.includes('Puter.js') || tech.includes('GPT') || tech.includes('Claude') ||
    tech.includes('OpenAI') || tech.includes('DALL-E') || tech.includes('Grok')
  );

  const other = technologies.filter(tech =>
    !frontend.includes(tech) && !backend.includes(tech) && !blockchain.includes(tech) &&
    !database.includes(tech) && !infrastructure.includes(tech) && !aiMl.includes(tech)
  );

  const techCategories: [string, string[]][] = [
    ['Frontend', frontend],
    ['Backend', backend],
    ['Blockchain', blockchain],
    ['Database', database],
    ['Infrastructure', infrastructure],
    ['AI/ML', aiMl],
    ['Other', other],
  ].filter(([, techs]) => (techs as string[]).length > 0) as [string, string[]][];

  return (
    <motion.div
      className={styles.stack}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring' as const, stiffness: 150, damping: 20 }}
    >
      <div className={styles.header}>
        <span className={styles.count}>{technologies.length}+</span>
        <span className={styles.label}>technologies powering the ecosystem</span>
      </div>

      <div className={styles.categories}>
        {techCategories.map(([category, techs]) => (
          <div key={category} className={styles.row}>
            <span
              className={styles.categoryLabel}
              style={{ color: categoryColors[category] }}
            >
              {category}
            </span>
            <motion.div
              className={styles.tags}
              variants={tagContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {techs.map((tech, index) => (
                <motion.span
                  key={index}
                  className={styles.tag}
                  variants={tagVariants}
                  style={{ '--tag-color': categoryColors[category] } as React.CSSProperties}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
