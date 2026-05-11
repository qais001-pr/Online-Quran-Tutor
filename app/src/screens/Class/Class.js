/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    FlatList,
    StatusBar,
    TouchableOpacity,
    Pressable,
    ToastAndroid,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Base_URL } from '../../../IpConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSocket } from '../../context/Socket';
import { usePeer } from '../../context/Peer';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import { styles } from '../../styles/Class/ClassStyle';
import inCallManager from 'react-native-incall-manager';
import StudentReviewModal from '../../components/StudentReviewModal'
import TutorFeedBack from '../../components/TutorFeedback'
import { useAuth } from '../../context/auth';
export default function Class({ navigation, route }) {
    const { user } = useAuth()
    const [localStream, setlocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [showmodal, setshowmodal] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [data, setData] = useState([]);
    const ClassID = route.params?.classID;
    const endTime = route.params?.endTime;
    const { Socket } = useSocket();
    useEffect(() => {
        const interval = setInterval(() => {
            setTotalSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const convertUtcToUserTime = useCallback((utcTimeValue) => {
        if (!utcTimeValue) return "";
        const userTimeZone = user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

        try {
            const today = new Date().toISOString().split('T')[0];
            const utcDate = new Date(`${today}T${utcTimeValue}Z`);

            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: userTimeZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // 3. Format and return the local hour
            const formattedTime = formatter.format(utcDate);
            return formattedTime;

        } catch (error) {
            return utcTimeValue.split(':')[0] + utcTimeValue.split(':')[1];
        }
    }, [user?.timezone]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();
            const endTimeString = convertUtcToUserTime(endTime);
            const [endHour, endMinute] = endTimeString.split(':').map(Number);
            const endTotalMinutes = (endHour * 60) + endMinute;

            console.log(`Current: ${currentTotalMinutes} mins, End: ${endTotalMinutes} mins`);

            if (currentTotalMinutes >= endTotalMinutes) {
                console.log('24h Limit Reached. Ending Call.');
                clearInterval(timer);
                endCall();
            }
        }, 30000);

        return () => clearInterval(timer);
    }, [endTime, endCall, convertUtcToUserTime]);
    const {
        Peer,
        InitializePeer, closePeerConnection,
        createOffer,
        createAnswer,
        onCallAccepted
    } = usePeer();

    useEffect(() => {
        if (!Peer) {
            InitializePeer()
        }
    }, [InitializePeer, Peer])
    useEffect(() => {
        if (!Peer) return;
        Peer.onicecandidate = (event) => {
            if (event.candidate) {
                Socket.emit("ice-candidate", {
                    candidate: event.candidate,
                    room: ClassID,
                });
            }
        };
    }, [ClassID, Peer, Socket]);


    // useEffect(() => {
    //     if (!Socket.connected) {
    //         Socket.connect();
    //     }

    //     // Socket.emit('join-room', ClassID);

    //     const handleUserJoin = ({ socketid, roomID }) => {
    //         console.log('User joined:', socketid, roomID);
    //     };

    //     Socket.on('user-join-successfully', handleUserJoin);

    //     return () => {
    //         Socket.off('user-join-successfully', handleUserJoin);
    //     };
    // }, [ClassID, Socket]);

    let handleEndCallSuccess = useCallback(() => {
        inCallManager.stop();
        remoteStream?.getTracks().forEach(track => track.stop());
        // setlocalStream(null);
        setRemoteStream(null);
        Socket.disconnect();
        setshowmodal(true)
        // navigation.goBack();
        closePeerConnection()
    }, [Socket, closePeerConnection, remoteStream])

    let setSelectedAyat = useCallback((data) => {
        const { index } = data;
        // console.log(index, room)
        setSelectedAyatIndex(index);
    }, [])

    useEffect(() => {
        Socket.on('incoming-call', handleIncomingCall);
        Socket.on("answer", handleCallAccepted);
        Socket.on("ice-candidate", handleIceCandidate);
        Socket.on('success-end-call', handleEndCallSuccess)
        Socket.on('onClick-Ayats', setSelectedAyat)
        return () => {
            Socket.off('incoming-call', handleIncomingCall);
            Socket.off("answer", handleCallAccepted);
            Socket.off("ice-candidate", handleIceCandidate);
            Socket.off('success-end-call', handleEndCallSuccess);
            Socket.off('onClick-Ayats', setSelectedAyat)
        };
    }, [Socket, handleIncomingCall, handleCallAccepted, handleIceCandidate, handleEndCallSuccess, setSelectedAyat]);





    // Send offer when joining room
    useEffect(() => {
        if (!localStream) return;
        if (!Peer) return;

        const sendOffer = async () => {
            try {
                // Add local tracks first
                localStream.getTracks().forEach(track => {
                    if (!Peer.getSenders().some(sender => sender.track?.id === track.id)) {
                        Peer.addTrack(track, localStream);
                    }
                });

                const offer = await createOffer();
                Socket.emit("offer", { offer, room: ClassID });
            } catch (error) {
                console.error('Error creating offer:', error);
            }
        };

        sendOffer();
    }, [ClassID, Peer, Socket, createOffer, localStream]);






    // Handle incoming calls
    const handleIncomingCall = useCallback(async (data) => {
        try {
            const { offer } = data;
            const answer = await createAnswer(offer);
            Socket.emit("answer", { answer, room: ClassID });
        } catch (error) {
            console.error('Error handling call:', error);
        }
    }, [createAnswer, Socket, ClassID]);

    useEffect(() => {
        if (!Peer || !localStream) return;
        const senders = Peer.getSenders();
        localStream.getTracks().forEach(track => {
            const alreadyAdded = senders.find(
                sender => sender.track && sender.track.id === track.id
            );
            if (!alreadyAdded) {
                Peer.addTrack(track, localStream);
            }
        });

    }, [Peer, localStream]);



    const handleCallAccepted = useCallback(async ({ answer }) => {
        try {
            await onCallAccepted(answer);
            // console.log('Call accepted');
            inCallManager.setForceSpeakerphoneOn(true);
        } catch (error) {
            console.error('Error accepting call:', error);
        }
    }, [onCallAccepted]);


    let handleIceCandidate = useCallback(async ({ candidate }) => {
        try {
            // Add candidate to connection
            await Peer.addIceCandidate(candidate);
        } catch (e) {
            console.log("ICE Error:", e);
        }
    }, [Peer])



    useEffect(() => {
        if (!Peer) return;

        Peer.ontrack = (event) => {
            const [stream] = event.streams;
            if (stream) {
                setRemoteStream(stream);
            }
        };
    }, [Peer]);


    let handleSubmitTutorFeedBack = async (data) => {
        try {
            const { assignmentText,
                correction,
                startIndex,
                endIndex, } = data;
            console.log('Assignment', assignmentText)
            const response = await fetch(Base_URL + `Progress/CompleteClass`, {
                method: 'POST',
                body: JSON.stringify({
                    ClassID: ClassID,
                    corrections: correction,
                    notes: assignmentText,
                    startAyat: startIndex,
                    endAyat: endIndex
                }),
                headers: { "content-type": "application/json" }
            })
            if (response.ok) {
                const result = await response.json()
                console.log(result);
                ToastAndroid.show(`${result?.message || ''}`, 5000);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setshowmodal(false)
            endCall()
        }
    }
    let handleStudentSubmitReview = async (data) => {
        try {
            console.log(data)
            const response = await fetch(Base_URL + 'Reviews/addReview', {
                body: JSON.stringify({
                    Rating: data?.rating,
                    classID: ClassID,
                    comment: data?.comment
                }),
                method: 'POST',
                headers: { "content-type": "application/json" }
            })
            console.log(response);
            if (response.ok) {
                const result = await response.json()
                console.log(result);
                ToastAndroid.show(result, 3000)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setshowmodal(false)
            endCall()
        }
    }
    let endCall = useCallback(() => {
        // 1. Stop Local Tracks
        localStream?.getTracks().forEach(track => track.stop());
        // 2. Stop InCallManager
        inCallManager.stop();
        // 3. Emit Socket Event
        Socket.emit('end-call', { room: ClassID });
        // 4. Close Peer Connection Properly
        if (Peer) {
            Peer.onicecandidate = null;
            Peer.ontrack = null;
            Peer.onnegotiationneeded = null;
            // Peer.close();
        }
        navigation.goBack();
        closePeerConnection()
    }, [localStream, Socket, ClassID, Peer, navigation, closePeerConnection]);

    let getUserMedia = useCallback(async () => {
        const stream = await mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setlocalStream(stream)
    }, [])


    useEffect(() => {
        getUserMedia();
    }, [getUserMedia])


    let changeCameraTracking = async () => {
        if (cameraOn) {
            setCameraOn(false);
            localStream?.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.stop()
                    const senders = Peer.getSenders();
                    senders.forEach(sender => {
                        if (sender.track) {
                            Peer.removeTrack(sender);
                        }
                    });
                }
            });
            // setlocalStream(null);
        } else {
            setCameraOn(true);
            const stream = await mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setlocalStream(stream);
            stream.getTracks().forEach(track => {
                Peer.addTrack(track, stream);
            });
        }
    };


    let changeMicTracking = () => {

        if (!localStream) return;

        const audioTracks = localStream.getAudioTracks();

        if (audioTracks.length === 0) return;

        const enabled = audioTracks[0].enabled;

        // Toggle mic
        audioTracks.forEach(track => {
            track.enabled = !enabled;
        });

        setMicOn(!enabled);
    };



    useEffect(() => {
        fetchLesson();
    }, [fetchLesson]);

    const fetchLesson = useCallback(async () => {
        try {
            const response = await fetch(
                `${Base_URL}Classes/getClassDataByUsingClassID?ClassID=${ClassID}`
            );
            if (response.ok) {
                const result = await response.json();
                setData(result?.data);
                console.log(result);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }, [ClassID]);
    const [selectedAyatIndex, setSelectedAyatIndex] = useState(null);
    let highlightAyat = (index) => {
        if (user?.userType === 'Tutor') {
            console.log(index);
            setSelectedAyatIndex(index)
            Socket.emit("onClick-Ayats", { index: index, room: ClassID, message: 'Tutor has selected the ayat' })
        }
        return;
    }
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {data && (
                <>
                    {/* Header */}
                    <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View>
                            <Text style={styles.surahName}>Surah: {data?.surahName || ''}</Text>
                            <Text style={{ color: 'red', fontSize: 18, fontWeight: '700' }}>
                                {String(minutes).padStart(2, '0')} : {String(seconds).padStart(2, '0')}
                            </Text>
                        </View>
                    </View>
                    {/* Ayat List */}
                    <View style={{ maxHeight: '60%' }}>
                        <FlatList
                            data={data?.lessondata}
                            keyExtractor={(item) => item?.VerseID.toString()}
                            contentContainerStyle={{ padding: 15 }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <Pressable
                                    onPress={() => highlightAyat(index)}
                                    style={styles.ayatCard}
                                >
                                    <Text
                                        style={[
                                            styles.ayatText,
                                            { color: selectedAyatIndex === index ? 'red' : 'black' }
                                        ]}
                                    >
                                        {item.AyahText}
                                    </Text>

                                    <View style={styles.ayatNumberCircle}>
                                        <Text style={styles.ayatNumber}>
                                            {item?.VerseID}
                                        </Text>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                </>
            )}
            <View style={styles.callActionButtonContainer}>
                {/* Camera Button */}
                <TouchableOpacity
                    style={[styles.button, !cameraOn && styles.buttonOff]}
                    onPress={changeCameraTracking}
                >
                    <Icon
                        name={cameraOn ? 'videocam-off' : 'videocam'}
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* Mic Button */}
                <TouchableOpacity
                    style={[styles.button, !micOn && styles.buttonOff]}
                    onPress={changeMicTracking}
                >
                    <Icon name={micOn ? 'mic' : 'mic-off'} size={28} color="#fff" />
                </TouchableOpacity>

                {/* Call Button */}
                <TouchableOpacity
                    style={[styles.button, styles.callButton, styles.callInactive]}
                    onPress={() => setshowmodal(true)}
                >
                    <Icon name="call" size={28} color="#fff" />
                </TouchableOpacity>
            </View>


            <View style={{
                backgroundColor: 'cyan',
                width: 100, height: 100, position: 'absolute',
                left: 20,
                borderRadius: 10,
                bottom: 150
            }}>
                {/* <Text>Our Video</Text> */}
                {
                    localStream &&
                    <RTCView
                        style={{
                            width: 100, height: 100
                        }}
                        mirror
                        objectFit="cover"
                        streamURL={localStream.toURL()}
                    />
                }
            </View>

            <View style={{
                // backgroundColor: 'cyan',
                width: 100, height: 100, position: 'absolute',
                left: 110,
                borderRadius: 10,
                bottom: 150
            }}>
                {/* <Text>Our Video</Text> */}
                {
                    remoteStream &&
                    <RTCView
                        style={{
                            width: 100, height: 100
                        }}
                        mirror
                        objectFit="cover"
                        streamURL={remoteStream.toURL()}
                    />
                }
            </View>

            {
                (showmodal && user?.userType === 'Tutor') ? (
                    <TutorFeedBack
                        onSubmit={handleSubmitTutorFeedBack}
                        visible={showmodal}
                        onClose={() => setshowmodal(false)}
                        lessonData={data?.lessondata}
                    />
                ) : (
                    <StudentReviewModal
                        onSubmit={handleStudentSubmitReview}
                        visible={showmodal}
                        onClose={() => setshowmodal(false)}
                    />
                )
            }

        </View>
    );
}
