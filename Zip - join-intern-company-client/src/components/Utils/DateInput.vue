<template lang="html">
  <div class="date-time-selector col">
      <datepicker v-model="date" language="zh" :format="'yyyy年MM月dd日'"></datepicker>
  </div>
</template>

<script>
  // 默认返回的时间格式， 2017-10-24 12:00:00
  import Datepicker from 'vuejs-datepicker'
  import moment from 'moment'

  export default {
    name: 'DateInput',
    data () {
      return {
        date: new Date()
      }
    },
    watch: {
      date () {
        this.emit()
      },
      value () {
        this.date = new Date(this.value)
      },
    },
    components: {
      Datepicker,
    },
    methods: {
      dateChange () {
        this.emit()
      },
      emit () {
        let value = this.combine()
        this.$emit('input', value)
      },
      combine () {
        let date = moment(this.date).format('YYYY-MM-DD 00:00:00')

        return `${date}`
      },
    },
    props: {
      mode: {
        type: String,
        default () {
          return 'DateTime'
        }
      },
      value: {
        type: String,
        default () {
          return ''
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .date-time-selector {
    display: block;
    border: 1px solid #E5E6EB;

    line-height: 32px;
    height: 32px;
    padding: 0 10px;
    font-size: 15px;
  }
</style>
