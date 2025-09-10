import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseVideoCallOptions {
  roomId: string;
  userId: string;
  isObserver?: boolean;
  onRemoteStreamReceived?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

interface VideoCallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraOn: boolean;
  isConnected: boolean;
  error: Error | null;
}

export const useVideoCall = ({ 
  roomId, 
  userId, 
  isObserver = false, 
  onRemoteStreamReceived, 
  onError 
}: UseVideoCallOptions) => {
  const { toast } = useToast();
  const [state, setState] = useState<VideoCallState>({
    localStream: null,
    remoteStream: null,
    isCameraOn: false,
    isConnected: false,
    error: null
  });
  
  const peerRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const roomChannelRef = useRef<any>(null);
  
  // Connect local video ref to stream
  useEffect(() => {
    if (localVideoRef.current && state.localStream) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream]);
  
  // Connect remote video ref to stream
  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStream) {
      remoteVideoRef.current.srcObject = state.remoteStream;
      
      // Notify parent component
      if (onRemoteStreamReceived) {
        onRemoteStreamReceived(state.remoteStream);
      }
    }
  }, [state.remoteStream, onRemoteStreamReceived]);
  
  // Initialize or destroy WebRTC connection based on camera state
  useEffect(() => {
    if (state.isCameraOn) {
      initializeCamera();
    } else {
      destroyPeerConnection();
    }
    
    return () => {
      destroyPeerConnection();
    };
  }, [state.isCameraOn]);
  
  // Setup real-time connection for WebRTC signaling
  useEffect(() => {
    if (roomId) {
      setupRealTimeConnection();
    }
    
    return () => {
      if (roomChannelRef.current) {
        roomChannelRef.current.unsubscribe();
      }
    };
  }, [roomId]);
  
  const setupRealTimeConnection = async () => {
    try {
      const roomChannel = supabase.channel(`debate-room-${roomId}`);
      
      roomChannel
        .on('broadcast', { event: 'camera-on' }, (payload) => {
          console.log('User turned camera on:', payload);
          if (payload.payload.userId !== userId && state.isCameraOn && state.localStream) {
            initiatePeerConnection(state.localStream);
          }
        })
        .on('broadcast', { event: 'camera-off' }, (payload) => {
          console.log('User turned camera off:', payload);
          if (payload.payload.userId !== userId) {
            setState(prev => ({ ...prev, remoteStream: null }));
          }
        })
        .on('broadcast', { event: 'webrtc-offer' }, (payload) => {
          console.log('Received WebRTC offer:', payload);
          if (payload.payload.userId !== userId) {
            handleReceivedOffer(payload.payload.offer);
          }
        })
        .on('broadcast', { event: 'webrtc-answer' }, (payload) => {
          console.log('Received WebRTC answer:', payload);
          if (payload.payload.userId !== userId) {
            handleReceivedAnswer(payload.payload.answer);
          }
        })
        .on('broadcast', { event: 'webrtc-ice' }, (payload) => {
          console.log('Received ICE candidate:', payload);
          if (payload.payload.userId !== userId) {
            handleIceCandidate(payload.payload.candidate);
          }
        })
        .subscribe();
      
      roomChannelRef.current = roomChannel;
    } catch (error) {
      console.error('Error setting up real-time connection:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to setup real-time connection'));
      }
    }
  };
  
  // Initialize camera access
  const initializeCamera = async () => {
    try {
      // If observer mode, request camera with audio muted
      const constraints = isObserver 
        ? { video: true, audio: false } 
        : { video: true, audio: true };
        
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setState(prev => ({ ...prev, localStream: stream, error: null }));
      
      // Notify Supabase that camera is on
      if (roomChannelRef.current) {
        await roomChannelRef.current.send({
          type: 'broadcast',
          event: 'camera-on',
          payload: { 
            userId,
            isObserver,
            timestamp: Date.now() 
          },
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setState(prev => ({ 
        ...prev, 
        isCameraOn: false, 
        error: error instanceof Error ? error : new Error('Failed to access camera') 
      }));
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to access camera'));
      }
    }
  };
  
  // Toggle camera on/off
  const toggleCamera = async () => {
    try {
      if (state.isCameraOn) {
        // Turn off camera
        setState(prev => ({ ...prev, isCameraOn: false }));
        
        // Notify peers
        if (roomChannelRef.current) {
          await roomChannelRef.current.send({
            type: 'broadcast',
            event: 'camera-off',
            payload: { 
              userId,
              timestamp: Date.now() 
            },
          });
        }
      } else {
        // Turn on camera
        setState(prev => ({ ...prev, isCameraOn: true }));
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to toggle camera'));
      }
    }
  };
  
  // Initialize a WebRTC peer connection as the initiator
  const initiatePeerConnection = (stream: MediaStream) => {
    try {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      // Create peer connection using simple-peer or similar library
      // For now, we'll use a simplified approach
      const peer = createPeerConnection({
        initiator: true,
        trickle: true,
        stream
      });
      
      attachPeerEvents(peer);
      peerRef.current = peer;
    } catch (error) {
      console.error('Failed to initiate peer connection:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to initiate peer connection'));
      }
    }
  };
  
  // Handle a received WebRTC offer by creating a new peer connection
  const handleReceivedOffer = (offer: any) => {
    try {
      if (!state.localStream) {
        // If no local stream, we need to get one first
        toggleCamera();
        return;
      }
      
      // Create a new peer as the receiver
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      const peer = createPeerConnection({
        initiator: false,
        trickle: true,
        stream: state.localStream
      });
      
      attachPeerEvents(peer);
      
      // Process the received offer
      peer.signal(offer);
      peerRef.current = peer;
    } catch (error) {
      console.error('Failed to handle received offer:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to handle received offer'));
      }
    }
  };
  
  // Handle a received WebRTC answer
  const handleReceivedAnswer = (answer: any) => {
    try {
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    } catch (error) {
      console.error('Failed to handle received answer:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to handle received answer'));
      }
    }
  };
  
  // Handle ICE candidates
  const handleIceCandidate = (candidate: any) => {
    try {
      if (peerRef.current) {
        peerRef.current.signal(candidate);
      }
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
    }
  };
  
  // Attach event handlers to peer connection
  const attachPeerEvents = (peer: any) => {
    peer.on('signal', async (data: any) => {
      // Send signal to remote peer via Supabase
      if (roomChannelRef.current) {
        if (data.type === 'offer') {
          await roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-offer',
            payload: { 
              userId,
              offer: data,
              timestamp: Date.now() 
            },
          });
        } else if (data.type === 'answer') {
          await roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-answer',
            payload: { 
              userId,
              answer: data,
              timestamp: Date.now() 
            },
          });
        } else if (data.candidate) {
          await roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-ice',
            payload: { 
              userId,
              candidate: data,
              timestamp: Date.now() 
            },
          });
        }
      }
    });
    
    peer.on('connect', () => {
      console.log('WebRTC peer connection established');
      setState(prev => ({ ...prev, isConnected: true }));
      toast({
        title: "Video Connected",
        description: "Video connection established with remote participant.",
      });
    });
    
    peer.on('stream', (remoteMediaStream: MediaStream) => {
      console.log('Received remote stream');
      setState(prev => ({ ...prev, remoteStream: remoteMediaStream }));
    });
    
    peer.on('close', () => {
      console.log('WebRTC peer connection closed');
      setState(prev => ({ ...prev, isConnected: false, remoteStream: null }));
    });
    
    peer.on('error', (err: Error) => {
      console.error('WebRTC peer connection error:', err);
      setState(prev => ({ ...prev, isConnected: false }));
      if (onError) {
        onError(err);
      }
    });
  };
  
  // Clean up resources
  const destroyPeerConnection = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, localStream: null }));
    }
    
    setState(prev => ({ ...prev, remoteStream: null, isConnected: false }));
  };
  
  // Cleanup function for component unmount
  const cleanup = () => {
    destroyPeerConnection();
    
    // Notify peers that camera is off
    if (state.isCameraOn && roomChannelRef.current) {
      roomChannelRef.current.send({
        type: 'broadcast',
        event: 'camera-off',
        payload: { 
          userId,
          timestamp: Date.now() 
        },
      }).catch(err => console.error('Error broadcasting camera off:', err));
    }
  };
  
  return {
    localStream: state.localStream,
    remoteStream: state.remoteStream,
    isCameraOn: state.isCameraOn,
    isConnected: state.isConnected,
    error: state.error,
    toggleCamera,
    initiatePeerConnection,
    handleReceivedOffer,
    handleReceivedAnswer,
    handleIceCandidate,
    localVideoRef,
    remoteVideoRef,
    cleanup
  };
};

// Simplified peer connection creation (you may want to use a library like simple-peer)
function createPeerConnection(options: any) {
  // This is a placeholder - you should implement actual WebRTC peer connection
  // or use a library like simple-peer, peerjs, or similar
  console.log('Creating peer connection with options:', options);
  
  // For now, return a mock peer object
  return {
    signal: (data: any) => console.log('Signaling with:', data),
    destroy: () => console.log('Destroying peer connection'),
    on: (event: string, handler: Function) => {
      console.log(`Attaching ${event} handler`);
      // Mock event handling
    }
  };
} 