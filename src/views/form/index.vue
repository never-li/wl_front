<template>
    <div class="app-container">

        <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai"></el-option>
          <el-option label="Zone two" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="Pick a time" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type"></el-checkbox>
          <el-checkbox label="Promotion activities" name="type"></el-checkbox>
          <el-checkbox label="Offline activities" name="type"></el-checkbox>
          <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor"></el-radio>
          <el-radio label="Venue"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>

    </div>
</template>

<script>
export default {
  name: 'form',
  components: {
  },
  data() {
    return {
      isEdit: true,
      displayItems: [
        {
          label: '产品',
          name: 'product',
          width: '180',
          display: 'select',
          options: [
            {
              companyid: '1029',
              label: '佛山市骏盛贸易有限公司',
              value: '佛山骏盛',
              cutype: 1,
              id: 'ms00000002'
            },
            {
              companyid: '0',
              label: '佛山市骏洋钢铁贸易有限公司',
              value: '佛山骏洋',
              cutype: 1,
              id: 'ms00002605'
            }
          ]
        },
        {
          label: '日期',
          name: 'date',
          width: '280',
          display: 'date'
        },
        {
          label: '材质',
          name: 'grade',
          width: '180',
          display: 'input'
        },
        {
          label: '捆包号',
          name: 'steelcode',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        },
        {
          label: '重量方式',
          name: 'weightflag',
          width: '180',
          display: 'input'
        }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',

        type: 'warning'
      })
    },
    getData() {
      this.$message('获取了表单数据，请打开控制台查看')
    },
    check() {
      this.$refs.commonForm.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('数据校验成功,请打开控制台查看数据')
        }
      })
    }
  },
  created() {
  },
  computed: {
  }
}
</script>

<style scoped>
</style>

