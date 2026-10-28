/*
 * Krate theme for ruTorrent — Chinese (Simplified) strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "外观";
theUILang.krVariantAuto     = "Auto (HarmonyUI)";
theUILang.krVariantDark = "深色";
theUILang.krVariantLight    = "浅色";
theUILang.kr_var_auto      = "自动";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "设为 0 表示无限制。";
theUILang.kr_decimals_hint  = "留空单元格以继承默认值。";
theUILang.kr_filter_trackers = "筛选 Tracker";
theUILang.kr_tracker        = "Tracker";
theUILang.kr_enabled        = "已启用";
theUILang.kr_grp_hashing    = "哈希校验";
theUILang.kr_grp_preload    = "预加载";
theUILang.kr_grp_buffers    = "缓冲区";
theUILang.kr_grp_limits     = "限制";
theUILang.kr_grp_network    = "网络";
theUILang.kr_grp_session    = "会话与超时";
theUILang.kr_grp_flags      = "标志";
theUILang.kr_stg_empty      = "没有匹配的 Tracker";
theUILang.kr_browse         = "浏览";
theUILang.kr_not_set        = "未设置";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "每行一个主机。格式：host|name1=value1;name2=value2（示例：tracker.example|uid=123;pass=abc）";
theUILang.krFindAtHelp      = "每行一个查询。格式：name|url -- 使用 {HASH} 表示 torrent 哈希（示例：Name|https://example.org/?q={HASH}）";
theUILang.krAnnounceHelp    = "每行一个 announce URL。";
theUILang.krBrowse          = "浏览";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = "将 .torrent 文件拖到此处或 {browse}";
theUILang.kr_tl_drop_hint    = "将 .png 拖到此处或 {browse}";
theUILang.kr_mi_general      = "常规";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "截图";
theUILang.kr_task_create     = "创建 torrent";
theUILang.kr_task_unpack     = "解压";
theUILang.kr_task_title      = "任务";
theUILang.kr_create_source_ph = "文件或文件夹的路径，或选择一个";
theUILang.kr_create_torrent  = "创建 torrent";
theUILang.kr_add_source      = "来源";
theUILang.kr_add_file        = "文件";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "默认下载目录";
theUILang.kr_label_to_list   = "选择一个已有标签";
theUILang.kr_help_trackers   = "每行一个 Tracker URL。";
theUILang.kr_help_seed       = "torrent 创建后立即开始做种。";
theUILang.kr_help_private    = "标记为私有：不使用 DHT 或 peer exchange。";
theUILang.kr_help_krbrid     = "创建 v1 + v2 混合 torrent。";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "是";
theUILang.kr_edit_no         = "否";
theUILang.kr_edit_change     = "更改";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "数据块";
theUILang.kr_chunks_size       = "大小";
theUILang.kr_chunks_done       = "完成";
theUILang.kr_chunks_seen       = "已见";
theUILang.kr_chunks_downloaded = "已下载";
theUILang.kr_chunks_mode       = "数据块图模式";
theUILang.kr_chunks_one        = "数据块 {n}";
theUILang.kr_chunks_range      = "数据块 {a}–{b}";
theUILang.kr_chunks_seen_count = "已见 {n} 次";
theUILang.kr_chunks_a11y_seen  = "数据块可用性图：{pct}% 的组已见，{n} 个数据块";
theUILang.kr_chunks_a11y_done  = "数据块完成图：{pct}% 完成，{n} 个数据块";
theUILang.kr_chunks_cell_one   = "1 格 = {n} 个数据块";
theUILang.kr_chunks_cell_many  = "1 格 = {n} 个数据块";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "复制";
theUILang.kr_det_download      = "下载";
theUILang.kr_det_upload        = "上传";
theUILang.kr_det_ratio         = "分享率";
theUILang.kr_det_eta           = "剩余时间";
theUILang.kr_det_elapsed       = "已用时间";
theUILang.kr_det_remaining     = "剩余大小";
theUILang.kr_det_swarm         = "群集";
theUILang.kr_det_seeds         = "种子";
theUILang.kr_det_peers         = "用户";
theUILang.kr_det_wasted        = "丢弃数据";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "状态";
theUILang.kr_det_next_announce = "下次 announce";
theUILang.kr_det_storage       = "存储";
theUILang.kr_det_save_path     = "保存路径";
theUILang.kr_det_open_fm       = "在文件管理器中打开";
theUILang.kr_det_free_disk     = "可用磁盘";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "注释";
theUILang.kr_det_updown        = "{up} 上传 / {down} 下载";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "现在到期";
theUILang.kr_det_outside_fm    = "在您的文件管理器主目录之外";
theUILang.kr_det_no_comment    = "无注释";
theUILang.kr_det_parent_dir    = "上级目录";
theUILang.kr_det_new_folder    = "新建文件夹";
theUILang.kr_det_path          = "路径";
theUILang.kr_det_recent_folders = "最近的文件夹";
theUILang.kr_det_toggle        = "切换 {name}";
theUILang.kr_det_downloaded    = "已下载";
theUILang.kr_det_uploaded      = "已上传";
theUILang.kr_det_clear_stats   = "清除统计";
theUILang.kr_det_console       = "控制台";
theUILang.kr_det_more_tabs     = "更多标签页";
theUILang.kr_det_more          = "更多";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "添加 torrent";
theUILang.kr_tb_remove     = "移除";
theUILang.kr_tb_start      = "开始";
theUILang.kr_tb_pause      = "暂停";
theUILang.kr_tb_stop       = "停止";
theUILang.kr_tb_settings   = "设置";
theUILang.kr_tb_help       = "帮助";
theUILang.kr_tb_logoff     = "注销";
theUILang.kr_tb_create     = "创建 torrent";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "插件";
theUILang.kr_search        = "搜索";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "放下以添加 torrent";
theUILang.krDropSub         = "将 .torrent 文件放到任意位置以添加";
theUILang.krPalActions      = "操作";
theUILang.krPalAdd          = "添加 torrent";
theUILang.krPalStart        = "开始所选";
theUILang.krPalPause        = "暂停所选";
theUILang.krPalStop         = "停止所选";
theUILang.krPalRemove       = "移除所选";
theUILang.krPalSettings     = "设置";
theUILang.krPalAppearance   = "外观";
theUILang.krPalSwitch       = "切换到 ";
theUILang.krPalFilters      = "筛选器";
theUILang.krPalAll          = "所有 torrent";
theUILang.krPalSearchGroup  = "搜索";
theUILang.krPalSearchFor    = "在 torrent 中搜索";
theUILang.krPalNoResults    = "没有匹配的命令";
theUILang.krPalPlaceholder  = "输入命令或搜索 torrent...";
theUILang.krPalNavigate     = "导航";
theUILang.krPalOpen         = "运行";
theUILang.krPalClose        = "关闭";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "界面行为、更新间隔和速度预设。";
theUILang.kr_stg_desc_dl          = "默认下载带宽限制和行为。";
theUILang.kr_stg_desc_con         = "监听端口、全局速率限制和连接上限。";
theUILang.kr_stg_desc_bt          = "DHT、peer exchange 和其他 BitTorrent 功能。";
theUILang.kr_stg_desc_fmt         = "大小、日期和数字的显示方式。";
theUILang.kr_stg_desc_ao          = "面向高级用户的底层选项。";
theUILang.kr_stg_desc_dev         = "诊断和仅供开发者使用的选项。";
theUILang.kr_stg_desc_loginmgr    = "供 autotools 和搜索使用的已保存 Tracker 登录信息。";
theUILang.kr_stg_desc_autotools   = "应用于匹配 torrent 的自动操作。";
theUILang.kr_stg_desc_xmpp        = "通过 XMPP 账户发送的聊天通知。";
theUILang.kr_stg_desc_cookies     = "获取 torrent 时按主机发送的 cookie。";
theUILang.kr_stg_desc_lookat      = "显示在 torrent 菜单上的自定义查询链接。";
theUILang.kr_stg_desc_retrackers  = "自动附加到新 torrent 的 Tracker。";
theUILang.kr_stg_desc_rss         = "RSS 订阅源和自动下载筛选器。";
theUILang.kr_stg_desc_scheduler   = "自动更改限制的时间窗口。";
theUILang.kr_stg_desc_extsearch   = "工具栏搜索使用的搜索引擎。";
theUILang.kr_stg_desc_unpack      = "自动解压已完成的压缩包。";
theUILang.kr_stg_desc_throttle    = "用于对 torrent 分组的命名带宽通道。";
theUILang.kr_stg_desc_ratio       = "分享率组以及在每个目标处采取的操作。";
theUILang.kr_stg_desc_screenshots = "从媒体文件生成的缩略图预览。";
theUILang.kr_stg_desc_uploadeta   = "用于估算做种的目标分享率和时间。";
theUILang.kr_stg_desc_history     = "事件日志保留和通知发送。";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "插件";
theUILang.kr_stg_filter      = "筛选设置";
theUILang.kr_stg_no_match    = "没有匹配的设置";
theUILang.kr_acct_login      = "{name} 登录名";
theUILang.kr_acct_password   = "{name} 密码";
theUILang.kr_acct_autologin  = "{name} 自动登录";
theUILang.kr_unit_bytes      = "字节";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "哈希校验间隔";
theUILang.kr_ao_hash_max_tries       = "哈希校验最大尝试次数";
theUILang.kr_ao_hash_read_ahead      = "哈希预读";
theUILang.kr_ao_preload_type         = "预加载类型";
theUILang.kr_ao_preload_min_size     = "预加载最小大小";
theUILang.kr_ao_preload_required_rate = "预加载所需速率";
theUILang.kr_ao_receive_buffer_size  = "接收缓冲区大小";
theUILang.kr_ao_send_buffer_size     = "发送缓冲区大小";
theUILang.kr_ao_max_downloads_div    = "最大下载数除数";
theUILang.kr_ao_max_uploads_div      = "最大上传数除数";
theUILang.kr_ao_max_file_size        = "最大文件大小";
theUILang.kr_ao_split_file_size      = "拆分文件大小";
theUILang.kr_ao_split_suffix         = "拆分后缀";
theUILang.kr_ao_http_cacert          = "HTTP CA 证书";
theUILang.kr_ao_http_capath          = "HTTP CA 路径";
theUILang.kr_ao_http_proxy           = "HTTP 代理";
theUILang.kr_ao_proxy_address        = "代理地址";
theUILang.kr_ao_bind                 = "绑定地址";
theUILang.kr_ao_session              = "会话目录";
theUILang.kr_ao_timeout_safe_sync    = "安全同步超时";
theUILang.kr_ao_timeout_sync         = "同步超时";
theUILang.kr_empty_ratio_rules       = "暂无分享率规则";
theUILang.kr_empty_rss_filters       = "暂无筛选器";
theUILang.kr_empty_rss_group         = "此组中暂无订阅源";
theUILang.kr_empty_checklist        = "未选择任何内容";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "选择图标";
theUILang.kr_icons_tab_icons     = "图标";
theUILang.kr_icons_tab_upload    = "上传图片";
theUILang.kr_icons_search        = "搜索图标";
theUILang.kr_icons_categories    = "分类";
theUILang.kr_icons_tint          = "着色";
theUILang.kr_icons_tint_auto     = "自动（变体）";
theUILang.kr_icons_upload_aria   = "上传 PNG 图片";
theUILang.kr_icons_drop_title    = "将 PNG 放到此处或点击浏览";
theUILang.kr_icons_drop_hint     = "仅限 PNG。在普通 ruTorrent 中也会显示。";
theUILang.kr_icons_upload_note   = "上传的图片保持原样，并优先于所选字形。移除它可回退到智能默认值。";
theUILang.kr_icons_reset         = "重置为智能默认值";
theUILang.kr_icons_use           = "使用图标";
theUILang.kr_icons_remove        = "移除图片";
theUILang.kr_icons_upload_btn    = "上传";
theUILang.kr_icons_no_match      = "没有图标匹配 “{term}”";
theUILang.kr_icons_cat_all       = "全部";
theUILang.kr_icons_more_cats     = "更多分类";
theUILang.kr_icons_more          = "更多";
theUILang.kr_icons_more_count    = "更多（{n}）";
theUILang.kr_icons_upload_failed = "上传失败：{msg}";
theUILang.kr_icons_sub_tracker   = "Tracker: {name}";
theUILang.kr_icons_sub_label     = "标签: {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "选择一个 torrent 查看其概览";
theUILang.kr_det_empty_files    = "选择一个 torrent 查看其文件";
theUILang.kr_det_empty_trackers = "选择一个 torrent 查看其 Tracker";
theUILang.kr_det_empty_peers    = "选择一个 torrent 查看其用户";
theUILang.kr_det_empty_pieces   = "选择一个 torrent 查看其分片";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "折叠侧边栏";
theUILang.kr_nav_expand   = "展开侧边栏";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "无匹配项";
theUILang.krNoOptions = "无选项";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "没有连接的用户";
theUILang.kr_peerFlagIncoming  = "传入连接";
theUILang.kr_peerFlagEncrypted = "已加密";
theUILang.kr_peerFlagSnubbed   = "已忽略";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "Krate 的新功能";
theUILang.kr_wn_link          = "新功能";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "有可用更新：v{version}";
theUILang.kr_wn_update_hint = "KRATE：通过 HarmonyUI 更新 ruTorrent，或运行 {cmd}。";
theUILang.kr_wn_update_manual = "手动安装：在主题文件夹中运行 {cmd}。";
theUILang.kr_wn_none          = "暂无发行说明。";
theUILang.krPalHelp            = "帮助";
