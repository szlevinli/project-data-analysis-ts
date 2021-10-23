import { Tooltip, Typography } from '@mui/material';
import React, { FC, RefObject, useEffect, useRef, useState } from 'react';

const compareSize = (ref: RefObject<HTMLElement>) =>
  ref.current ? ref.current.scrollWidth > ref.current.clientWidth : false;

export type OverflowTipProps = {
  value: string;
  width: number;
};

const OverflowTip: FC<OverflowTipProps> = ({ value, width }) => {
  const ref = useRef<HTMLElement>(null);
  const [hoverStatus, setHoverStatus] = useState(false);

  useEffect(() => {
    setHoverStatus(compareSize(ref));
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => setHoverStatus(compareSize(ref));

  return (
    <Tooltip title={value} disableHoverListener={!hoverStatus}>
      <Typography noWrap sx={{ width }} ref={ref}>
        {value}
      </Typography>
    </Tooltip>
  );
};

export default OverflowTip;
