import { useState } from "react";
import { AppShell, Flex, Group, Radio, TextInput } from "@mantine/core";
import { ExchangeItem } from "./components/ui/exchange-item";
import { useQueries } from "@tanstack/react-query";
import { getEndOfDayAPI } from "./api";
import { getCloseDataBySymbol } from "./utils/getCloseDataBySymbol.ts";
import { SYMBOLS } from "./constants.ts";
import { SHOW_TYPE } from "./enums.ts";
import { useGetTwelveData } from "./hooks/useGetTwelvedata.ts";
import type { Price } from "./types/api.ts";

type ExtendedPrice = Price & {
  diff: number;
  history: number[];
};

function App() {
  const [state, setState] = useState<Record<string, ExtendedPrice>>({});
  const [search, setSearch] = useState("");
  const [showType, setShowType] = useState(SHOW_TYPE.ALL);

  const combinedData = useQueries({
    queries: SYMBOLS.map((symbol) => ({
      queryKey: ["EndOfDay", symbol],
      queryFn: () => getEndOfDayAPI(symbol),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useGetTwelveData({
    onMessage(data) {
      setState((prevState) => {
        const history = prevState[data.symbol]?.history ?? [];
        const newHistory =
          history.length === 7
            ? [...history.slice(1), Math.floor(data.price) % 100]
            : [...history, Math.floor(data.price) % 100];
        return {
          ...prevState,
          [data.symbol]: {
            ...data,
            history: newHistory,
            diff:
              +getCloseDataBySymbol(combinedData.data ?? [], data.symbol)
                ?.close - data.price || 0,
          },
        };
      });
    },
  });

  const valuesToMap = Object.values(state);

  const filteredValuesBySymbol = search
    ? valuesToMap.filter((item) =>
        item.symbol.toLowerCase().includes(search.toLowerCase()),
      )
    : valuesToMap;

  const filteredValuesByType = filteredValuesBySymbol.filter((item) => {
    if (showType === SHOW_TYPE.DOWN) {
      return item.diff < 0;
    }

    if (showType === SHOW_TYPE.UP) {
      return item.diff > 0;
    }

    return true;
  });

  return (
    <AppShell>
      <AppShell.Main>
        <Flex w={550} direction="column" gap="md" m="auto">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Radio.Group value={showType} onChange={setShowType}>
            <Group>
              <Radio label="Только растущие" value={SHOW_TYPE.UP} />
              <Radio label="Только падающие" value={SHOW_TYPE.DOWN} />
              <Radio label="Все" value={SHOW_TYPE.ALL} />
            </Group>
          </Radio.Group>
          {filteredValuesByType?.map((item) => (
            <ExchangeItem
              key={item.symbol}
              symbol={item.symbol}
              currencyBase={item["currency_base"]}
              price={item.price}
              chartData={item.history}
              diff={item.diff}
            />
          ))}
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
