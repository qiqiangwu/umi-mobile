import { Link } from 'umi';
import React from 'react';
import { IColumn } from '../../models/home';
import styles from './index.less';

interface HomeMainColumnsProps {
  columns?: IColumn[];
}

const HomeMainColumns: React.FC<HomeMainColumnsProps> = ({ columns = [] }) => {
  if (!columns.length) {
    return null;
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>教育栏目</span>
      </div>
      {columns.map(c => (
        <Link key={c.id} to={`/course-list/${c.id}/${c.name}`}>
          <img src={c.image} alt="" />
        </Link>
      ))}
    </div>
  );
};

export default HomeMainColumns;
