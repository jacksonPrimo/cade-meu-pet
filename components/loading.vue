<template>
   <div class="loading-overlay">
      <img src="../static/images/loading.gif" alt="Loading">
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.185);    
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-overlay img {
    width: 200px;
    height: 200px;
    animation: floatAnimation 1s infinite alternate;
}

@keyframes floatAnimation {
  from {
    transform: translateY(10px);
  }
  to {
    transform: translateY(-10px);
  }
}

</style>