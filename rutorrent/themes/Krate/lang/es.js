/*
 * Krate theme for ruTorrent — Spanish strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "Apariencia";
theUILang.krVariantAuto     = "Auto (HarmonyUI)";
theUILang.krVariantDark = "Oscuro";
theUILang.krVariantLight    = "Claro";
theUILang.kr_var_auto      = "Auto";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "Pon 0 para ilimitado.";
theUILang.kr_decimals_hint  = "Deja una celda vacía para heredar el valor predeterminado.";
theUILang.kr_filter_trackers = "Filtrar trackers";
theUILang.kr_tracker        = "Tracker";
theUILang.kr_enabled        = "Activado";
theUILang.kr_grp_hashing    = "Hashing";
theUILang.kr_grp_preload    = "Preload";
theUILang.kr_grp_buffers    = "Búferes";
theUILang.kr_grp_limits     = "Límites";
theUILang.kr_grp_network    = "Red";
theUILang.kr_grp_session    = "Sesión y tiempos de espera";
theUILang.kr_grp_flags      = "Banderas";
theUILang.kr_stg_empty      = "No hay trackers coincidentes";
theUILang.kr_browse         = "Examinar";
theUILang.kr_not_set        = "Sin definir";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "Un host por línea. Formato: host|name1=value1;name2=value2 (ejemplo: tracker.example|uid=123;pass=abc)";
theUILang.krFindAtHelp      = "Una búsqueda por línea. Formato: name|url -- usa {HASH} para el hash del torrent (ejemplo: Name|https://example.org/?q={HASH})";
theUILang.krAnnounceHelp    = "Una URL de announce por línea.";
theUILang.krBrowse          = "Examinar";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = "Arrastra archivos .torrent aquí o {browse}";
theUILang.kr_tl_drop_hint    = "Arrastra un .png aquí o {browse}";
theUILang.kr_mi_general      = "General";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "Capturas";
theUILang.kr_task_create     = "Crear torrent";
theUILang.kr_task_unpack     = "Descomprimir";
theUILang.kr_task_title      = "Tarea";
theUILang.kr_create_source_ph = "Ruta a un archivo o carpeta, o elige uno";
theUILang.kr_create_torrent  = "Crear torrent";
theUILang.kr_add_source      = "Origen";
theUILang.kr_add_file        = "Archivo";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "Directorio de descarga predeterminado";
theUILang.kr_label_to_list   = "Elige una etiqueta existente";
theUILang.kr_help_trackers   = "Una URL de tracker por línea.";
theUILang.kr_help_seed       = "Empezar a compartir en cuanto se cree el torrent.";
theUILang.kr_help_private    = "Marcar como privado: sin DHT ni peer exchange.";
theUILang.kr_help_krbrid     = "Crear un torrent híbrido v1 + v2.";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "Sí";
theUILang.kr_edit_no         = "No";
theUILang.kr_edit_change     = "Cambiar";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "Chunks";
theUILang.kr_chunks_size       = "Tamaño";
theUILang.kr_chunks_done       = "Finalizado";
theUILang.kr_chunks_seen       = "Visto";
theUILang.kr_chunks_downloaded = "Descargado";
theUILang.kr_chunks_mode       = "Modo del mapa de chunks";
theUILang.kr_chunks_one        = "Chunk {n}";
theUILang.kr_chunks_range      = "Chunks {a}–{b}";
theUILang.kr_chunks_seen_count = "{n}× visto";
theUILang.kr_chunks_a11y_seen  = "Mapa de disponibilidad de chunks: {pct}% de grupos vistos, {n} chunks";
theUILang.kr_chunks_a11y_done  = "Mapa de completado de chunks: {pct}% completo, {n} chunks";
theUILang.kr_chunks_cell_one   = "1 celda = {n} chunk";
theUILang.kr_chunks_cell_many  = "1 celda = {n} chunks";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "Copiar";
theUILang.kr_det_download      = "Descarga";
theUILang.kr_det_upload        = "Subida";
theUILang.kr_det_ratio         = "Ratio";
theUILang.kr_det_eta           = "ETA";
theUILang.kr_det_elapsed       = "Transcurrido";
theUILang.kr_det_remaining     = "Restante";
theUILang.kr_det_swarm         = "Enjambre";
theUILang.kr_det_seeds         = "Semillas";
theUILang.kr_det_peers         = "Clientes";
theUILang.kr_det_wasted        = "Desperdiciado";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "Estado";
theUILang.kr_det_next_announce = "Próximo announce";
theUILang.kr_det_storage       = "Almacenamiento";
theUILang.kr_det_save_path     = "Ruta de guardado";
theUILang.kr_det_open_fm       = "Abrir en el Administrador de archivos";
theUILang.kr_det_free_disk     = "Disco libre";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "Comentario";
theUILang.kr_det_updown        = "{up} subida / {down} bajada";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "pendiente ahora";
theUILang.kr_det_outside_fm    = "Fuera de tu carpeta del Administrador de archivos";
theUILang.kr_det_no_comment    = "Sin comentario";
theUILang.kr_det_parent_dir    = "Directorio superior";
theUILang.kr_det_new_folder    = "Nueva carpeta";
theUILang.kr_det_path          = "Ruta";
theUILang.kr_det_recent_folders = "Carpetas recientes";
theUILang.kr_det_toggle        = "Alternar {name}";
theUILang.kr_det_downloaded    = "Descargado";
theUILang.kr_det_uploaded      = "Subido";
theUILang.kr_det_clear_stats   = "Borrar estadísticas";
theUILang.kr_det_console       = "Consola";
theUILang.kr_det_more_tabs     = "Más pestañas";
theUILang.kr_det_more          = "Más";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "Añadir torrent";
theUILang.kr_tb_remove     = "Eliminar";
theUILang.kr_tb_start      = "Iniciar";
theUILang.kr_tb_pause      = "Pausar";
theUILang.kr_tb_stop       = "Detener";
theUILang.kr_tb_settings   = "Ajustes";
theUILang.kr_tb_help       = "Ayuda";
theUILang.kr_tb_logoff     = "Cerrar sesión";
theUILang.kr_tb_create     = "Crear torrent";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "Plugins";
theUILang.kr_search        = "Buscar";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "Suelta para añadir torrents";
theUILang.krDropSub         = "Suelta archivos .torrent en cualquier lugar para añadirlos";
theUILang.krPalActions      = "Acciones";
theUILang.krPalAdd          = "Añadir torrent";
theUILang.krPalStart        = "Iniciar selección";
theUILang.krPalPause        = "Pausar selección";
theUILang.krPalStop         = "Detener selección";
theUILang.krPalRemove       = "Eliminar selección";
theUILang.krPalSettings     = "Ajustes";
theUILang.krPalAppearance   = "Apariencia";
theUILang.krPalSwitch       = "Cambiar a ";
theUILang.krPalFilters      = "Filtros";
theUILang.krPalAll          = "Todos los torrents";
theUILang.krPalSearchGroup  = "Buscar";
theUILang.krPalSearchFor    = "Buscar torrents por";
theUILang.krPalNoResults    = "No hay comandos coincidentes";
theUILang.krPalPlaceholder  = "Escribe un comando o busca torrents...";
theUILang.krPalNavigate     = "navegar";
theUILang.krPalOpen         = "ejecutar";
theUILang.krPalClose        = "cerrar";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "Comportamiento de la interfaz, intervalo de actualización y perfiles de velocidad.";
theUILang.kr_stg_desc_dl          = "Límites de ancho de banda de descarga y comportamiento predeterminados.";
theUILang.kr_stg_desc_con         = "Puerto de escucha, límites de tasa globales y topes de conexión.";
theUILang.kr_stg_desc_bt          = "DHT, peer exchange y otras funciones de BitTorrent.";
theUILang.kr_stg_desc_fmt         = "Cómo se muestran los tamaños, las fechas y los números.";
theUILang.kr_stg_desc_ao          = "Opciones de bajo nivel para usuarios avanzados.";
theUILang.kr_stg_desc_dev         = "Opciones de diagnóstico y solo para desarrolladores.";
theUILang.kr_stg_desc_loginmgr    = "Credenciales de tracker guardadas usadas por autotools y la búsqueda.";
theUILang.kr_stg_desc_autotools   = "Acciones automáticas aplicadas a los torrents coincidentes.";
theUILang.kr_stg_desc_xmpp        = "Notificaciones de chat enviadas a través de una cuenta XMPP.";
theUILang.kr_stg_desc_cookies     = "Cookies por host enviadas al obtener torrents.";
theUILang.kr_stg_desc_lookat      = "Enlaces de búsqueda personalizados mostrados en el menú del torrent.";
theUILang.kr_stg_desc_retrackers  = "Trackers añadidos automáticamente a los torrents nuevos.";
theUILang.kr_stg_desc_rss         = "Feeds RSS y filtros de descarga automática.";
theUILang.kr_stg_desc_scheduler   = "Franjas horarias que cambian los límites automáticamente.";
theUILang.kr_stg_desc_extsearch   = "Motores de búsqueda usados por la búsqueda de la barra.";
theUILang.kr_stg_desc_unpack      = "Extracción automática de archivos completados.";
theUILang.kr_stg_desc_throttle    = "Canales de ancho de banda con nombre para agrupar torrents.";
theUILang.kr_stg_desc_ratio       = "Grupos de ratio y las acciones tomadas en cada objetivo.";
theUILang.kr_stg_desc_screenshots = "Miniaturas generadas a partir de archivos multimedia.";
theUILang.kr_stg_desc_uploadeta   = "Ratio objetivo y tiempo usados para estimar la siembra.";
theUILang.kr_stg_desc_history     = "Retención del registro de eventos y envío de notificaciones.";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "Plugins";
theUILang.kr_stg_filter      = "Filtrar ajustes";
theUILang.kr_stg_no_match    = "No hay ajustes coincidentes";
theUILang.kr_acct_login      = "Usuario de {name}";
theUILang.kr_acct_password   = "Contraseña de {name}";
theUILang.kr_acct_autologin  = "Autologin de {name}";
theUILang.kr_unit_bytes      = "bytes";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "Intervalo de verificación de hash";
theUILang.kr_ao_hash_max_tries       = "Intentos máx. de verificación de hash";
theUILang.kr_ao_hash_read_ahead      = "Lectura anticipada de hash";
theUILang.kr_ao_preload_type         = "Tipo de preload";
theUILang.kr_ao_preload_min_size     = "Tamaño mínimo de preload";
theUILang.kr_ao_preload_required_rate = "Tasa requerida de preload";
theUILang.kr_ao_receive_buffer_size  = "Tamaño del búfer de recepción";
theUILang.kr_ao_send_buffer_size     = "Tamaño del búfer de envío";
theUILang.kr_ao_max_downloads_div    = "Divisor de descargas máx.";
theUILang.kr_ao_max_uploads_div      = "Divisor de subidas máx.";
theUILang.kr_ao_max_file_size        = "Tamaño máximo de archivo";
theUILang.kr_ao_split_file_size      = "Tamaño de división de archivo";
theUILang.kr_ao_split_suffix         = "Sufijo de división";
theUILang.kr_ao_http_cacert          = "Certificado CA de HTTP";
theUILang.kr_ao_http_capath          = "Ruta CA de HTTP";
theUILang.kr_ao_http_proxy           = "Proxy HTTP";
theUILang.kr_ao_proxy_address        = "Dirección del proxy";
theUILang.kr_ao_bind                 = "Dirección de enlace";
theUILang.kr_ao_session              = "Directorio de sesión";
theUILang.kr_ao_timeout_safe_sync    = "Tiempo de espera de sync seguro";
theUILang.kr_ao_timeout_sync         = "Tiempo de espera de sync";
theUILang.kr_empty_ratio_rules       = "Aún no hay reglas de ratio";
theUILang.kr_empty_rss_filters       = "Aún no hay filtros";
theUILang.kr_empty_rss_group         = "Aún no hay feeds en este grupo";
theUILang.kr_empty_checklist        = "Nada seleccionado";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "Elegir icono";
theUILang.kr_icons_tab_icons     = "Iconos";
theUILang.kr_icons_tab_upload    = "Subir imagen";
theUILang.kr_icons_search        = "Buscar iconos";
theUILang.kr_icons_categories    = "Categorías";
theUILang.kr_icons_tint          = "Tono";
theUILang.kr_icons_tint_auto     = "Auto (variante)";
theUILang.kr_icons_upload_aria   = "Subir una imagen PNG";
theUILang.kr_icons_drop_title    = "Suelta una PNG aquí o haz clic para examinar";
theUILang.kr_icons_drop_hint     = "Solo PNG. Se muestra también en ruTorrent normal.";
theUILang.kr_icons_upload_note   = "Una imagen subida se conserva tal cual y tiene prioridad sobre un glifo elegido. Elimínala para volver al valor inteligente predeterminado.";
theUILang.kr_icons_reset         = "Restablecer al valor inteligente predeterminado";
theUILang.kr_icons_use           = "Usar icono";
theUILang.kr_icons_remove        = "Eliminar imagen";
theUILang.kr_icons_upload_btn    = "Subir";
theUILang.kr_icons_no_match      = "Ningún icono coincide con “{term}”";
theUILang.kr_icons_cat_all       = "Todos";
theUILang.kr_icons_more_cats     = "Más categorías";
theUILang.kr_icons_more          = "Más";
theUILang.kr_icons_more_count    = "Más ({n})";
theUILang.kr_icons_upload_failed = "Error al subir: {msg}";
theUILang.kr_icons_sub_tracker   = "Tracker: {name}";
theUILang.kr_icons_sub_label     = "Etiqueta: {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "Selecciona un torrent para ver su resumen";
theUILang.kr_det_empty_files    = "Selecciona un torrent para ver sus archivos";
theUILang.kr_det_empty_trackers = "Selecciona un torrent para ver sus trackers";
theUILang.kr_det_empty_peers    = "Selecciona un torrent para ver sus clientes";
theUILang.kr_det_empty_pieces   = "Selecciona un torrent para ver sus piezas";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "Contraer barra lateral";
theUILang.kr_nav_expand   = "Expandir barra lateral";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "Sin coincidencias";
theUILang.krNoOptions = "Sin opciones";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "No hay clientes conectados";
theUILang.kr_peerFlagIncoming  = "Conexión entrante";
theUILang.kr_peerFlagEncrypted = "Cifrado";
theUILang.kr_peerFlagSnubbed   = "Ignorado";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "Novedades en Krate";
theUILang.kr_wn_link          = "Novedades";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "Actualización disponible: v{version}";
theUILang.kr_wn_update_hint = "KRATE: actualice ruTorrent desde HarmonyUI o ejecute {cmd}.";
theUILang.kr_wn_update_manual = "Instalación manual: ejecuta {cmd} en la carpeta del tema.";
theUILang.kr_wn_none          = "Aún no hay notas de la versión.";
theUILang.krPalHelp            = "Ayuda";
