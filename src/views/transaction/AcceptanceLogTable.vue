<template>
  <el-table :data="tableData">
    <el-table-column
      label="验收结论"
      width="200px"
      align="center"
      prop="concls"
    >
      <template slot-scope="scope"> 确认验收，详情见附件 </template>
    </el-table-column>
    <el-table-column label="验收人" align="center" prop="concls">
      <template slot-scope="scope">
        {{ scope.row.checker || '张三' }}
      </template>
    </el-table-column>
    <el-table-column label="验收图片" align="center" prop="concls">
      <template slot-scope="scope">
        <el-button
          type="text"
          @click="$emit('image-preview', scope.row)"
          icon="el-icon-picture-outline"
          >({{ (scope.row.imgList || []).length }})</el-button
        >
      </template>
    </el-table-column>
    <el-table-column
      label="提交时间"
      width="150px"
      align="center"
      prop="sumbitTime"
    >
      <template slot-scope="scope">
        {{ scope.row.sumbitTime || '2023-02-23 17:13' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'AcceptanceLogTable',

  data() {
    return {
      // ...
      tableData: [
        {
          id: 'c1',
          concls: '1',
        },
        {
          id: 'c2',
          concls: '2',
        },
      ],
    };
  },

  created() {
    // TODO:
    // - 调用接口
  },
};
</script>
