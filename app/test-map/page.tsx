'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect, } from '@coinbase/onchainkit/wallet';
import { CameraFixedFollow } from '@engine3d/camera/CameraFixedFollow';
import { CanvasRoot } from '@engine3d/canvas/CanvasRoot';
import { CollisionVisualizer } from '@engine3d/components/CollisionVisualizer';
import { ControlsInfo } from '@engine3d/components/ControlsInfo';
import { InteractionUI } from '@engine3d/components/InteractionUI';
import { VirtualJoystick } from '@engine3d/components/VirtualJoystick';
import { WorldRenderer } from '@engine3d/components/WorldRenderer';
import { PLAYER_CONFIG } from '@engine3d/config/player';
import { useInputHandler } from '@engine3d/hooks/useInputHandler';
import { Map } from '@engine3d/Map';
import { Player } from '@engine3d/models/Player';
import Link from 'next/link';
import { Button, Icon } from '../../components/DemoComponents';

export default function App() {
  // Manejar input para el player
  useInputHandler();

  return (
    <div className="flex flex-col h-dvh font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      {/* Header con max-w-md */}
      <header className="flex my-2 justify-between items-center h-11 px-4 py-3">
        <div className=" w-full flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
              <ConnectWallet>
                <Name className="text-inherit" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          <Link href="/test">
            <Button icon={<Icon name="arrow-right" size="sm" />}>Test</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <CanvasRoot>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <Map />
          <WorldRenderer />
          <Player position={PLAYER_CONFIG.INITIAL_POSITION} />
          <CollisionVisualizer />
          <CameraFixedFollow target={[0, 0.7, 0]} offset={[0, 5, 8]} />
        </CanvasRoot>
        <ControlsInfo />
        <InteractionUI />
        {/* TODO: */}
        {/* <MapInfo /> */}
        {/* <MiniMap /> */}
        {/* <DebugPanel /> */}
        <div className="lg:hidden block">
          <VirtualJoystick />
        </div>
      </main>

      <footer className="flex justify-center px-4 bg-green-500 bg-blue-500 lg:bg-purple-500"></footer>
    </div>
  );
}
