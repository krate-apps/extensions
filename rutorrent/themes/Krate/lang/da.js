/*
 * Krate theme for ruTorrent — Danish strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "Udseende";
theUILang.krVariantAuto     = "Auto (HarmonyUI)";
theUILang.krVariantDark = "Mørk";
theUILang.krVariantLight    = "Lys";
theUILang.kr_var_auto      = "Auto";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "Sæt 0 for ubegrænset.";
theUILang.kr_decimals_hint  = "Lad en celle stå tom for at arve standarden.";
theUILang.kr_filter_trackers = "Filtrér trackers";
theUILang.kr_tracker        = "Tracker";
theUILang.kr_enabled        = "Aktiveret";
theUILang.kr_grp_hashing    = "Hashing";
theUILang.kr_grp_preload    = "Preload";
theUILang.kr_grp_buffers    = "Buffere";
theUILang.kr_grp_limits     = "Grænser";
theUILang.kr_grp_network    = "Netværk";
theUILang.kr_grp_session    = "Session og timeouts";
theUILang.kr_grp_flags      = "Flag";
theUILang.kr_stg_empty      = "Ingen matchende trackers";
theUILang.kr_browse         = "Gennemse";
theUILang.kr_not_set        = "Ikke angivet";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "Én vært pr. linje. Format: host|name1=value1;name2=value2 (eksempel: tracker.example|uid=123;pass=abc)";
theUILang.krFindAtHelp      = "Ét opslag pr. linje. Format: name|url -- brug {HASH} for torrentens hash (eksempel: Name|https://example.org/?q={HASH})";
theUILang.krAnnounceHelp    = "Én announce-URL pr. linje.";
theUILang.krBrowse          = "Gennemse";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = "Træk .torrent-filer hertil eller {browse}";
theUILang.kr_tl_drop_hint    = "Træk en .png hertil eller {browse}";
theUILang.kr_mi_general      = "Generelt";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "Skærmbilleder";
theUILang.kr_task_create     = "Opret torrent";
theUILang.kr_task_unpack     = "Udpak";
theUILang.kr_task_title      = "Opgave";
theUILang.kr_create_source_ph = "Sti til en fil eller mappe, eller vælg en";
theUILang.kr_create_torrent  = "Opret torrent";
theUILang.kr_add_source      = "Kilde";
theUILang.kr_add_file        = "Fil";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "Standard download-mappe";
theUILang.kr_label_to_list   = "Vælg en eksisterende etiket";
theUILang.kr_help_trackers   = "Én tracker-URL pr. linje.";
theUILang.kr_help_seed       = "Start seeding så snart torrenten er oprettet.";
theUILang.kr_help_private    = "Markér som privat: ingen DHT eller peer exchange.";
theUILang.kr_help_krbrid     = "Opret en v1 + v2 hybrid-torrent.";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "Ja";
theUILang.kr_edit_no         = "Nej";
theUILang.kr_edit_change     = "Skift";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "Chunks";
theUILang.kr_chunks_size       = "Størrelse";
theUILang.kr_chunks_done       = "Færdig";
theUILang.kr_chunks_seen       = "Set";
theUILang.kr_chunks_downloaded = "Downloadet";
theUILang.kr_chunks_mode       = "Chunk-kort tilstand";
theUILang.kr_chunks_one        = "Chunk {n}";
theUILang.kr_chunks_range      = "Chunks {a}–{b}";
theUILang.kr_chunks_seen_count = "{n}× set";
theUILang.kr_chunks_a11y_seen  = "Chunk-tilgængelighedskort: {pct}% af grupper set, {n} chunks";
theUILang.kr_chunks_a11y_done  = "Chunk-færdiggørelseskort: {pct}% færdig, {n} chunks";
theUILang.kr_chunks_cell_one   = "1 celle = {n} chunk";
theUILang.kr_chunks_cell_many  = "1 celle = {n} chunks";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "Kopiér";
theUILang.kr_det_download      = "Download";
theUILang.kr_det_upload        = "Upload";
theUILang.kr_det_ratio         = "Ratio";
theUILang.kr_det_eta           = "ETA";
theUILang.kr_det_elapsed       = "Forløbet";
theUILang.kr_det_remaining     = "Tilbage";
theUILang.kr_det_swarm         = "Sværm";
theUILang.kr_det_seeds         = "Seeds";
theUILang.kr_det_peers         = "Peers";
theUILang.kr_det_wasted        = "Spildt";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "Status";
theUILang.kr_det_next_announce = "Næste announce";
theUILang.kr_det_storage       = "Lager";
theUILang.kr_det_save_path     = "Gemmesti";
theUILang.kr_det_open_fm       = "Åbn i Filhåndtering";
theUILang.kr_det_free_disk     = "Ledig plads";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "Kommentar";
theUILang.kr_det_updown        = "{up} op / {down} ned";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "forfalder nu";
theUILang.kr_det_outside_fm    = "Uden for din Filhåndtering-hjemmemappe";
theUILang.kr_det_no_comment    = "Ingen kommentar";
theUILang.kr_det_parent_dir    = "Overordnet mappe";
theUILang.kr_det_new_folder    = "Ny mappe";
theUILang.kr_det_path          = "Sti";
theUILang.kr_det_recent_folders = "Seneste mapper";
theUILang.kr_det_toggle        = "Skift {name}";
theUILang.kr_det_downloaded    = "Downloadet";
theUILang.kr_det_uploaded      = "Uploadet";
theUILang.kr_det_clear_stats   = "Ryd statistik";
theUILang.kr_det_console       = "Konsol";
theUILang.kr_det_more_tabs     = "Flere faner";
theUILang.kr_det_more          = "Mere";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "Tilføj torrent";
theUILang.kr_tb_remove     = "Fjern";
theUILang.kr_tb_start      = "Start";
theUILang.kr_tb_pause      = "Pause";
theUILang.kr_tb_stop       = "Stop";
theUILang.kr_tb_settings   = "Indstillinger";
theUILang.kr_tb_help       = "Hjælp";
theUILang.kr_tb_logoff     = "Log af";
theUILang.kr_tb_create     = "Opret torrent";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "Plugins";
theUILang.kr_search        = "Søg";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "Slip for at tilføje torrents";
theUILang.krDropSub         = "Slip .torrent-filer hvor som helst for at tilføje dem";
theUILang.krPalActions      = "Handlinger";
theUILang.krPalAdd          = "Tilføj torrent";
theUILang.krPalStart        = "Start valgte";
theUILang.krPalPause        = "Pause valgte";
theUILang.krPalStop         = "Stop valgte";
theUILang.krPalRemove       = "Fjern valgte";
theUILang.krPalSettings     = "Indstillinger";
theUILang.krPalAppearance   = "Udseende";
theUILang.krPalSwitch       = "Skift til ";
theUILang.krPalFilters      = "Filtre";
theUILang.krPalAll          = "Alle torrents";
theUILang.krPalSearchGroup  = "Søg";
theUILang.krPalSearchFor    = "Søg torrents efter";
theUILang.krPalNoResults    = "Ingen matchende kommandoer";
theUILang.krPalPlaceholder  = "Skriv en kommando eller søg torrents...";
theUILang.krPalNavigate     = "naviger";
theUILang.krPalOpen         = "kør";
theUILang.krPalClose        = "luk";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "Grænsefladeadfærd, opdateringsinterval og hastighedsforvalg.";
theUILang.kr_stg_desc_dl          = "Standard båndbreddegrænser og adfærd for download.";
theUILang.kr_stg_desc_con         = "Lytteport, globale hastighedsgrænser og forbindelseslofter.";
theUILang.kr_stg_desc_bt          = "DHT, peer exchange og andre BitTorrent-funktioner.";
theUILang.kr_stg_desc_fmt         = "Hvordan størrelser, datoer og tal vises.";
theUILang.kr_stg_desc_ao          = "Lavniveauindstillinger for avancerede brugere.";
theUILang.kr_stg_desc_dev         = "Diagnostik- og udviklerindstillinger.";
theUILang.kr_stg_desc_loginmgr    = "Gemte tracker-logins brugt af autotools og søgning.";
theUILang.kr_stg_desc_autotools   = "Automatiske handlinger anvendt på matchende torrents.";
theUILang.kr_stg_desc_xmpp        = "Chat-notifikationer leveret via en XMPP-konto.";
theUILang.kr_stg_desc_cookies     = "Cookies pr. vært sendt ved hentning af torrents.";
theUILang.kr_stg_desc_lookat      = "Brugerdefinerede opslagslinks vist i torrent-menuen.";
theUILang.kr_stg_desc_retrackers  = "Trackers tilføjet automatisk til nye torrents.";
theUILang.kr_stg_desc_rss         = "RSS-feeds og auto-download-filtre.";
theUILang.kr_stg_desc_scheduler   = "Tidsvinduer der ændrer grænser automatisk.";
theUILang.kr_stg_desc_extsearch   = "Søgemaskiner brugt af værktøjslinjesøgningen.";
theUILang.kr_stg_desc_unpack      = "Automatisk udpakning af fuldførte arkiver.";
theUILang.kr_stg_desc_throttle    = "Navngivne båndbreddekanaler til gruppering af torrents.";
theUILang.kr_stg_desc_ratio       = "Ratio-grupper og handlingerne ved hvert mål.";
theUILang.kr_stg_desc_screenshots = "Miniaturevisninger genereret fra mediefiler.";
theUILang.kr_stg_desc_uploadeta   = "Målratio og tid brugt til at estimere seeding.";
theUILang.kr_stg_desc_history     = "Opbevaring af hændelseslog og levering af notifikationer.";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "Plugins";
theUILang.kr_stg_filter      = "Filtrér indstillinger";
theUILang.kr_stg_no_match    = "Ingen matchende indstillinger";
theUILang.kr_acct_login      = "{name} login";
theUILang.kr_acct_password   = "{name} adgangskode";
theUILang.kr_acct_autologin  = "{name} autologin";
theUILang.kr_unit_bytes      = "bytes";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "Hash-tjek interval";
theUILang.kr_ao_hash_max_tries       = "Hash-tjek maks. forsøg";
theUILang.kr_ao_hash_read_ahead      = "Hash read-ahead";
theUILang.kr_ao_preload_type         = "Preload-type";
theUILang.kr_ao_preload_min_size     = "Preload minimumsstørrelse";
theUILang.kr_ao_preload_required_rate = "Preload krævet hastighed";
theUILang.kr_ao_receive_buffer_size  = "Modtagebufferstørrelse";
theUILang.kr_ao_send_buffer_size     = "Sendebufferstørrelse";
theUILang.kr_ao_max_downloads_div    = "Maks. downloads divisor";
theUILang.kr_ao_max_uploads_div      = "Maks. uploads divisor";
theUILang.kr_ao_max_file_size        = "Maksimal filstørrelse";
theUILang.kr_ao_split_file_size      = "Opdel filstørrelse";
theUILang.kr_ao_split_suffix         = "Opdelingssuffiks";
theUILang.kr_ao_http_cacert          = "HTTP CA-certifikat";
theUILang.kr_ao_http_capath          = "HTTP CA-sti";
theUILang.kr_ao_http_proxy           = "HTTP-proxy";
theUILang.kr_ao_proxy_address        = "Proxy-adresse";
theUILang.kr_ao_bind                 = "Bind-adresse";
theUILang.kr_ao_session              = "Session-mappe";
theUILang.kr_ao_timeout_safe_sync    = "Safe sync timeout";
theUILang.kr_ao_timeout_sync         = "Sync timeout";
theUILang.kr_empty_ratio_rules       = "Ingen ratio-regler endnu";
theUILang.kr_empty_rss_filters       = "Ingen filtre endnu";
theUILang.kr_empty_rss_group         = "Ingen feeds i denne gruppe endnu";
theUILang.kr_empty_checklist        = "Intet valgt";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "Vælg ikon";
theUILang.kr_icons_tab_icons     = "Ikoner";
theUILang.kr_icons_tab_upload    = "Upload billede";
theUILang.kr_icons_search        = "Søg ikoner";
theUILang.kr_icons_categories    = "Kategorier";
theUILang.kr_icons_tint          = "Farvetone";
theUILang.kr_icons_tint_auto     = "Auto (variant)";
theUILang.kr_icons_upload_aria   = "Upload et PNG-billede";
theUILang.kr_icons_drop_title    = "Slip en PNG her eller klik for at gennemse";
theUILang.kr_icons_drop_hint     = "Kun PNG. Vises også i almindelig ruTorrent.";
theUILang.kr_icons_upload_note   = "Et uploadet billede bevares som det er og har forrang over en valgt glyf. Fjern det for at falde tilbage til den smarte standard.";
theUILang.kr_icons_reset         = "Nulstil til smart standard";
theUILang.kr_icons_use           = "Brug ikon";
theUILang.kr_icons_remove        = "Fjern billede";
theUILang.kr_icons_upload_btn    = "Upload";
theUILang.kr_icons_no_match      = "Ingen ikoner matcher “{term}”";
theUILang.kr_icons_cat_all       = "Alle";
theUILang.kr_icons_more_cats     = "Flere kategorier";
theUILang.kr_icons_more          = "Mere";
theUILang.kr_icons_more_count    = "Mere ({n})";
theUILang.kr_icons_upload_failed = "Upload mislykkedes: {msg}";
theUILang.kr_icons_sub_tracker   = "Tracker: {name}";
theUILang.kr_icons_sub_label     = "Etiket: {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "Vælg en torrent for at se dens oversigt";
theUILang.kr_det_empty_files    = "Vælg en torrent for at se dens filer";
theUILang.kr_det_empty_trackers = "Vælg en torrent for at se dens trackers";
theUILang.kr_det_empty_peers    = "Vælg en torrent for at se dens peers";
theUILang.kr_det_empty_pieces   = "Vælg en torrent for at se dens stykker";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "Skjul sidebjælke";
theUILang.kr_nav_expand   = "Udvid sidebjælke";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "Ingen match";
theUILang.krNoOptions = "Ingen valg";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "Ingen peers forbundet";
theUILang.kr_peerFlagIncoming  = "Indgående forbindelse";
theUILang.kr_peerFlagEncrypted = "Krypteret";
theUILang.kr_peerFlagSnubbed   = "Snubbet";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "Nyheder i Krate";
theUILang.kr_wn_link          = "Nyheder";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "Opdatering tilgængelig: v{version}";
theUILang.kr_wn_update_hint = "KRATE: opdater ruTorrent fra HarmonyUI eller kør {cmd}.";
theUILang.kr_wn_update_manual = "Manuel installation: kør {cmd} i tema-mappen.";
theUILang.kr_wn_none          = "Ingen udgivelsesnoter endnu.";
theUILang.krPalHelp            = "Hjælp";
