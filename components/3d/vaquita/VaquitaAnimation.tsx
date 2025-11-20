'use client';

import { DepositWithdrawalStatus } from '@/types/commons';
import { VaquitaState } from '@/types/Vaquita';
import CelebratingAnimation from './animations/CelebratingAnimation';
import SleepingAnimation from './animations/SleepingAnimation';
import WalkingAnimation from './animations/WalkingAnimation';
import WithdrawAnimation from './animations/WithdrawAnimation';
import WorkingAnimation from './animations/WorkingAnimation';

interface VaquitaProps {
  state: VaquitaState;
  status: DepositWithdrawalStatus;
  position: { x: number; y: number; z: number };
  direction: [number, number];
  scale: number;
  label?: string;
}

export const VaquitaAnimation = ({ state, position, direction, scale, status, label }: VaquitaProps) => {
  if (status === DepositWithdrawalStatus.WITHDRAWN) {
    return <WithdrawAnimation position={position} scale={scale} label={label} />;
  }
  if (status === DepositWithdrawalStatus.DEPOSITING || status === DepositWithdrawalStatus.WITHDRAWING) {
    return <WalkingAnimation position={position} direction={direction} scale={scale} blinking label={label} />;
  }
  if (state === 'walking')
    return <WalkingAnimation position={position} direction={direction} scale={scale} label={label} />;
  if (state === 'working')
    return <WorkingAnimation position={position} direction={direction} scale={scale} label={label} />;
  if (state === 'sleeping')
    return <SleepingAnimation position={position} direction={direction} scale={scale} label={label} />;
  if (state === 'celebrating')
    return <CelebratingAnimation position={position} direction={direction} scale={scale} label={label} />;
  return null;
};
