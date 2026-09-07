export function filterData<T>(
  items: T[],
  filters: Record<string, unknown>
): T[] {
  return items.filter((item) => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (filterValue === null || filterValue === undefined || filterValue === "") {
        return true;
      }

      const itemValue = item[key as keyof T];

      if (Array.isArray(filterValue) && filterValue.length === 0) {
        return true;
      }

      if (Array.isArray(filterValue)) {
        if (Array.isArray(itemValue)) {
          return filterValue.some((fv) => (itemValue as unknown[]).includes(fv));
        }
        return filterValue.includes(itemValue);
      }

      if (typeof filterValue === "boolean") {
        return itemValue === filterValue;
      }

      return itemValue === filterValue;
    });
  });
}
