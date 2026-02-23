import type { IAuthLoginRes, ICaptcha, IDoubleTokenRes, IUpdateInfo, IUpdatePassword, IUserInfoRes } from './types/login'
import { http } from '@/http/http'

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string
  password: string
}

export default {
  /**
   * 获取验证码
   * @returns ICaptcha 验证码
   */
  getCode() {
    return http.get<ICaptcha>('/user/getCode')
  },
  /**
   * 用户登录
   * @param loginForm 登录表单
   */
  login(loginForm: ILoginForm) {
    return http.post<IAuthLoginRes>('/auth/login', loginForm)
  },
  /**
   * 退出登录
   */
  logout() {
    return http.get<void>('/auth/logout')
  },
  /**
   * 刷新token
   * @param refreshToken 刷新token
   */
  refreshToken(refreshToken: string) {
    return http.post<IDoubleTokenRes>('/auth/refreshToken', { refreshToken })
  },
  /**
   * 获取用户信息
   */
  getUserInfo() {
    return http.get<IUserInfoRes>('/user/info')
  },
  /**
   * 修改用户信息
   */
  updateInfo(data: IUpdateInfo) {
    return http.post('/user/updateInfo', data)
  },
  /**
   * 修改用户密码
   */
  updateUserPassword(data: IUpdatePassword) {
    return http.post('/user/updatePassword', data)
  },
  /**
   * 获取微信登录凭证
   * @returns Promise 包含微信登录凭证(code)
   */
  getWxCode() {
    return new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: res => resolve(res),
        fail: err => reject(new Error(err)),
      })
    })
  },
  /**
   * 微信登录
   * @param params 微信登录参数，包含code
   * @returns Promise 包含登录结果
   */
  wxLogin(data: { code: string }) {
    return http.post<IAuthLoginRes>('/auth/wxLogin', data)
  },
}
