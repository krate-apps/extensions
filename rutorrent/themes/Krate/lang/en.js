/*
 * Krate theme for ruTorrent — English strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "Appearance";
theUILang.krVariantAuto     = "Auto (HarmonyUI)";
theUILang.krVariantDark = "Dark";
theUILang.krVariantLight    = "Light";
theUILang.kr_var_auto      = "Auto";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "Set 0 for unlimited.";
theUILang.kr_decimals_hint  = "Leave a cell blank to inherit the default.";
theUILang.kr_filter_trackers = "Filter trackers";
theUILang.kr_tracker        = "Tracker";
theUILang.kr_enabled        = "Enabled";
theUILang.kr_grp_hashing    = "Hashing";
theUILang.kr_grp_preload    = "Preload";
theUILang.kr_grp_buffers    = "Buffers";
theUILang.kr_grp_limits     = "Limits";
theUILang.kr_grp_network    = "Network";
theUILang.kr_grp_session    = "Session and timeouts";
theUILang.kr_grp_flags      = "Flags";
theUILang.kr_stg_empty      = "No matching trackers";
theUILang.kr_browse         = "Browse";
theUILang.kr_not_set        = "Not set";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "One host per line. Format: host|name1=value1;name2=value2 (example: tracker.example|uid=123;pass=abc)";
theUILang.krFindAtHelp      = "One lookup per line. Format: name|url -- use {HASH} for the torrent hash (example: Name|https://example.org/?q={HASH})";
theUILang.krAnnounceHelp    = "One announce URL per line.";
theUILang.krBrowse          = "Browse";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = "Drag .torrent files here or {browse}";
theUILang.kr_tl_drop_hint    = "Drag a .png here or {browse}";
theUILang.kr_mi_general      = "General";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "Screenshots";
theUILang.kr_task_create     = "Create Torrent";
theUILang.kr_task_unpack     = "Unpack";
theUILang.kr_task_title      = "Task";
theUILang.kr_create_source_ph = "Path to a file or folder, or pick one";
theUILang.kr_create_torrent  = "Create torrent";
theUILang.kr_add_source      = "Source";
theUILang.kr_add_file        = "File";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "Default download directory";
theUILang.kr_label_to_list   = "Choose an existing label";
theUILang.kr_help_trackers   = "One tracker URL per line.";
theUILang.kr_help_seed       = "Start seeding as soon as the torrent is created.";
theUILang.kr_help_private    = "Mark as private: no DHT or peer exchange.";
theUILang.kr_help_krbrid     = "Create a v1 + v2 hybrid torrent.";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "Yes";
theUILang.kr_edit_no         = "No";
theUILang.kr_edit_change     = "Change";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "Chunks";
theUILang.kr_chunks_size       = "Size";
theUILang.kr_chunks_done       = "Done";
theUILang.kr_chunks_seen       = "Seen";
theUILang.kr_chunks_downloaded = "Downloaded";
theUILang.kr_chunks_mode       = "Chunk map mode";
theUILang.kr_chunks_one        = "Chunk {n}";
theUILang.kr_chunks_range      = "Chunks {a}–{b}";
theUILang.kr_chunks_seen_count = "{n}× seen";
theUILang.kr_chunks_a11y_seen  = "Chunk availability map: {pct}% of groups seen, {n} chunks";
theUILang.kr_chunks_a11y_done  = "Chunk completion map: {pct}% complete, {n} chunks";
theUILang.kr_chunks_cell_one   = "1 cell = {n} chunk";
theUILang.kr_chunks_cell_many  = "1 cell = {n} chunks";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "Copy";
theUILang.kr_det_download      = "Download";
theUILang.kr_det_upload        = "Upload";
theUILang.kr_det_ratio         = "Ratio";
theUILang.kr_det_eta           = "ETA";
theUILang.kr_det_elapsed       = "Elapsed";
theUILang.kr_det_remaining     = "Remaining";
theUILang.kr_det_swarm         = "Swarm";
theUILang.kr_det_seeds         = "Seeds";
theUILang.kr_det_peers         = "Peers";
theUILang.kr_det_wasted        = "Wasted";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "Status";
theUILang.kr_det_next_announce = "Next announce";
theUILang.kr_det_storage       = "Storage";
theUILang.kr_det_save_path     = "Save path";
theUILang.kr_det_open_fm       = "Open in File Manager";
theUILang.kr_det_free_disk     = "Free disk";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "Comment";
theUILang.kr_det_updown        = "{up} up / {down} down";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "due now";
theUILang.kr_det_outside_fm    = "Outside your File Manager home";
theUILang.kr_det_no_comment    = "No comment";
theUILang.kr_det_parent_dir    = "Parent directory";
theUILang.kr_det_new_folder    = "New folder";
theUILang.kr_det_path          = "Path";
theUILang.kr_det_recent_folders = "Recent folders";
theUILang.kr_det_toggle        = "Toggle {name}";
theUILang.kr_det_downloaded    = "Downloaded";
theUILang.kr_det_uploaded      = "Uploaded";
theUILang.kr_det_clear_stats   = "Clear statistics";
theUILang.kr_det_console       = "Console";
theUILang.kr_det_more_tabs     = "More tabs";
theUILang.kr_det_more          = "More";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "Add torrent";
theUILang.kr_tb_remove     = "Remove";
theUILang.kr_tb_start      = "Start";
theUILang.kr_tb_pause      = "Pause";
theUILang.kr_tb_stop       = "Stop";
theUILang.kr_tb_settings   = "Settings";
theUILang.kr_tb_help       = "Help";
theUILang.kr_tb_logoff     = "Log off";
theUILang.kr_tb_create     = "Create torrent";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "Plugins";
theUILang.kr_search        = "Search";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "Drop to add torrents";
theUILang.krDropSub         = "Release .torrent files anywhere to add them";
theUILang.krPalActions      = "Actions";
theUILang.krPalAdd          = "Add torrent";
theUILang.krPalStart        = "Start selected";
theUILang.krPalPause        = "Pause selected";
theUILang.krPalStop         = "Stop selected";
theUILang.krPalRemove       = "Remove selected";
theUILang.krPalSettings     = "Settings";
theUILang.krPalAppearance   = "Appearance";
theUILang.krPalSwitch       = "Switch to ";
theUILang.krPalFilters      = "Filters";
theUILang.krPalAll          = "All torrents";
theUILang.krPalSearchGroup  = "Search";
theUILang.krPalSearchFor    = "Search torrents for";
theUILang.krPalNoResults    = "No matching commands";
theUILang.krPalPlaceholder  = "Type a command or search torrents...";
theUILang.krPalNavigate     = "navigate";
theUILang.krPalOpen         = "run";
theUILang.krPalClose        = "close";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "Interface behavior, update interval and speed presets.";
theUILang.kr_stg_desc_dl          = "Default download bandwidth limits and behavior.";
theUILang.kr_stg_desc_con         = "Listening port, global rate limits and connection caps.";
theUILang.kr_stg_desc_bt          = "DHT, peer exchange and other BitTorrent features.";
theUILang.kr_stg_desc_fmt         = "How sizes, dates and numbers are displayed.";
theUILang.kr_stg_desc_ao          = "Lower-level options for advanced users.";
theUILang.kr_stg_desc_dev         = "Diagnostic and developer-only options.";
theUILang.kr_stg_desc_loginmgr    = "Stored tracker logins used by autotools and search.";
theUILang.kr_stg_desc_autotools   = "Automatic actions applied to matching torrents.";
theUILang.kr_stg_desc_xmpp        = "Chat notifications delivered over an XMPP account.";
theUILang.kr_stg_desc_cookies     = "Per-host cookies sent when fetching torrents.";
theUILang.kr_stg_desc_lookat      = "Custom lookup links shown on the torrent menu.";
theUILang.kr_stg_desc_retrackers  = "Trackers appended automatically to new torrents.";
theUILang.kr_stg_desc_rss         = "RSS feeds and auto-download filters.";
theUILang.kr_stg_desc_scheduler   = "Time windows that change limits automatically.";
theUILang.kr_stg_desc_extsearch   = "Search engines used by the toolbar search.";
theUILang.kr_stg_desc_unpack      = "Automatic extraction of completed archives.";
theUILang.kr_stg_desc_throttle    = "Named bandwidth channels for grouping torrents.";
theUILang.kr_stg_desc_ratio       = "Ratio groups and the actions taken at each target.";
theUILang.kr_stg_desc_screenshots = "Thumbnail previews generated from media files.";
theUILang.kr_stg_desc_uploadeta   = "Target ratio and time used to estimate seeding.";
theUILang.kr_stg_desc_history     = "Event log retention and notification delivery.";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "Plugins";
theUILang.kr_stg_filter      = "Filter settings";
theUILang.kr_stg_no_match    = "No matching settings";
theUILang.kr_acct_login      = "{name} login";
theUILang.kr_acct_password   = "{name} password";
theUILang.kr_acct_autologin  = "{name} autologin";
theUILang.kr_unit_bytes      = "bytes";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "Hash check interval";
theUILang.kr_ao_hash_max_tries       = "Hash check max tries";
theUILang.kr_ao_hash_read_ahead      = "Hash read-ahead";
theUILang.kr_ao_preload_type         = "Preload type";
theUILang.kr_ao_preload_min_size     = "Preload minimum size";
theUILang.kr_ao_preload_required_rate = "Preload required rate";
theUILang.kr_ao_receive_buffer_size  = "Receive buffer size";
theUILang.kr_ao_send_buffer_size     = "Send buffer size";
theUILang.kr_ao_max_downloads_div    = "Max downloads divisor";
theUILang.kr_ao_max_uploads_div      = "Max uploads divisor";
theUILang.kr_ao_max_file_size        = "Maximum file size";
theUILang.kr_ao_split_file_size      = "Split file size";
theUILang.kr_ao_split_suffix         = "Split suffix";
theUILang.kr_ao_http_cacert          = "HTTP CA certificate";
theUILang.kr_ao_http_capath          = "HTTP CA path";
theUILang.kr_ao_http_proxy           = "HTTP proxy";
theUILang.kr_ao_proxy_address        = "Proxy address";
theUILang.kr_ao_bind                 = "Bind address";
theUILang.kr_ao_session              = "Session directory";
theUILang.kr_ao_timeout_safe_sync    = "Safe sync timeout";
theUILang.kr_ao_timeout_sync         = "Sync timeout";
theUILang.kr_empty_ratio_rules       = "No ratio rules yet";
theUILang.kr_empty_rss_filters       = "No filters yet";
theUILang.kr_empty_rss_group         = "No feeds in this group yet";
theUILang.kr_empty_checklist        = "Nothing selected";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "Choose icon";
theUILang.kr_icons_tab_icons     = "Icons";
theUILang.kr_icons_tab_upload    = "Upload image";
theUILang.kr_icons_search        = "Search icons";
theUILang.kr_icons_categories    = "Categories";
theUILang.kr_icons_tint          = "Tint";
theUILang.kr_icons_tint_auto     = "Auto (variant)";
theUILang.kr_icons_upload_aria   = "Upload a PNG image";
theUILang.kr_icons_drop_title    = "Drop a PNG here or click to browse";
theUILang.kr_icons_drop_hint     = "PNG only. Shown in plain ruTorrent too.";
theUILang.kr_icons_upload_note   = "An uploaded image is kept as-is and takes priority over a chosen glyph. Remove it to fall back to the smart default.";
theUILang.kr_icons_reset         = "Reset to smart default";
theUILang.kr_icons_use           = "Use icon";
theUILang.kr_icons_remove        = "Remove image";
theUILang.kr_icons_upload_btn    = "Upload";
theUILang.kr_icons_no_match      = "No icons match “{term}”";
theUILang.kr_icons_cat_all       = "All";
theUILang.kr_icons_more_cats     = "More categories";
theUILang.kr_icons_more          = "More";
theUILang.kr_icons_more_count    = "More ({n})";
theUILang.kr_icons_upload_failed = "Upload failed: {msg}";
theUILang.kr_icons_sub_tracker   = "Tracker: {name}";
theUILang.kr_icons_sub_label     = "Label: {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "Select a torrent to see its overview";
theUILang.kr_det_empty_files    = "Select a torrent to see its files";
theUILang.kr_det_empty_trackers = "Select a torrent to see its trackers";
theUILang.kr_det_empty_peers    = "Select a torrent to see its peers";
theUILang.kr_det_empty_pieces   = "Select a torrent to see its pieces";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "Collapse sidebar";
theUILang.kr_nav_expand   = "Expand sidebar";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "No matches";
theUILang.krNoOptions = "No options";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "No peers connected";
theUILang.kr_peerFlagIncoming  = "Incoming connection";
theUILang.kr_peerFlagEncrypted = "Encrypted";
theUILang.kr_peerFlagSnubbed   = "Snubbed";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "What's new in Krate";
theUILang.kr_wn_link          = "What's new";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "Update available: v{version}";
theUILang.kr_wn_update_hint = "KRATE: update ruTorrent from HarmonyUI or run {cmd}.";
theUILang.kr_wn_update_manual = "Manual install: run {cmd} in the theme folder.";
theUILang.kr_wn_none          = "No release notes yet.";
theUILang.krPalHelp            = "Help";
