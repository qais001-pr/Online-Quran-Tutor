import React from 'react'
import AppNavigation from './src/screens/Navigation/AppNavigation'
import { AuthProvider } from './src/context/auth';
import { SocketProvider } from './src/context/Socket'
import { PeerProvider } from './src/context/Peer'
import { ChildrenProvider } from './src/context/Childrens'
import { LogBox } from 'react-native';
if (__DEV__) {
  LogBox.ignoreAllLogs(true);
}
export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <PeerProvider>
          <ChildrenProvider>
            <AppNavigation />
          </ChildrenProvider>
        </PeerProvider>
      </SocketProvider>
    </AuthProvider>

  )
}
