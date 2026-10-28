/*
 * Krate theme for ruTorrent — Portuguese strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "Aparência";
theUILang.krVariantAuto     = "Auto (HarmonyUI)";
theUILang.krVariantDark = "Escuro";
theUILang.krVariantLight    = "Claro";
theUILang.kr_var_auto      = "Auto";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "Defina 0 para ilimitado.";
theUILang.kr_decimals_hint  = "Deixe uma célula em branco para herdar o padrão.";
theUILang.kr_filter_trackers = "Filtrar rastreadores";
theUILang.kr_tracker        = "Rastreador";
theUILang.kr_enabled        = "Ativado";
theUILang.kr_grp_hashing    = "Hashing";
theUILang.kr_grp_preload    = "Preload";
theUILang.kr_grp_buffers    = "Buffers";
theUILang.kr_grp_limits     = "Limites";
theUILang.kr_grp_network    = "Rede";
theUILang.kr_grp_session    = "Sessão e tempos limite";
theUILang.kr_grp_flags      = "Flags";
theUILang.kr_stg_empty      = "Nenhum rastreador correspondente";
theUILang.kr_browse         = "Procurar";
theUILang.kr_not_set        = "Não definido";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "Um host por linha. Formato: host|name1=value1;name2=value2 (exemplo: tracker.example|uid=123;pass=abc)";
theUILang.krFindAtHelp      = "Uma busca por linha. Formato: name|url -- use {HASH} para o hash do torrent (exemplo: Name|https://example.org/?q={HASH})";
theUILang.krAnnounceHelp    = "Uma URL de announce por linha.";
theUILang.krBrowse          = "Procurar";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = "Arraste arquivos .torrent aqui ou {browse}";
theUILang.kr_tl_drop_hint    = "Arraste um .png aqui ou {browse}";
theUILang.kr_mi_general      = "Geral";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "Capturas de tela";
theUILang.kr_task_create     = "Criar torrent";
theUILang.kr_task_unpack     = "Descompactar";
theUILang.kr_task_title      = "Tarefa";
theUILang.kr_create_source_ph = "Caminho para um arquivo ou pasta, ou escolha um";
theUILang.kr_create_torrent  = "Criar torrent";
theUILang.kr_add_source      = "Origem";
theUILang.kr_add_file        = "Arquivo";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "Diretório de download padrão";
theUILang.kr_label_to_list   = "Escolha um rótulo existente";
theUILang.kr_help_trackers   = "Uma URL de rastreador por linha.";
theUILang.kr_help_seed       = "Começar a semear assim que o torrent for criado.";
theUILang.kr_help_private    = "Marcar como privado: sem DHT ou peer exchange.";
theUILang.kr_help_krbrid     = "Criar um torrent híbrido v1 + v2.";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "Sim";
theUILang.kr_edit_no         = "Não";
theUILang.kr_edit_change     = "Alterar";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "Chunks";
theUILang.kr_chunks_size       = "Tamanho";
theUILang.kr_chunks_done       = "Concluído";
theUILang.kr_chunks_seen       = "Visto";
theUILang.kr_chunks_downloaded = "Baixado";
theUILang.kr_chunks_mode       = "Modo do mapa de chunks";
theUILang.kr_chunks_one        = "Chunk {n}";
theUILang.kr_chunks_range      = "Chunks {a}–{b}";
theUILang.kr_chunks_seen_count = "{n}× visto";
theUILang.kr_chunks_a11y_seen  = "Mapa de disponibilidade de chunks: {pct}% dos grupos vistos, {n} chunks";
theUILang.kr_chunks_a11y_done  = "Mapa de conclusão de chunks: {pct}% concluído, {n} chunks";
theUILang.kr_chunks_cell_one   = "1 célula = {n} chunk";
theUILang.kr_chunks_cell_many  = "1 célula = {n} chunks";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "Copiar";
theUILang.kr_det_download      = "Download";
theUILang.kr_det_upload        = "Upload";
theUILang.kr_det_ratio         = "Proporção";
theUILang.kr_det_eta           = "ETA";
theUILang.kr_det_elapsed       = "Decorrido";
theUILang.kr_det_remaining     = "Restante";
theUILang.kr_det_swarm         = "Enxame";
theUILang.kr_det_seeds         = "Sementes";
theUILang.kr_det_peers         = "Pares";
theUILang.kr_det_wasted        = "Desperdiçado";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "Status";
theUILang.kr_det_next_announce = "Próximo announce";
theUILang.kr_det_storage       = "Armazenamento";
theUILang.kr_det_save_path     = "Caminho de salvamento";
theUILang.kr_det_open_fm       = "Abrir no Gerenciador de arquivos";
theUILang.kr_det_free_disk     = "Disco livre";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "Comentário";
theUILang.kr_det_updown        = "{up} envio / {down} recebimento";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "vence agora";
theUILang.kr_det_outside_fm    = "Fora da sua pasta do Gerenciador de arquivos";
theUILang.kr_det_no_comment    = "Sem comentário";
theUILang.kr_det_parent_dir    = "Diretório pai";
theUILang.kr_det_new_folder    = "Nova pasta";
theUILang.kr_det_path          = "Caminho";
theUILang.kr_det_recent_folders = "Pastas recentes";
theUILang.kr_det_toggle        = "Alternar {name}";
theUILang.kr_det_downloaded    = "Baixado";
theUILang.kr_det_uploaded      = "Enviado";
theUILang.kr_det_clear_stats   = "Limpar estatísticas";
theUILang.kr_det_console       = "Console";
theUILang.kr_det_more_tabs     = "Mais abas";
theUILang.kr_det_more          = "Mais";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "Adicionar torrent";
theUILang.kr_tb_remove     = "Remover";
theUILang.kr_tb_start      = "Iniciar";
theUILang.kr_tb_pause      = "Pausar";
theUILang.kr_tb_stop       = "Parar";
theUILang.kr_tb_settings   = "Configurações";
theUILang.kr_tb_help       = "Ajuda";
theUILang.kr_tb_logoff     = "Sair";
theUILang.kr_tb_create     = "Criar torrent";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "Plugins";
theUILang.kr_search        = "Buscar";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "Solte para adicionar torrents";
theUILang.krDropSub         = "Solte arquivos .torrent em qualquer lugar para adicioná-los";
theUILang.krPalActions      = "Ações";
theUILang.krPalAdd          = "Adicionar torrent";
theUILang.krPalStart        = "Iniciar selecionados";
theUILang.krPalPause        = "Pausar selecionados";
theUILang.krPalStop         = "Parar selecionados";
theUILang.krPalRemove       = "Remover selecionados";
theUILang.krPalSettings     = "Configurações";
theUILang.krPalAppearance   = "Aparência";
theUILang.krPalSwitch       = "Mudar para ";
theUILang.krPalFilters      = "Filtros";
theUILang.krPalAll          = "Todos os torrents";
theUILang.krPalSearchGroup  = "Buscar";
theUILang.krPalSearchFor    = "Buscar torrents por";
theUILang.krPalNoResults    = "Nenhum comando correspondente";
theUILang.krPalPlaceholder  = "Digite um comando ou busque torrents...";
theUILang.krPalNavigate     = "navegar";
theUILang.krPalOpen         = "executar";
theUILang.krPalClose        = "fechar";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "Comportamento da interface, intervalo de atualização e predefinições de velocidade.";
theUILang.kr_stg_desc_dl          = "Limites de banda de download e comportamento padrão.";
theUILang.kr_stg_desc_con         = "Porta de escuta, limites de taxa globais e limites de conexão.";
theUILang.kr_stg_desc_bt          = "DHT, peer exchange e outros recursos do BitTorrent.";
theUILang.kr_stg_desc_fmt         = "Como tamanhos, datas e números são exibidos.";
theUILang.kr_stg_desc_ao          = "Opções de baixo nível para usuários avançados.";
theUILang.kr_stg_desc_dev         = "Opções de diagnóstico e apenas para desenvolvedores.";
theUILang.kr_stg_desc_loginmgr    = "Logins de rastreador salvos usados pelos autotools e pela busca.";
theUILang.kr_stg_desc_autotools   = "Ações automáticas aplicadas aos torrents correspondentes.";
theUILang.kr_stg_desc_xmpp        = "Notificações de chat entregues por uma conta XMPP.";
theUILang.kr_stg_desc_cookies     = "Cookies por host enviados ao obter torrents.";
theUILang.kr_stg_desc_lookat      = "Links de busca personalizados exibidos no menu do torrent.";
theUILang.kr_stg_desc_retrackers  = "Rastreadores adicionados automaticamente a novos torrents.";
theUILang.kr_stg_desc_rss         = "Feeds RSS e filtros de download automático.";
theUILang.kr_stg_desc_scheduler   = "Janelas de tempo que alteram os limites automaticamente.";
theUILang.kr_stg_desc_extsearch   = "Mecanismos de busca usados pela busca da barra de ferramentas.";
theUILang.kr_stg_desc_unpack      = "Extração automática de arquivos concluídos.";
theUILang.kr_stg_desc_throttle    = "Canais de banda nomeados para agrupar torrents.";
theUILang.kr_stg_desc_ratio       = "Grupos de proporção e as ações tomadas em cada meta.";
theUILang.kr_stg_desc_screenshots = "Miniaturas geradas a partir de arquivos de mídia.";
theUILang.kr_stg_desc_uploadeta   = "Proporção alvo e tempo usados para estimar a semeadura.";
theUILang.kr_stg_desc_history     = "Retenção do registro de eventos e entrega de notificações.";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "Plugins";
theUILang.kr_stg_filter      = "Filtrar configurações";
theUILang.kr_stg_no_match    = "Nenhuma configuração correspondente";
theUILang.kr_acct_login      = "Login de {name}";
theUILang.kr_acct_password   = "Senha de {name}";
theUILang.kr_acct_autologin  = "Autologin de {name}";
theUILang.kr_unit_bytes      = "bytes";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "Intervalo de verificação de hash";
theUILang.kr_ao_hash_max_tries       = "Máx. de tentativas de verificação de hash";
theUILang.kr_ao_hash_read_ahead      = "Leitura antecipada de hash";
theUILang.kr_ao_preload_type         = "Tipo de preload";
theUILang.kr_ao_preload_min_size     = "Tamanho mínimo de preload";
theUILang.kr_ao_preload_required_rate = "Taxa exigida de preload";
theUILang.kr_ao_receive_buffer_size  = "Tamanho do buffer de recebimento";
theUILang.kr_ao_send_buffer_size     = "Tamanho do buffer de envio";
theUILang.kr_ao_max_downloads_div    = "Divisor de downloads máx.";
theUILang.kr_ao_max_uploads_div      = "Divisor de uploads máx.";
theUILang.kr_ao_max_file_size        = "Tamanho máximo de arquivo";
theUILang.kr_ao_split_file_size      = "Tamanho de divisão de arquivo";
theUILang.kr_ao_split_suffix         = "Sufixo de divisão";
theUILang.kr_ao_http_cacert          = "Certificado CA HTTP";
theUILang.kr_ao_http_capath          = "Caminho CA HTTP";
theUILang.kr_ao_http_proxy           = "Proxy HTTP";
theUILang.kr_ao_proxy_address        = "Endereço do proxy";
theUILang.kr_ao_bind                 = "Endereço de vínculo";
theUILang.kr_ao_session              = "Diretório de sessão";
theUILang.kr_ao_timeout_safe_sync    = "Tempo limite de sync seguro";
theUILang.kr_ao_timeout_sync         = "Tempo limite de sync";
theUILang.kr_empty_ratio_rules       = "Ainda não há regras de proporção";
theUILang.kr_empty_rss_filters       = "Ainda não há filtros";
theUILang.kr_empty_rss_group         = "Ainda não há feeds neste grupo";
theUILang.kr_empty_checklist        = "Nada selecionado";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "Escolher ícone";
theUILang.kr_icons_tab_icons     = "Ícones";
theUILang.kr_icons_tab_upload    = "Enviar imagem";
theUILang.kr_icons_search        = "Buscar ícones";
theUILang.kr_icons_categories    = "Categorias";
theUILang.kr_icons_tint          = "Tom";
theUILang.kr_icons_tint_auto     = "Auto (variante)";
theUILang.kr_icons_upload_aria   = "Enviar uma imagem PNG";
theUILang.kr_icons_drop_title    = "Solte uma PNG aqui ou clique para procurar";
theUILang.kr_icons_drop_hint     = "Apenas PNG. Mostrado também no ruTorrent normal.";
theUILang.kr_icons_upload_note   = "Uma imagem enviada é mantida como está e tem prioridade sobre um glifo escolhido. Remova-a para voltar ao padrão inteligente.";
theUILang.kr_icons_reset         = "Redefinir para o padrão inteligente";
theUILang.kr_icons_use           = "Usar ícone";
theUILang.kr_icons_remove        = "Remover imagem";
theUILang.kr_icons_upload_btn    = "Enviar";
theUILang.kr_icons_no_match      = "Nenhum ícone corresponde a “{term}”";
theUILang.kr_icons_cat_all       = "Todos";
theUILang.kr_icons_more_cats     = "Mais categorias";
theUILang.kr_icons_more          = "Mais";
theUILang.kr_icons_more_count    = "Mais ({n})";
theUILang.kr_icons_upload_failed = "Falha no envio: {msg}";
theUILang.kr_icons_sub_tracker   = "Rastreador: {name}";
theUILang.kr_icons_sub_label     = "Rótulo: {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "Selecione um torrent para ver sua visão geral";
theUILang.kr_det_empty_files    = "Selecione um torrent para ver seus arquivos";
theUILang.kr_det_empty_trackers = "Selecione um torrent para ver seus rastreadores";
theUILang.kr_det_empty_peers    = "Selecione um torrent para ver seus pares";
theUILang.kr_det_empty_pieces   = "Selecione um torrent para ver suas peças";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "Recolher barra lateral";
theUILang.kr_nav_expand   = "Expandir barra lateral";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "Sem correspondências";
theUILang.krNoOptions = "Sem opções";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "Nenhum par conectado";
theUILang.kr_peerFlagIncoming  = "Conexão de entrada";
theUILang.kr_peerFlagEncrypted = "Criptografado";
theUILang.kr_peerFlagSnubbed   = "Ignorado";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "Novidades no Krate";
theUILang.kr_wn_link          = "Novidades";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "Atualização disponível: v{version}";
theUILang.kr_wn_update_hint = "KRATE: atualize o ruTorrent pelo HarmonyUI ou execute {cmd}.";
theUILang.kr_wn_update_manual = "Instalação manual: execute {cmd} na pasta do tema.";
theUILang.kr_wn_none          = "Ainda não há notas de versão.";
theUILang.krPalHelp            = "Ajuda";
