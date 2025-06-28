import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function PlayArea({ user }) {
  const opponentRef = useRef(null);

  useEffect(() => {
    socket.emit('register-user', user._id);

    socket.on('receive-challenge', ({ from }) => {
      const accept = window.confirm(`${from} challenged you. Accept?`);
      if (accept) {
        socket.emit('accept-challenge', { from, to: user._id });
      }
    });

    socket.on('start-game', () => {
      alert('Typing competition started!');
      // start typing timer/snippet logic here
    });

    return () => {
      socket.off('receive-challenge');
      socket.off('start-game');
    };
  }, [user]);

  const sendChallenge = (opponentId) => {
    socket.emit('send-challenge', { from: user._id, to: opponentId });
  };

  return (
    <div>
      <h2>Welcome {user.fullName}</h2>
      <button onClick={() => sendChallenge(opponentRef.current.value)}>Challenge</button>
      <input ref={opponentRef} placeholder="Opponent user ID" />
    </div>
  );
}
export default PlayArea;
