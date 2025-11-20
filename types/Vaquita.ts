import { DepositWithdrawalStatus } from '@/types/commons';

export type VaquitaState = 'walking' | 'working' | 'sleeping' | 'withdrawing' | 'celebrating';

export interface VaquitaControllerProps {
  cow: VaquitaData;
  onSelect: (cow: VaquitaData) => void;
  label?: string;
}

export interface VaquitaPosition {
  x: number;
  y: number;
  z: number;
}

export interface VaquitaData {
  position: VaquitaPosition;
  state: VaquitaState;
  amount: string;
  createdAt: Date;
  status: DepositWithdrawalStatus;
  depositId: string;
  depositIdHex: string;
}
