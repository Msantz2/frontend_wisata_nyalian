export function searchData<T>(
  items: T[],
  query: string,
  fields: (keyof T | string)[]
): T[] {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return items.filter((item) => {
    return fields.some((field) => {
      const fieldStr = String(field);
      let value: unknown;

      if (fieldStr.includes('.')) {
        const parts = fieldStr.split('.');
        value = parts.reduce((obj: unknown, key: string) => {
          return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined;
        }, item);
      } else {
        value = item[field as keyof T];
      }
      
      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value === 'object') {
        const objStr = JSON.stringify(value).toLowerCase();
        return objStr.includes(normalizedQuery);
      }

      const stringValue = String(value).toLowerCase();
      return stringValue.includes(normalizedQuery);
    });
  });
}
