import PageIndex from '@/components/Utils/PageIndex.vue'
import { ParsePagination } from '@/utils/helper-functions.js'

export default {
  components: {
    PageIndex,
  },
  data () {
    return {
      pagination: {
        current: 1,
        total: 1,
        pagesize: 12,
      },
      list: [],
    }
  },
  methods: {
    // getData({pageSize, pageIndex}) {
    //
    // },
    // 页面切换
    pageIndexChange (index) {
      this.pagination.current = index
      this.getData()
    },
    parseData (res) {
      this.list = res.items
      this.pagination = ParsePagination(res.pagination)
    },
  }
}
