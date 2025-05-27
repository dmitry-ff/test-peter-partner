import { useEffect, useRef, useState } from "react";
import { AppShell, Flex, TextInput } from "@mantine/core";
import { ExchangeItem } from "./components/ui/exchange-item";
import { useQueries } from "@tanstack/react-query";
import { getEndOfDayAPI } from "./api";
import { getCloseDataBySymbol } from "./utils/getCloseDataBySymbol.ts";

const SYMBOLS = ["BTC/USD", "EUR/USD", "XAU/USD"];

function App() {
  const ws = useRef<WebSocket | null>(null);

  const [state, setState] = useState({});
  const [search, setSearch] = useState("");

  const combinedData = useQueries({
    queries: SYMBOLS.map((symbol) => ({
      queryKey: ["EndOfDay", symbol],
      queryFn: () => getEndOfDayAPI(symbol),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useEffect(() => {
    ws.current = new WebSocket(
      `wss://ws.twelvedata.com/v1/quotes/price?apikey=${import.meta.env.API_KEY}`,
    );

    ws.current.onopen = (e) => {
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
    };

    ws.current?.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      if (data.symbol) {
        setState((prevState) => {
          const history = prevState[data.symbol]?.history ?? [];
          const newHistory =
            history.length === 7
              ? [...history.slice(1), Math.floor(data.price) % 100]
              : [...history, Math.floor(data.price) % 100];
          return {
            ...prevState,
            [data.symbol]: { ...data, history: newHistory },
          };
        });
      }
    });
  }, []);

  const valuesToMap = Object.values(state);

  const filteredValues = search
    ? valuesToMap.filter((item) =>
        item.symbol.toLowerCase().includes(search.toLowerCase()),
      )
    : valuesToMap;

  return (
    <AppShell>
      <AppShell.Main>
        <Flex w={350} direction="column" gap="md" m="auto">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredValues?.map((item) => (
            <ExchangeItem
              key={item.symbol}
              symbol={item.symbol}
              currencyBase={item["currency_base"]}
              price={item.price}
              chartData={item.history}
              diff={
                +getCloseDataBySymbol(combinedData.data ?? [], item?.symbol)
                  ?.close - item.price || 0
              }
            />
          ))}
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
