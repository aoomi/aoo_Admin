<template>
  <div class="pl20 pt20" v-loading="loading">
    <el-row>
      <el-col :span="12" style="border-right: 1px solid #ccc;">
        <h2 class="mb20">QQ客服</h2>
        <el-form :model="form" ref="formRef" label-width="100px">
          <el-form-item v-for="(item, index) in form.qq" label="QQ号" :prop="'qq.' + index" :key="index" :rules="rules">
            <div class="flex align-items-center">
              <el-input v-model="form.qq[index]" placeholder="请输入QQ号"></el-input>
              <el-button class="ml20" type="danger" @click.prevent="form.qq.splice(index, 1)">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="form.qq.push('')">新增QQ号</el-button>
            <!-- <el-button @click="formRef.resetFields()">重置</el-button> -->
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="pl20">
        <h2 class="mb20">微信客服</h2>
        <el-form :model="form" ref="formRef" label-width="100px">
          <el-form-item v-for="(item, index) in form.wx" label="微信号" :prop="'wx.' + index" :key="index" :rules="rules">
            <div class="flex align-items-center">
              <el-input v-model="form.wx[index]" placeholder="请输入微信号"></el-input>
              <el-button class="ml20" type="danger" @click.prevent="form.wx.splice(index, 1)">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="form.wx.push('')">新增微信号</el-button>
            <!-- <el-button @click="formRef.resetFields()">重置</el-button> -->
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { $http } from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';
// import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
// import { $http } from '/@/utils/request';

const loading = ref(false);
const form = ref({
  qq: [''],
  wx: [''],
});
const formRef = ref();
const rules = ref({ required: true, message: '文件名不能为空', trigger: 'blur' });
const submitForm = () => {
  formRef.value.validate(async (valid: boolean, fields?: any) => {
    if (valid) {
      try {
        await $http('/admin/setCustomerService', { service: JSON.stringify(form.value) });
        ElMessage({
          message: '设置成功',
          type: 'success',
        });
      } catch (error) {
        reportAdminError(error, 'customerService.update', '客服设置保存失败，请重试');
      }
    }
  });
};

const getCustomerService = async () => {
  try {
    loading.value = true;
    const res = await $http('/admin/getCustomerService');
    form.value.qq = res.service.qq || [];
    form.value.wx = res.service.wx || [];
  } catch (error) {
    ElMessage.error('获取客服失败');
  } finally {
    loading.value = false;
  }
};
getCustomerService();
</script>
