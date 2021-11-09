import { createRef } from 'react';

import { NavigationBarOption } from '@/common/types';

export const navigationRef = createRef<any>();

export const setOptions = (options: NavigationBarOption) => {
  navigationRef?.current?.setOption(options);
};

export const setTitle = (title: string) => {
  navigationRef?.current?.setTitle(title);
};
