import { StaticRoutes } from 'expo-router';

declare module 'expo-router' {
  interface StaticRoutes {
    '/(drawer)/location/[id]': {
      params: { id: string };
    };
  }
} 