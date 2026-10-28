/*
 * Krate theme for ruTorrent — German strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "Darstellung";
theUILang.krVariantAuto     = "Auto (HarmonyUI)";
theUILang.krVariantDark = "Dunkel";
theUILang.krVariantLight    = "Hell";
theUILang.kr_var_auto      = "Auto";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "0 für unbegrenzt eingeben.";
theUILang.kr_decimals_hint  = "Eine Zelle leer lassen, um den Standard zu übernehmen.";
theUILang.kr_filter_trackers = "Tracker filtern";
theUILang.kr_tracker        = "Tracker";
theUILang.kr_enabled        = "Aktiviert";
theUILang.kr_grp_hashing    = "Hashing";
theUILang.kr_grp_preload    = "Preload";
theUILang.kr_grp_buffers    = "Puffer";
theUILang.kr_grp_limits     = "Limits";
theUILang.kr_grp_network    = "Netzwerk";
theUILang.kr_grp_session    = "Sitzung und Timeouts";
theUILang.kr_grp_flags      = "Flags";
theUILang.kr_stg_empty      = "Keine passenden Tracker";
theUILang.kr_browse         = "Durchsuchen";
theUILang.kr_not_set        = "Nicht gesetzt";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "Ein Host pro Zeile. Format: host|name1=value1;name2=value2 (Beispiel: tracker.example|uid=123;pass=abc)";
theUILang.krFindAtHelp      = "Eine Abfrage pro Zeile. Format: name|url -- {HASH} für den Torrent-Hash verwenden (Beispiel: Name|https://example.org/?q={HASH})";
theUILang.krAnnounceHelp    = "Eine Announce-URL pro Zeile.";
theUILang.krBrowse          = "Durchsuchen";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = ".torrent-Dateien hierher ziehen oder {browse}";
theUILang.kr_tl_drop_hint    = "Eine .png hierher ziehen oder {browse}";
theUILang.kr_mi_general      = "Allgemein";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "Screenshots";
theUILang.kr_task_create     = "Torrent erstellen";
theUILang.kr_task_unpack     = "Entpacken";
theUILang.kr_task_title      = "Aufgabe";
theUILang.kr_create_source_ph = "Pfad zu einer Datei oder einem Ordner, oder einen auswählen";
theUILang.kr_create_torrent  = "Torrent erstellen";
theUILang.kr_add_source      = "Quelle";
theUILang.kr_add_file        = "Datei";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "Standard-Download-Verzeichnis";
theUILang.kr_label_to_list   = "Eine vorhandene Gruppe wählen";
theUILang.kr_help_trackers   = "Eine Tracker-URL pro Zeile.";
theUILang.kr_help_seed       = "Mit dem Seeden beginnen, sobald der Torrent erstellt ist.";
theUILang.kr_help_private    = "Als privat markieren: kein DHT oder Peer Exchange.";
theUILang.kr_help_krbrid     = "Einen v1 + v2 Hybrid-Torrent erstellen.";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "Ja";
theUILang.kr_edit_no         = "Nein";
theUILang.kr_edit_change     = "Ändern";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "Chunks";
theUILang.kr_chunks_size       = "Grösse";
theUILang.kr_chunks_done       = "Fertig";
theUILang.kr_chunks_seen       = "Gesehen";
theUILang.kr_chunks_downloaded = "Heruntergeladen";
theUILang.kr_chunks_mode       = "Chunk-Karten-Modus";
theUILang.kr_chunks_one        = "Chunk {n}";
theUILang.kr_chunks_range      = "Chunks {a}–{b}";
theUILang.kr_chunks_seen_count = "{n}× gesehen";
theUILang.kr_chunks_a11y_seen  = "Chunk-Verfügbarkeitskarte: {pct}% der Gruppen gesehen, {n} Chunks";
theUILang.kr_chunks_a11y_done  = "Chunk-Fortschrittskarte: {pct}% fertig, {n} Chunks";
theUILang.kr_chunks_cell_one   = "1 Zelle = {n} Chunk";
theUILang.kr_chunks_cell_many  = "1 Zelle = {n} Chunks";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "Kopieren";
theUILang.kr_det_download      = "Download";
theUILang.kr_det_upload        = "Upload";
theUILang.kr_det_ratio         = "Rate";
theUILang.kr_det_eta           = "ETA";
theUILang.kr_det_elapsed       = "Verstrichen";
theUILang.kr_det_remaining     = "Rest";
theUILang.kr_det_swarm         = "Schwarm";
theUILang.kr_det_seeds         = "Seeds";
theUILang.kr_det_peers         = "Peers";
theUILang.kr_det_wasted        = "Unbrauchbar";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "Status";
theUILang.kr_det_next_announce = "Nächstes Announce";
theUILang.kr_det_storage       = "Speicher";
theUILang.kr_det_save_path     = "Speicherpfad";
theUILang.kr_det_open_fm       = "Im Dateimanager öffnen";
theUILang.kr_det_free_disk     = "Freier Speicher";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "Kommentar";
theUILang.kr_det_updown        = "{up} hoch / {down} runter";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "jetzt fällig";
theUILang.kr_det_outside_fm    = "Ausserhalb Ihres Dateimanager-Ordners";
theUILang.kr_det_no_comment    = "Kein Kommentar";
theUILang.kr_det_parent_dir    = "Übergeordneter Ordner";
theUILang.kr_det_new_folder    = "Neuer Ordner";
theUILang.kr_det_path          = "Pfad";
theUILang.kr_det_recent_folders = "Zuletzt verwendete Ordner";
theUILang.kr_det_toggle        = "{name} umschalten";
theUILang.kr_det_downloaded    = "Heruntergeladen";
theUILang.kr_det_uploaded      = "Hochgeladen";
theUILang.kr_det_clear_stats   = "Statistik löschen";
theUILang.kr_det_console       = "Konsole";
theUILang.kr_det_more_tabs     = "Weitere Tabs";
theUILang.kr_det_more          = "Mehr";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "Torrent hinzufügen";
theUILang.kr_tb_remove     = "Entfernen";
theUILang.kr_tb_start      = "Start";
theUILang.kr_tb_pause      = "Pause";
theUILang.kr_tb_stop       = "Stopp";
theUILang.kr_tb_settings   = "Einstellungen";
theUILang.kr_tb_help       = "Hilfe";
theUILang.kr_tb_logoff     = "Abmelden";
theUILang.kr_tb_create     = "Torrent erstellen";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "Plugins";
theUILang.kr_search        = "Suchen";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "Zum Hinzufügen ablegen";
theUILang.krDropSub         = ".torrent-Dateien überall ablegen, um sie hinzuzufügen";
theUILang.krPalActions      = "Aktionen";
theUILang.krPalAdd          = "Torrent hinzufügen";
theUILang.krPalStart        = "Auswahl starten";
theUILang.krPalPause        = "Auswahl pausieren";
theUILang.krPalStop         = "Auswahl stoppen";
theUILang.krPalRemove       = "Auswahl entfernen";
theUILang.krPalSettings     = "Einstellungen";
theUILang.krPalAppearance   = "Darstellung";
theUILang.krPalSwitch       = "Wechseln zu ";
theUILang.krPalFilters      = "Filter";
theUILang.krPalAll          = "Alle Torrents";
theUILang.krPalSearchGroup  = "Suchen";
theUILang.krPalSearchFor    = "Torrents suchen nach";
theUILang.krPalNoResults    = "Keine passenden Befehle";
theUILang.krPalPlaceholder  = "Befehl eingeben oder Torrents suchen...";
theUILang.krPalNavigate     = "navigieren";
theUILang.krPalOpen         = "ausführen";
theUILang.krPalClose        = "schliessen";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "Oberflächenverhalten, Aktualisierungsintervall und Geschwindigkeitsvorgaben.";
theUILang.kr_stg_desc_dl          = "Standard-Download-Bandbreitenlimits und -verhalten.";
theUILang.kr_stg_desc_con         = "Lauschport, globale Ratenlimits und Verbindungsobergrenzen.";
theUILang.kr_stg_desc_bt          = "DHT, Peer Exchange und andere BitTorrent-Funktionen.";
theUILang.kr_stg_desc_fmt         = "Wie Grössen, Daten und Zahlen angezeigt werden.";
theUILang.kr_stg_desc_ao          = "Erweiterte Optionen für fortgeschrittene Benutzer.";
theUILang.kr_stg_desc_dev         = "Diagnose- und reine Entwickleroptionen.";
theUILang.kr_stg_desc_loginmgr    = "Gespeicherte Tracker-Logins für Autotools und Suche.";
theUILang.kr_stg_desc_autotools   = "Automatische Aktionen für passende Torrents.";
theUILang.kr_stg_desc_xmpp        = "Chat-Benachrichtigungen über ein XMPP-Konto.";
theUILang.kr_stg_desc_cookies     = "Cookies pro Host beim Abrufen von Torrents.";
theUILang.kr_stg_desc_lookat      = "Benutzerdefinierte Suchlinks im Torrent-Menü.";
theUILang.kr_stg_desc_retrackers  = "Tracker, die automatisch zu neuen Torrents hinzugefügt werden.";
theUILang.kr_stg_desc_rss         = "RSS-Feeds und Auto-Download-Filter.";
theUILang.kr_stg_desc_scheduler   = "Zeitfenster, die Limits automatisch ändern.";
theUILang.kr_stg_desc_extsearch   = "Suchmaschinen für die Toolbar-Suche.";
theUILang.kr_stg_desc_unpack      = "Automatisches Entpacken fertiger Archive.";
theUILang.kr_stg_desc_throttle    = "Benannte Bandbreitenkanäle zum Gruppieren von Torrents.";
theUILang.kr_stg_desc_ratio       = "Verhältnisgruppen und die Aktionen bei jedem Ziel.";
theUILang.kr_stg_desc_screenshots = "Vorschaubilder aus Mediendateien.";
theUILang.kr_stg_desc_uploadeta   = "Zielverhältnis und Zeit zur Schätzung des Seedens.";
theUILang.kr_stg_desc_history     = "Aufbewahrung des Ereignisprotokolls und Benachrichtigungen.";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "Plugins";
theUILang.kr_stg_filter      = "Einstellungen filtern";
theUILang.kr_stg_no_match    = "Keine passenden Einstellungen";
theUILang.kr_acct_login      = "{name} Login";
theUILang.kr_acct_password   = "{name} Passwort";
theUILang.kr_acct_autologin  = "{name} Autologin";
theUILang.kr_unit_bytes      = "Bytes";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "Hash-Prüfintervall";
theUILang.kr_ao_hash_max_tries       = "Hash-Prüfung max. Versuche";
theUILang.kr_ao_hash_read_ahead      = "Hash Read-Ahead";
theUILang.kr_ao_preload_type         = "Preload-Typ";
theUILang.kr_ao_preload_min_size     = "Preload-Mindestgrösse";
theUILang.kr_ao_preload_required_rate = "Preload-Mindestrate";
theUILang.kr_ao_receive_buffer_size  = "Empfangspuffergrösse";
theUILang.kr_ao_send_buffer_size     = "Sendepuffergrösse";
theUILang.kr_ao_max_downloads_div    = "Max. Downloads Divisor";
theUILang.kr_ao_max_uploads_div      = "Max. Uploads Divisor";
theUILang.kr_ao_max_file_size        = "Maximale Dateigrösse";
theUILang.kr_ao_split_file_size      = "Split-Dateigrösse";
theUILang.kr_ao_split_suffix         = "Split-Suffix";
theUILang.kr_ao_http_cacert          = "HTTP-CA-Zertifikat";
theUILang.kr_ao_http_capath          = "HTTP-CA-Pfad";
theUILang.kr_ao_http_proxy           = "HTTP-Proxy";
theUILang.kr_ao_proxy_address        = "Proxy-Adresse";
theUILang.kr_ao_bind                 = "Bind-Adresse";
theUILang.kr_ao_session              = "Sitzungsverzeichnis";
theUILang.kr_ao_timeout_safe_sync    = "Safe-Sync-Timeout";
theUILang.kr_ao_timeout_sync         = "Sync-Timeout";
theUILang.kr_empty_ratio_rules       = "Noch keine Verhältnisregeln";
theUILang.kr_empty_rss_filters       = "Noch keine Filter";
theUILang.kr_empty_rss_group         = "Noch keine Feeds in dieser Gruppe";
theUILang.kr_empty_checklist        = "Nichts ausgewählt";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "Icon wählen";
theUILang.kr_icons_tab_icons     = "Icons";
theUILang.kr_icons_tab_upload    = "Bild hochladen";
theUILang.kr_icons_search        = "Icons suchen";
theUILang.kr_icons_categories    = "Kategorien";
theUILang.kr_icons_tint          = "Farbton";
theUILang.kr_icons_tint_auto     = "Auto (Variante)";
theUILang.kr_icons_upload_aria   = "Ein PNG-Bild hochladen";
theUILang.kr_icons_drop_title    = "Eine PNG hier ablegen oder zum Durchsuchen klicken";
theUILang.kr_icons_drop_hint     = "Nur PNG. Wird auch im normalen ruTorrent angezeigt.";
theUILang.kr_icons_upload_note   = "Ein hochgeladenes Bild bleibt unverändert und hat Vorrang vor einem gewählten Glyph. Entfernen Sie es, um auf den smarten Standard zurückzufallen.";
theUILang.kr_icons_reset         = "Auf smarten Standard zurücksetzen";
theUILang.kr_icons_use           = "Icon verwenden";
theUILang.kr_icons_remove        = "Bild entfernen";
theUILang.kr_icons_upload_btn    = "Hochladen";
theUILang.kr_icons_no_match      = "Keine Icons passen zu “{term}”";
theUILang.kr_icons_cat_all       = "Alle";
theUILang.kr_icons_more_cats     = "Weitere Kategorien";
theUILang.kr_icons_more          = "Mehr";
theUILang.kr_icons_more_count    = "Mehr ({n})";
theUILang.kr_icons_upload_failed = "Hochladen fehlgeschlagen: {msg}";
theUILang.kr_icons_sub_tracker   = "Tracker: {name}";
theUILang.kr_icons_sub_label     = "Gruppe: {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "Einen Torrent auswählen, um die Übersicht zu sehen";
theUILang.kr_det_empty_files    = "Einen Torrent auswählen, um die Dateien zu sehen";
theUILang.kr_det_empty_trackers = "Einen Torrent auswählen, um die Tracker zu sehen";
theUILang.kr_det_empty_peers    = "Einen Torrent auswählen, um die Peers zu sehen";
theUILang.kr_det_empty_pieces   = "Einen Torrent auswählen, um die Teile zu sehen";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "Seitenleiste einklappen";
theUILang.kr_nav_expand   = "Seitenleiste ausklappen";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "Keine Treffer";
theUILang.krNoOptions = "Keine Optionen";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "Keine Peers verbunden";
theUILang.kr_peerFlagIncoming  = "Eingehende Verbindung";
theUILang.kr_peerFlagEncrypted = "Verschlüsselt";
theUILang.kr_peerFlagSnubbed   = "Abgewiesen";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "Neuigkeiten in Krate";
theUILang.kr_wn_link          = "Neuigkeiten";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "Update verfügbar: v{version}";
theUILang.kr_wn_update_hint = "KRATE: aktualisieren Sie ruTorrent über HarmonyUI oder führen Sie {cmd} aus.";
theUILang.kr_wn_update_manual = "Manuelle Installation: {cmd} im Theme-Ordner ausführen.";
theUILang.kr_wn_none          = "Noch keine Versionshinweise.";
theUILang.krPalHelp            = "Hilfe";
