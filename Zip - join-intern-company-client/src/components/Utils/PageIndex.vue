<template lang="html">
  <div class="page-index">
    <div class="btn-pre pointer-on" @click="goPre">
      {{'<'}}
    </div>
    <div class="index-number">
      <span v-for="index in pageIndexRange"
        class="page-index-item pointer-on"
        @click="changeIndex(index)"
        :class="{selected: index === current}">
        {{index}}
      </span>

      <span v-if="showMoreBtn" class="page-index-item pointer-on"
            @click="toggleShowAll(true)">
        ...
      </span>
    </div>
    <div class="btn-next pointer-on" @click="goNext">
      {{'>'}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      showAll: false,
    }
  },
  methods: {
    goPre () {
      let nextIndex = this.current - 1
      this.changeIndex(nextIndex)

      this.showAll = false
    },
    goNext () {
      let nextIndex = this.current + 1
      this.changeIndex(nextIndex)
      this.showAll = false
    },
    changeIndex (nextIndex) {
      if (nextIndex <= 0) nextIndex = 1
      if (nextIndex > this.total) nextIndex = this.total
      // if (nextIndex !== this.current)
      this.$emit('change', nextIndex)
    },
    toggleShowAll (b = true) {
      this.showAll = b
    },
  },
  computed: {
    pageIndexRange () {
      let length = this.length
      let current = this.current
      let total = this.total
      let showAll = this.showAll

      let pageIndexList = []
      let start = current > 1 ? current - 1 : 1
      if (showAll) {
        while (start <= total) {
          pageIndexList.push(start)
          start += 1
        }
      } else {
        while (pageIndexList.length < length) {
          pageIndexList.push(start)
          start += 1
          if (start > total) break
        }
      }

      return pageIndexList
    },
    showMoreBtn () {
      let total = this.total
      let current = this.current
      let numberAfter = 2

      if (this.showAll) return false

      if (current + numberAfter < (total + 1)) {
        return true
      }
      return false
    },
  },
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    length: {
      type: Number,
      default: 3,
    },
  }
}
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .page-index {
    width: 100%;
    background-color: white;
    display: block;
    text-align: center;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    height: 56px;
    padding: 15px 20px;
    user-select: none;

    .btn-pre,
    .btn-next {
      background: white;
      color: #BFBFBF;
      border: 1px solid #E5E6EB;
      display: inline-block;
      width: 32px-2;
      height: 26px-2;
      line-height: 20px-2;
      // box-sizing: content-box;

      text-align: center;
    }
    .page-index-item {
      display: inline-block;
      font-family: AvenirNext-Regular;
      font-size: 16px;
      color: #454F66;
      letter-spacing: 0;

      width: 28px;
      height: 26px;
      line-height: 26px;
      margin: 0 15px;
      text-align: center;


      &.selected {
        background-color: #0DABF4;
        color: white;
      }
    }
  }
</style>
