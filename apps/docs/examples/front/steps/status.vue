<template>
  <xyu-steps :active="2">
    <xyu-step title="提交订单" />
    <xyu-step title="支付成功" status="success" />
    <xyu-step title="等待发货" status="process" />
  </xyu-steps>
</template>
