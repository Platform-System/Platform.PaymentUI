export const getEnv = (key: string): string => {
  return (window as unknown as Record<string, Record<string, string>>).__ENV__?.[key] || import.meta.env[key] || '';
};
