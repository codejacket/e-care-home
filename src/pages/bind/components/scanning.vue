<script lang="ts" setup></script>

<template>
  <view class="scan-container">
    <view class="scanning">
      <view class="scan-line" />
      <up-icon name="wifi" size="48" color="#3b82f6" />
    </view>
    <text class="scan-text">
      正在扫描中
      <text class="dot1">.</text>
      <text class="dot2">.</text>
      <text class="dot3">.</text>
    </text>
  </view>
</template>

<style lang="scss" scoped>
.scan-container {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .scanning {
    position: relative;
    width: 8rem;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid rgb(219 234 254);

    .scan-line {
      border: 2px solid #3b82f6;
      animation: scan 2s infinite ease-in-out;
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    @keyframes scan {
      0% {
        transform: scale(0.8);
        opacity: 0.3;
      }

      50% {
        transform: scale(1.25);
        opacity: 0.6;
      }

      100% {
        transform: scale(0.8);
        opacity: 0.3;
      }
    }
  }

  .scan-text {
    margin-top: 2rem;
    font-weight: 700;
    color: rgb(55, 65, 81);
    letter-spacing: 0.1em;

    .dot2 {
      animation: dot2 2s infinite ease-in-out;
    }

    .dot3 {
      animation: dot3 2s infinite ease-in-out;
      animation-delay: 1.33;
    }

    @keyframes dot2 {
      0% {
        opacity: 0;
      }

      33%,
      100% {
        opacity: 1;
      }
    }

    @keyframes dot3 {
      0% {
        opacity: 0;
      }

      66%,
      100% {
        opacity: 1;
      }
    }
  }
}
</style>
