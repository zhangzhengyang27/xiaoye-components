---
title: LoginForm 登录表单
description: 面向认证场景的登录主链路组件。
outline: deep
---

# LoginForm 登录表单

`xy-login-form` 用来统一承接后台登录页中的用户名、密码、记住我和第三方登录入口展示。它只处理登录主链路，不承接注册、短信验证码和 OAuth 实现。

## 基础用法

:::demo 适合最常见的账号密码登录场景。
pro/login-form/basic
:::

## 第三方登录入口

:::demo `thirdPartyItems` 只负责展示入口并抛出事件，真正的授权流程由应用层处理。
pro/login-form/third-party
:::

## 登录页场景

:::demo 更接近真实后台时，LoginForm 往往会放在 PageContainer 或 Card 组合出的认证页里。
pro/login-form/workbench
:::

## LoginForm API

### LoginForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 登录表单数据 | `LoginFormModel` | — |
| `title` | 登录标题 | `string` | `'欢迎登录'` |
| `description` | 登录说明 | `string` | `'请输入账号信息后继续访问控制台。'` |
| `loading` | 提交中的加载态 | `boolean` | `false` |
| `disabled` | 是否禁用表单 | `boolean` | `false` |
| `submit-text` | 提交按钮文案 | `string` | `'登录'` |
| `show-remember` | 是否显示记住我 | `boolean` | `true` |
| `remember-label` | 记住我文案 | `string` | `'记住我'` |
| `username-placeholder` | 用户名占位文案 | `string` | `'请输入用户名'` |
| `password-placeholder` | 密码占位文案 | `string` | `'请输入密码'` |
| `rules` | 自定义校验规则，用于覆盖默认用户名/密码必填规则 | `FormRules` | `{}` |
| `third-party-items` | 第三方登录入口列表 | `LoginFormThirdPartyItem[]` | `[]` |

### LoginFormModel

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `username` | 用户名 | `string` |
| `password` | 密码 | `string` |
| `remember` | 是否记住我 | `boolean` |

### LoginFormThirdPartyItem

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `key` | 唯一标识 | `string` |
| `label` | 按钮文案 | `string` |
| `icon` | 图标名 | `string` |

### LoginForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `submit` | 校验通过并提交时触发 | `(model: LoginFormModel) => void` |
| `third-party-click` | 点击第三方登录入口时触发 | `(item: LoginFormThirdPartyItem) => void` |

### LoginForm Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `validate` | 手动触发表单校验 | `() => Promise<boolean>` |
| `submit` | 手动提交登录表单 | `() => Promise<boolean>` |
| `focus` | 聚焦到指定输入框 | `(field?: 'username' \| 'password') => void` |
