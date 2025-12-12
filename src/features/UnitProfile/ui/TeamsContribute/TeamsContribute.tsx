'use client';

import cls from './TeamsContribute.module.scss';

interface TeamsContributeProps {
  className?: string;
}

export const TeamsContribute = ({ className }: TeamsContributeProps) => {
  const teams = [
    'LQD: NEXT-DEV, DEVOPS, FRONT-DEV, CORE, POWER SWAP, META',
  ];

  const contributions = [
    {
      title: 'Cyber Experiment:',
      items: [
        'Jamester game-ig-app-frontend',
        'Jamester game-ig-app-backend',
        'Jamester game-ig-app-backend',
      ]
    },
    {
      title: 'AIC RESEARCH:',
      items: [
        'PHILOSOPHICAL GRAPH RAG SYSTEM',
        'Philosopher',
      ]
    }
  ];

  return (
    <div className={`${cls.TeamsContribute} ${className || ''}`}>
      <div className={cls.section}>
        <h4 className={cls.title}>Teams:</h4>
        <div className={cls.teamsContent}>
          {teams.map((team, index) => (
            <p key={index} className={cls.teamText}>
              {team}
            </p>
          ))}
        </div>
      </div>

      <div className={cls.section}>
        <h4 className={cls.title}>Contribut:</h4>
        <div className={cls.contributeContent}>
          {contributions.map((contribution, index) => (
            <div key={index} className={cls.contributionGroup}>
              <h5 className={cls.contributionTitle}>{contribution.title}</h5>
              <ul className={cls.contributionList}>
                {contribution.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={cls.contributionItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 