<template>
    <div>
      <ul>
        <li>第一栏</li>
        <li>第二栏</li>
        <li>第三栏</li>
        <li>第四联</li>
        <li>第五轮</li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: 'search'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  ul
    padding: 0
    margin: 0
    font-size: 12px
  li
    font-size: 20px
    padding: 5px 15px
    display: inline-block
    position: relative
    cursor: pointer
    transition: all 0.5s
  li
  &::before
    content: ''
    display: inline-block
    position: relative
    width: 0%
    bottom: 0
    left: 100%
    border-bottom: 2px solid #999
    transition: all 0.5s
  li
  &:hover
  &::before
    left: 0
    width: 100%
  li
  &:hover
    &~ li
      &::before
        left: 0


</style>
