// 转化分页数据
export function ParsePagination (p) {
  return {
    total: p.pageCnt,
    current: p.pageIndex,
    pagesize: p.pageSize,
  }
}
