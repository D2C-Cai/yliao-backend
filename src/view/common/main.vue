<template>
  <div>
    <template v-if="LocalStorage.getItem('USER_INFO').supplierId">
      <SupplierManual />
    </template>
    <template v-else-if="LocalStorage.getItem('USER_INFO').p2pId">
      <P2pManual />
    </template>
    <template v-else>
      欢迎 {{LocalStorage.getItem('USER_INFO').role.name}} {{LocalStorage.getItem('USER_INFO').name}} 登陆成功！
    </template>
  </div>
</template>

<script>
import SupplierManual from "../../components/SupplierManual";
import P2pManual from "../../components/P2pManual";
export default {
  name: "index",
  components: {
    SupplierManual,
    P2pManual
  }
};
</script>

<style scoped>
</style>
