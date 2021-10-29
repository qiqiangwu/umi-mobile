import React from 'react';
import { Button, Space } from 'antd-mobile';
import styles from './index.less';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Button color="primary">Primary</Button>
    </div>
  );
}
