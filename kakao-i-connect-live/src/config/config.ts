import Remon from "@remotemonster/sdk";

interface Config {
  credential: {
    serviceId: string;
    key: string;
  };
}

const config: Config = {
  credential: {
    serviceId: import.meta.env.VITE_SERVICE_ID,
    key: import.meta.env.VITE_SERVICE_KEY,
  },
};

const listener = {
  onInit() {
    console.log("init!");
  },
};

export const client = new Remon({ config, listener });
client.createRoom("hi");
