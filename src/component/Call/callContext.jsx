import React from 'react';
import socket from '~/tools/socket.io';
import { useComponentSelector } from '../redux/selector';
import Peer from 'simple-peer';
import { useDispatch } from 'react-redux';
import { componentSlice } from '../redux/slices';
const CallContext = React.createContext();
const CallContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { call } = useComponentSelector();
  const [stream, setStream] = React.useState(null);
  const [caller, setCaller] = React.useState({});
  const [type, setType] = React.useState('');
  const [callAccepted, setCallAccepted] = React.useState(false);
  const [callRequest, setCallRequest] = React.useState(false);

  let localStream = React.useRef();
  let myVideoRef = React.useRef();
  let othersRef = React.useRef();
  let connectionRef = React.useRef();
  React.useEffect(() => {
    if (call) {
      console.log('find camera');
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          localStream.current = currentStream;
        });
    }
    socket.on('call-audio-request', (data) => {
      console.log('set-caller');
      setCaller({ ...data });
      setType('audio');
      setCallRequest(true);
    });
    return () => {
      if (localStream.current) {
        console.log('stop stream');
        localStream.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [call]);
  //socket.io
  React.useEffect(() => {
    //decline-request
    socket.on('decline-call-requester', () => {
      dispatch(componentSlice.actions.setCall({ enabled: false, type: '' }));
      localStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    });
    socket.on('decline-person', () => {
      setCallRequest(false);
      setCaller({});
    });

    //accept-request
    socket.on('accepter-call', (data) => {
      setCallAccepted(true);
      setCallRequest(false);
    });

    socket.on('accept-call-requester', (signal) => {
      connectionRef.current.signal(signal);
    });
  }, []);

  const callUser = (profile, userToCall, type) => {
    console.log('exercute');
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream.current,
    });
    peer.on('signal', (signal) => {
      if (type === 'audio') {
        socket.emit(
          'call-audio-request',
          profile,
          userToCall.socketid,
          socket.id,
          signal
        );
      } else if (type === 'video') {
        socket.emit(
          'call-video-request',
          profile,
          userToCall.socketid,
          socket.id,
          signal
        );
      }
    });
    socket.on('accept-call-requester', (signal) => {
      console.log(signal);
      peer.signal(signal);
    });
    peer.on('stream', (otherStream) => {
      console.log(otherStream);
      othersRef.current.srcObject = otherStream;
    });
    connectionRef.current = peer;
  };
  const acceptCall = () => {
    dispatch(componentSlice.actions.setCall(true));
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream.current,
    });
    peer.on('signal', (signal) => {
      socket.emit('accept-call-request', {
        signal,
        to: caller.socketid,
      });
    });
    peer.signal(caller.signal);
    peer.on('stream', (otherStream) => {
      console.log(otherStream);
      othersRef.current.srcObject = otherStream;
    });
    connectionRef.current = peer;
  };
  const openRoomCall = () => {};
  const participateRoomCall = () => {};
  const leaveCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  return (
    <CallContext.Provider
      value={{
        stream,
        setStream,
        callUser,
        acceptCall,
        leaveCall,
        myVideoRef,
        othersRef,
        localStream,
        callRequest,
        caller,
        callAccepted,
        type,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
export const useCallContext = () => {
  return React.useContext(CallContext);
};
export default CallContextProvider;
