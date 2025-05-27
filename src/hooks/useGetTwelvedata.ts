import { useEffect, useRef } from "react";
import { SYMBOLS } from "../constants.ts";
import { getCloseDataBySymbol } from "../utils/getCloseDataBySymbol.ts";
import type { Price } from "../types/api.ts";

type Args = {
  onMessage(data: any): void;
};

export const useGetTwelveData = ({ onMessage }: Args) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `wss://ws.twelvedata.com/v1/quotes/price?apikey=${import.meta.env.VITE_API_KEY}`,
    );

    ws.current?.addEventListener("open", (e) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.send(
          JSON.stringify({
            action: "subscribe",
            params: {
              symbols: SYMBOLS.join(","),
            },
          }),
        );
      }
    });

    ws.current?.addEventListener("message", (e) => {
      const data = JSON.parse(e.data) as Price;
      if (data.symbol) {
        onMessage(data);
      }
    });

    return () => {
      if (ws?.current?.readyState === WebSocket.OPEN) {
        ws?.current?.send(JSON.stringify({ action: "unsubscribe" }));
        ws?.current?.close();
      }
    };
  }, []);
};
