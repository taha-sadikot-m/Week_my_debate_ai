import MediaDevice from './MediaDevice.js';
import Emitter from './Emitter.js';

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnection extends Emitter {
  private pc: RTCPeerConnection | null = null;
  private mediaDevice: MediaDevice;
  private friendID: string;

  constructor(friendID: string) {
    super();
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event) => (this as any).emit('icecandidate', event.candidate);
    this.pc.ontrack = (event) => (this as any).emit('peerStream', event.streams[0]);
    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
  }

  start(isCaller: boolean) {
    this.mediaDevice
      .on('stream', (stream: MediaStream) => {
        stream.getTracks().forEach((track) => {
          this.pc?.addTrack(track, stream);
        });
        (this as any).emit('localStream', stream);
        if (isCaller) (this as any).emit('request', { to: this.friendID });
        else this.createOffer();
      })
      .start();
    return this;
  }

  stop(isStarter: boolean) {
    if (isStarter) {
      (this as any).emit('end', { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.pc?.close();
    this.pc = null;
    (this as any).off();
    return this;
  }

  createOffer() {
    this.pc?.createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer() {
    this.pc?.createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  getDescription(desc: RTCSessionDescriptionInit) {
    this.pc?.setLocalDescription(desc);
    (this as any).emit('call', { to: this.friendID, sdp: desc });
    return this;
  }

  setRemoteDescription(sdp: RTCSessionDescriptionInit) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc?.setRemoteDescription(rtcSdp);
    return this;
  }

  addIceCandidate(candidate: RTCIceCandidateInit) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc?.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default PeerConnection; 