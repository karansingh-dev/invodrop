export const calculateChange = (current: number, previous: number) => {
      if (previous === 0) {
        if (current === 0)
          return { percentChange: 0, trend: "flat" as const };
        return { percentChange: null, trend: "na" as const };
      }
     const diff = current - previous;
      const change = +((diff / previous) * 100).toFixed(2);

      return {
        percentChange: change,
        trend: change > 0 ? "up" : change < 0 ? "down" : "flat",
      };
    };