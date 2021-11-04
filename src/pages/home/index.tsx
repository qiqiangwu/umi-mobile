import React from 'react';
import { connect, Link } from 'umi';
import Logger from '@/utils/logger';

const logger = Logger.get('/home');

const HomePage: React.FC = props => <Link to="/home/123">导航</Link>;

export default connect()(HomePage);
