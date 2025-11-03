'use client';

import WebSocketClient from './lib/ws';
import { WebSocketEvent, EventAction } from './lib/definitions';

import { useRef, useState, useEffect } from 'react';

import Ping from '@/components/ping';

export default function Home() {
  const conn = useRef<WebSocketClient | null>(null);
  const [delay, setDelay] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocketClient('hub');

    ws.socket.onmessage = (raw) => {
      const e = JSON.parse(raw.data) as WebSocketEvent;
      handleEvent(e);
    };

    ws.socket.onopen = () => {
      conn.current = ws;
    };

    ws.socket.onclose = () => {
      conn.current = ws;
    };

    return () => ws.close();
  }, []);

  function handleEvent(e: WebSocketEvent) {
    switch (e.a) {
      case EventAction.Ping:
        conn.current?.sendEvent({ a: EventAction.Pong, p: null });
        setDelay(e.p);
        break;
    }
  }

  return (
    <main className="h-full max-w-screen-xl mx-auto ">
      <div className="flex justify-center items-center h-full text-4xl">
        <Ping delay={delay} />
      </div>
    </main>
  );
}
