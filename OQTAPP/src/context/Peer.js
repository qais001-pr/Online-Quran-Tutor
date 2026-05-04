import React, { useState, useCallback } from "react";

const PeerContext = React.createContext(null)
import { RTCPeerConnection } from "react-native-webrtc";
let peerConstraints = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};
export const PeerProvider = ({ children }) => {
    const [Peer, setPeer] = useState(null);
    const InitializePeer = useCallback(() => {
        console.log("Initializing New Peer Connection...");
        const pc = new RTCPeerConnection(peerConstraints);
        setPeer(pc);
        return pc;
    }, []);

    const closePeerConnection = useCallback(() => {
        if (Peer) {
            Peer.close();
            setPeer(null);
        }
    }, [Peer]);
    const createOffer = async () => {
        const offer = await Peer.createOffer()
        await Peer.setLocalDescription(offer)
        return offer;
    }

    const createAnswer = async (offer) => {
        await Peer.setRemoteDescription(offer);
        const answer = await Peer.createAnswer();
        await Peer.setLocalDescription(answer);
        return answer;
    }

    const onCallAccepted = async (answer) => {
        await Peer.setRemoteDescription(answer)
    }




    return (
        <PeerContext.Provider value={{ Peer, InitializePeer, closePeerConnection, createOffer, createAnswer, onCallAccepted }}>
            {children}
        </PeerContext.Provider>
    )
}
export const usePeer = () => React.useContext(PeerContext)