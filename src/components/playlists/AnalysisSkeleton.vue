<script setup lang="ts">
import TrackItemSkeleton from "@/components/track/TrackItemSkeleton.vue";
</script>

<template>
  <div class="analysis">
    <div class="first-col">
      <div class="basic-info card">
        <div class="name skeleton"></div>
        <div class="desc skeleton"></div>
        <div class="desc skeleton"></div>
      </div>

      <div class="avg-popularity card">
        <div class="top-row skeleton"></div>
        <div class="bottom-row">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </div>

    <div class="genres card">
      <h3 class="skeleton"></h3>
      <div class="donut-chart-skeleton skeleton">
        <div class="donut-cutout"></div>
      </div>
    </div>

    <div class="artists card">
      <h3 class="skeleton"></h3>
      <div class="top-artists">
        <TrackItemSkeleton :key="i" v-for="(_, i) in Array(3)" />
      </div>
      <span class="more"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.first-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: inherit;
}

.analysis {
  margin: 4.8rem 0;
  display: grid;
  gap: 4.8rem;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: stretch;
}

.card {
  padding: 2.4rem;
}

.basic-info {
  background: linear-gradient(rgba(115, 0, 153, 0.75), rgba(0, 0, 0, 0.75));
  flex-grow: 1;

  .name {
    height: 1.8rem;
    margin-bottom: 1.8rem;
    width: 50%;
  }

  .desc {
    height: 1.4rem;
    width: 100%;

    &:last-child {
      margin-top: 1rem;
    }
  }
}

.avg-popularity {
  .top-row {
    margin-bottom: 1.8rem;
    height: 1.6rem;
    width: 100%;
  }

  .bottom-row {
    display: flex;
    gap: 1rem;

    .skeleton {
      height: 1.6rem;
      width: 100%;
      &:first-child {
        width: 40%;
      }
    }
  }
}

.genres {
  display: flex;
  flex-direction: column;

  h3 {
    width: 60%;
    height: 1.8rem;
    margin-bottom: 1.8rem;
  }

  .donut-chart-skeleton {
    width: 22.5rem;
    height: 22.5rem;
    border-radius: 100rem;
    align-self: center;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .donut-cutout {
    background-color: general.$card-color;
    height: 50%;
    width: 50%;
    border-radius: 100rem;
  }

  .donut-cutout,
  .donut-chart-skeleton {
    border: darkgray dashed 2px;
  }
}

.artists {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  justify-content: space-between;

  h3 {
    height: 1.8rem;
    width: 60%;
  }

  .top-artists {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
}
</style>
