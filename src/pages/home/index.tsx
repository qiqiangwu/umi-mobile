import React from 'react';
import { connect, Link } from 'umi';

const HomePage: React.FC = props => <Link to="/home/123">导航</Link>;

export default connect()(HomePage);
