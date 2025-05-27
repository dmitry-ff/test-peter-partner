import { Stack, Paper, Text, Group, Badge } from "@mantine/core";
import { Sparkline } from "@mantine/charts";

type Props = {
  symbol: string;
  currencyBase: string;
  price: number;
  chartData: number[];
  diff: number;
};

export const ExchangeItem = ({
  symbol,
  currencyBase,
  price,
  chartData,
  diff,
}: Props) => {
  return (
    <Paper p="md" shadow="xs">
      <Group justify="space-between">
        <Stack gap="xs">
          <Text fw={700} c="dark.8">
            {symbol}
          </Text>
          <Text maw={100} truncate="end" c="gray.8">
            {currencyBase}
          </Text>
        </Stack>
        <Sparkline
          w={200}
          h={60}
          data={chartData}
          curveType="natural"
          color={diff < 0 ? "grey" : "blue"}
          fillOpacity={0.27}
          strokeWidth={2}
        />
        <Stack gap="xs" justify="flex-end">
          <Text>{price}</Text>
          <Badge
            opacity={diff < 0 ? 0.5 : 1}
            color="dark.8"
            radius="sm"
            fz="xs"
          >
            {diff.toFixed(5)}
          </Badge>
        </Stack>
      </Group>
    </Paper>
  );
};
