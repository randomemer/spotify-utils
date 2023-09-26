import { defineStore } from "pinia";

const useCacheStore = defineStore("cache", {
  state: () =>
    ({
      recommends: {},
    } as CacheStoreState),
  getters: {
    getCachedRecommend: (state) => {
      return (id: string) => state.recommends[id];
    },
  },
  actions: {
    cacheRecommendData(data: RecommendsDataFull) {
      this.recommends[data.id] = data;
    },
  },
});

export default useCacheStore;
