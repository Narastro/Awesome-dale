interface Config {
  credential: {
    serviceId: string;
    key: string;
  };
}

export const config: Config = {
  credential: {
    serviceId: import.meta.env.VITE_SERVICE_ID,
    key: import.meta.env.VITE_SERVICE_KEY,
  },
};
