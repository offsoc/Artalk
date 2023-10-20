import ArtalkConfig from './artalk-config'
import { CommentData, NotifyData, PageData } from './artalk-data'
import type { EventPayloadMap } from './event'
import type { EventManagerFuncs } from '../src/lib/event-manager'
import { internal as internalLocales, I18n } from '../src/i18n'
import Api from '../src/api'
import User from '../src/lib/user'
import Comment from '../src/comment'
import { SidebarShowPayload } from '../src/layer/sidebar-layer'
import { CheckerCaptchaPayload, CheckerPayload } from '../src/lib/checker'
import type { TMarked } from '../src/lib/marked'
import type { TInjectedServices } from '../src/service'

/**
 * Context 接口
 *
 * (面向接口的编程)
 */
export default interface ContextApi extends EventManagerFuncs<EventPayloadMap> {
  /** Artalk 根元素对象 */
  $root: HTMLElement

  /** 依赖注入函数 */
  inject<K extends keyof TInjectedServices>(depName: K, obj: TInjectedServices[K]): void

  /** 获取依赖对象 */
  get<K extends keyof TInjectedServices>(depName: K): TInjectedServices[K]

  /** 配置对象 */
  // TODO 修改为 getConf() 和 setConf()
  conf: ArtalkConfig

  /** marked 依赖对象 */
  getMarkedInstance(): TMarked | undefined

  /** marked 内容替换器 */
  markedReplacers: ((raw: string) => string)[]

  /** 获取 API 以供 HTTP 请求 */
  getApi(): Api

  /** 获取评论实例对象列表 */
  getCommentList(): Comment[]

  /** 清空评论数据列表 */
  clearCommentList(): void

  /** 获取评论数据列表 */
  getCommentDataList(): CommentData[]

  /** 查找评论 */
  findComment(id: number): Comment|undefined

  /** 删除评论 */
  deleteComment(id: number): void

  /** 清空评论 */
  clearAllComments(): void

  /** 插入评论 */
  insertComment(commentData: CommentData): void

  /** 更新评论 */
  updateComment(commentData: CommentData): void

  /** 评论回复 */
  replyComment(commentData: CommentData, $comment: HTMLElement): void

  /** 编辑评论 */
  editComment(commentData: CommentData, $comment: HTMLElement): void

  /** 获取页面数据 */
  getPage(): PageData|undefined

  /** 更新页面数据 */
  updatePage(pageData: PageData): void

  /** 获取未读列表 */
  getUnreadList(): NotifyData[]

  /** 更新未读通知数据 */
  updateUnreadList(unreadList: NotifyData[]): void

  /** 列表 - 重新加载数据 */
  listReload(): void

  /** 列表 - 重新加载数据 (别名) */
  reload(): void

  /** 显示侧边栏 */
  showSidebar(payload?: SidebarShowPayload): void

  /** 隐藏侧边栏 */
  hideSidebar(): void

  /** 编辑器 - 显示加载 */
  editorShowLoading(): void

  /** 编辑器 - 隐藏加载 */
  editorHideLoading(): void

  /** 编辑器 - 显示提示消息 */
  editorShowNotify(msg: string, type: "i" | "s" | "w" | "e"): void

  /** 评论框 - 复原状态 */
  editorResetState(): void

  /** 验证码检测 */
  checkCaptcha(payload: CheckerCaptchaPayload): void

  /** 管理员检测 */
  checkAdmin(payload: CheckerPayload): void

  /** 管理员显示元素可见性更新 */
  checkAdminShowEl(): void

  /** i18n 翻译 */
  $t(key: keyof I18n, args?: {[key: string]: string}): string

  /** 设置夜间模式 */
  setDarkMode(darkMode: boolean): void

  /** 更新配置 */
  updateConf(conf: Partial<ArtalkConfig>): void
}
