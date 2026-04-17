import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD ? window.location.origin : "http://localhost:5001");

const VideoConsultationPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    let localStream;

    const createPeer = (socketId) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("webrtc-ice-candidate", {
            candidate: event.candidate,
            to: socketId
          });
        }
      };

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
      peerRef.current = peer;
      return peer;
    };

    const init = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const socket = io(socketUrl, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.emit("join-room", {
        roomId,
        user: { id: user._id, name: user.name, role: user.role }
      });

      socket.on("room-users", async (users) => {
        if (users.length) {
          const peer = createPeer(users[0]);
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socket.emit("webrtc-offer", { roomId, offer, to: users[0] });
        } else {
          setStatus("Waiting for another participant...");
        }
      });

      socket.on("user-joined", () => {
        setStatus("Participant joined");
      });

      socket.on("webrtc-offer", async ({ offer, from }) => {
        const peer = createPeer(from);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("webrtc-answer", { answer, to: from });
      });

      socket.on("webrtc-answer", async ({ answer }) => {
        if (peerRef.current) {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          setStatus("Connected");
        }
      });

      socket.on("webrtc-ice-candidate", async ({ candidate }) => {
        if (peerRef.current) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on("user-left", () => {
        setStatus("Participant left the room");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });
    };

    init().catch(() => setStatus("Unable to access camera or microphone"));

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      peerRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, [roomId, user]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Video consultation</h1>
        <p className="mt-2 text-slate-400">Room: {roomId}</p>
        <p className="mt-2 text-sm text-brand-100">{status}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="mb-3 text-sm text-slate-400">Local stream</p>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="aspect-video w-full rounded-2xl bg-black object-cover"
          />
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="mb-3 text-sm text-slate-400">Remote stream</p>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="aspect-video w-full rounded-2xl bg-black object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoConsultationPage;
