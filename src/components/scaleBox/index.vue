<template>
  <section 
    class="scale-box"
    :style="[
    {transform: `scale(${scale}) translate(-50%, -50%)`},
    {WebkitTransform: `scale(${scale}) translate(-50%, -50%)`},
    {width: width + 'px'},
    {height: height + 'px'}
    ]">
    <slot name="content"></slot>
  </section>
</template>

<script>
const debounce = function(fn, delay) {
  let delays = delay || 500;
  let timer;
  return function () {
    let th = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delays);
  };
}

export default {
  nmae: 'scale-box',
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scale: ''
    }
  },
  created() {
    this.setScale()
  },
  mounted() {
    window.addEventListener('resize', () => {debounce(this.setScale())})
  },
  methods: {
    getScale() {
      let ww = window.innerWidth / this.width
      let wh = window.innerHeight / this.height
      return ww < wh ? ww : wh
    },
    setScale() {
      this.scale = this.getScale()
    }

  }
}
</script>

<style lang="less" scoped>
.scale-box{
  display: flex;
  flex-direction: column;
  transform-origin: 0 0;
  position: fixed;
  left: 50%;
  top: 50%;
  transition: 0.3s;
  z-index: 999;
}
</style>