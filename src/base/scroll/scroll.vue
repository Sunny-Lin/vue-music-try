<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'scroll',
    props:{
      probeType:{
        type: Number,
        default: 1
      },
      listenScroll: {
        type: Boolean,
        default: true
      },
      click: {
        type: Boolean,
        default: true,
      },
      data: {
        type: Array,
        default: null
      },
    },
    mounted(){
      setTimeout(() => {
        this._initScroll();
      },20)
    },
    methods:{
      _initScroll(){
        if(!this.$refs.wrapper)
          return
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType: this.probeType,
          click: this.click
        })

        //是否监听滚动
        if(this.listenScroll){
          let me = this;
          this.scroll.on('scroll',(pos) => {
            me.$emit('scroll',pos)
          })
        }

      },
      refresh(){
         this.scroll && this.scroll.refresh();
      },
      enable(){
        this.scroll && this.scroll.enable();
      },
      disable(){
        this.scroll && this.scroll.disable()
      },
      scrollTo(){
        this.scroll && this.scroll.scroll.apply(this.scroll, arguments)
      },
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
    },
    watch:{
      data(){
        setTimeout(() => {
          this.refresh();
        },20)
      },
    }
  }
</script>

<style scoped>

</style>
