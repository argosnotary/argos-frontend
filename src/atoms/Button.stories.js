import React from 'react';

import { AnchorButton, Button } from './Button';
import TransparentButton from './TransparentButton';

export default {
  title: 'Buttons'
}

export const anchor = () => <AnchorButton>Click</AnchorButton>;
export const defaultButton = () => <Button>Click</Button>;
export const transparent = () => <TransparentButton>Click</TransparentButton>;
