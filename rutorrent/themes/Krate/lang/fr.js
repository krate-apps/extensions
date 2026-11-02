/*
 * Krate theme for ruTorrent — French strings.
 *
 * The theme plugin loads its own catalog (plugins/theme/lang/*.js), not this
 * tree. init.js loads lang/en.js then lang/<code>.js; modules also seed
 * English fallbacks inline. Keys are grouped by surface.
 */

/* Appearance + theme variants (init.js, topbar.js, extras.js). */
theUILang.krAppearance      = "Apparence";
theUILang.krVariantAuto = "Auto (HarmonyUI)";
theUILang.krVariantDark = "Sombre";
theUILang.krVariantLight    = "Clair";
theUILang.kr_var_auto      = "Auto";

/* Settings dialog (settings.js, settings-plugins.js). */
theUILang.kr_zero_unlimited = "Mettez 0 pour illimité.";
theUILang.kr_decimals_hint  = "Laissez une cellule vide pour hériter de la valeur par défaut.";
theUILang.kr_filter_trackers = "Filtrer les trackers";
theUILang.kr_tracker        = "Tracker";
theUILang.kr_enabled        = "Activé";
theUILang.kr_grp_hashing    = "Hashing";
theUILang.kr_grp_preload    = "Preload";
theUILang.kr_grp_buffers    = "Tampons";
theUILang.kr_grp_limits     = "Limites";
theUILang.kr_grp_network    = "Réseau";
theUILang.kr_grp_session    = "Session et délais";
theUILang.kr_grp_flags      = "Drapeaux";
theUILang.kr_stg_empty      = "Aucun tracker correspondant";
theUILang.kr_browse         = "Parcourir";
theUILang.kr_not_set        = "Non défini";
theUILang.krAutoLabel       = "AutoLabel";
theUILang.krAutoMove        = "AutoMove";
theUILang.krAutoWatch       = "AutoWatch";
theUILang.krCookiesHelp     = "Un hôte par ligne. Format : host|name1=value1;name2=value2 (exemple : tracker.example|uid=123;pass=abc)";
theUILang.krFindAtHelp      = "Une recherche par ligne. Format : name|url -- utilisez {HASH} pour le hash du torrent (exemple : Name|https://example.org/?q={HASH})";
theUILang.krAnnounceHelp    = "Une URL d'announce par ligne.";
theUILang.krBrowse          = "Parcourir";

/* Add / Create / task-console dialogs (dialogs.js). */
theUILang.kr_add_drop_hint   = "Glissez des fichiers .torrent ici ou {browse}";
theUILang.kr_tl_drop_hint    = "Glissez un .png ici ou {browse}";
theUILang.kr_mi_general      = "Général";
theUILang.kr_task_mediainfo  = "Media Info";
theUILang.kr_task_screenshots = "Captures d'écran";
theUILang.kr_task_create     = "Créer un torrent";
theUILang.kr_task_unpack     = "Décompresser";
theUILang.kr_task_title      = "Tâche";
theUILang.kr_create_source_ph = "Chemin vers un fichier ou un dossier, ou choisissez-en un";
theUILang.kr_create_torrent  = "Créer un torrent";
theUILang.kr_add_source      = "Source";
theUILang.kr_add_file        = "Fichier";
theUILang.kr_add_url         = "URL";
theUILang.kr_add_dir_ph      = "Répertoire de téléchargement par défaut";
theUILang.kr_label_to_list   = "Choisissez une étiquette existante";
theUILang.kr_help_trackers   = "Une URL de tracker par ligne.";
theUILang.kr_help_seed       = "Commencer le partage dès que le torrent est créé.";
theUILang.kr_help_private    = "Marquer comme privé : pas de DHT ni de peer exchange.";
theUILang.kr_help_krbrid     = "Créer un torrent hybride v1 + v2.";

/* Inline edit of a torrent option (dialogs.js). */
theUILang.kr_edit_yes        = "Oui";
theUILang.kr_edit_no         = "Non";
theUILang.kr_edit_change     = "Modifier";

/* Chunks pane (chunks.js). */
theUILang.kr_chunks_chunks     = "Chunks";
theUILang.kr_chunks_size       = "Taille";
theUILang.kr_chunks_done       = "Terminé";
theUILang.kr_chunks_seen       = "Vu";
theUILang.kr_chunks_downloaded = "Téléchargé";
theUILang.kr_chunks_mode       = "Mode de la carte des chunks";
theUILang.kr_chunks_one        = "Chunk {n}";
theUILang.kr_chunks_range      = "Chunks {a}–{b}";
theUILang.kr_chunks_seen_count = "{n}× vu";
theUILang.kr_chunks_a11y_seen  = "Carte de disponibilité des chunks : {pct}% des groupes vus, {n} chunks";
theUILang.kr_chunks_a11y_done  = "Carte d'avancement des chunks : {pct}% terminé, {n} chunks";
theUILang.kr_chunks_cell_one   = "1 cellule = {n} chunk";
theUILang.kr_chunks_cell_many  = "1 cellule = {n} chunks";

/* Details pane -- overview, file manager, traffic/speed toolbars (details.js). */
theUILang.kr_det_copy          = "Copier";
theUILang.kr_det_download      = "Téléchargement";
theUILang.kr_det_upload        = "Envoi";
theUILang.kr_det_ratio         = "Ratio";
theUILang.kr_det_eta           = "ETA";
theUILang.kr_det_elapsed       = "Écoulé";
theUILang.kr_det_remaining     = "Restant";
theUILang.kr_det_swarm         = "Essaim";
theUILang.kr_det_seeds         = "Sources";
theUILang.kr_det_peers         = "Clients";
theUILang.kr_det_wasted        = "Rejeté";
theUILang.kr_det_url           = "URL";
theUILang.kr_det_status        = "Statut";
theUILang.kr_det_next_announce = "Prochain announce";
theUILang.kr_det_storage       = "Stockage";
theUILang.kr_det_save_path     = "Chemin de sauvegarde";
theUILang.kr_det_open_fm       = "Ouvrir dans le Gestionnaire de fichiers";
theUILang.kr_det_free_disk     = "Disque libre";
theUILang.kr_det_hash          = "Hash";
theUILang.kr_det_comment       = "Commentaire";
theUILang.kr_det_updown        = "{up} envoi / {down} réception";
theUILang.kr_det_tracker_ok    = "OK";
theUILang.kr_det_due_now       = "dû maintenant";
theUILang.kr_det_outside_fm    = "Hors de votre dossier du Gestionnaire de fichiers";
theUILang.kr_det_no_comment    = "Aucun commentaire";
theUILang.kr_det_parent_dir    = "Répertoire parent";
theUILang.kr_det_new_folder    = "Nouveau dossier";
theUILang.kr_det_path          = "Chemin";
theUILang.kr_det_recent_folders = "Dossiers récents";
theUILang.kr_det_toggle        = "Basculer {name}";
theUILang.kr_det_downloaded    = "Téléchargé";
theUILang.kr_det_uploaded      = "Envoyé";
theUILang.kr_det_clear_stats   = "Effacer les statistiques";
theUILang.kr_det_console       = "Console";
theUILang.kr_det_more_tabs     = "Plus d'onglets";
theUILang.kr_det_more          = "Plus";

/* Top app bar -- button tooltips + search (topbar.js). */
theUILang.kr_tb_add        = "Ajouter un torrent";
theUILang.kr_tb_remove     = "Retirer";
theUILang.kr_tb_start      = "Démarrer";
theUILang.kr_tb_pause      = "Pause";
theUILang.kr_tb_stop       = "Arrêter";
theUILang.kr_tb_settings   = "Paramètres";
theUILang.kr_tb_help       = "Aide";
theUILang.kr_tb_logoff     = "Déconnexion";
theUILang.kr_tb_create     = "Créer un torrent";
theUILang.kr_tb_rss        = "RSS";
theUILang.kr_tb_plugins    = "Plugins";
theUILang.kr_search        = "Rechercher";

/* Full-window drop zone + command palette (extras.js). */
theUILang.krDropTitle       = "Déposez pour ajouter des torrents";
theUILang.krDropSub         = "Déposez des fichiers .torrent n'importe où pour les ajouter";
theUILang.krPalActions      = "Actions";
theUILang.krPalAdd          = "Ajouter un torrent";
theUILang.krPalStart        = "Démarrer la sélection";
theUILang.krPalPause        = "Mettre en pause la sélection";
theUILang.krPalStop         = "Arrêter la sélection";
theUILang.krPalRemove       = "Retirer la sélection";
theUILang.krPalSettings     = "Paramètres";
theUILang.krPalAppearance   = "Apparence";
theUILang.krPalSwitch       = "Basculer vers ";
theUILang.krPalFilters      = "Filtres";
theUILang.krPalAll          = "Tous les torrents";
theUILang.krPalSearchGroup  = "Rechercher";
theUILang.krPalSearchFor    = "Rechercher des torrents pour";
theUILang.krPalNoResults    = "Aucune commande correspondante";
theUILang.krPalPlaceholder  = "Tapez une commande ou recherchez des torrents...";
theUILang.krPalNavigate     = "naviguer";
theUILang.krPalOpen         = "exécuter";
theUILang.krPalClose        = "fermer";

/* Settings page descriptions (settings.js). */
theUILang.kr_stg_desc_gl          = "Comportement de l'interface, intervalle de mise à jour et préréglages de vitesse.";
theUILang.kr_stg_desc_dl          = "Limites de bande passante de téléchargement et comportement par défaut.";
theUILang.kr_stg_desc_con         = "Port d'écoute, limites de débit globales et plafonds de connexion.";
theUILang.kr_stg_desc_bt          = "DHT, peer exchange et autres fonctions BitTorrent.";
theUILang.kr_stg_desc_fmt         = "Comment les tailles, les dates et les nombres sont affichés.";
theUILang.kr_stg_desc_ao          = "Options de bas niveau pour les utilisateurs avancés.";
theUILang.kr_stg_desc_dev         = "Options de diagnostic et réservées aux développeurs.";
theUILang.kr_stg_desc_loginmgr    = "Identifiants de tracker enregistrés utilisés par les autotools et la recherche.";
theUILang.kr_stg_desc_autotools   = "Actions automatiques appliquées aux torrents correspondants.";
theUILang.kr_stg_desc_xmpp        = "Notifications de chat envoyées via un compte XMPP.";
theUILang.kr_stg_desc_cookies     = "Cookies par hôte envoyés lors de la récupération des torrents.";
theUILang.kr_stg_desc_lookat      = "Liens de recherche personnalisés affichés dans le menu du torrent.";
theUILang.kr_stg_desc_retrackers  = "Trackers ajoutés automatiquement aux nouveaux torrents.";
theUILang.kr_stg_desc_rss         = "Flux RSS et filtres de téléchargement automatique.";
theUILang.kr_stg_desc_scheduler   = "Plages horaires qui modifient les limites automatiquement.";
theUILang.kr_stg_desc_extsearch   = "Moteurs de recherche utilisés par la recherche de la barre d'outils.";
theUILang.kr_stg_desc_unpack      = "Extraction automatique des archives terminées.";
theUILang.kr_stg_desc_throttle    = "Canaux de bande passante nommés pour regrouper les torrents.";
theUILang.kr_stg_desc_ratio       = "Groupes de ratio et les actions prises à chaque objectif.";
theUILang.kr_stg_desc_screenshots = "Aperçus miniatures générés à partir des fichiers multimédias.";
theUILang.kr_stg_desc_uploadeta   = "Ratio cible et temps utilisés pour estimer le partage.";
theUILang.kr_stg_desc_history     = "Rétention du journal d'événements et envoi des notifications.";

/* Settings nav + account table chrome (settings.js). */
theUILang.kr_stg_grp_plugins = "Plugins";
theUILang.kr_stg_filter      = "Filtrer les paramètres";
theUILang.kr_stg_no_match    = "Aucun paramètre correspondant";
theUILang.kr_acct_login      = "Identifiant {name}";
theUILang.kr_acct_password   = "Mot de passe {name}";
theUILang.kr_acct_autologin  = "Connexion auto {name}";
theUILang.kr_unit_bytes      = "octets";

/* Advanced rtorrent option labels (settings.js, st_ao page). */
theUILang.kr_ao_hash_interval        = "Intervalle de vérification du hash";
theUILang.kr_ao_hash_max_tries       = "Essais max. de vérification du hash";
theUILang.kr_ao_hash_read_ahead      = "Lecture anticipée du hash";
theUILang.kr_ao_preload_type         = "Type de preload";
theUILang.kr_ao_preload_min_size     = "Taille minimale de preload";
theUILang.kr_ao_preload_required_rate = "Débit requis de preload";
theUILang.kr_ao_receive_buffer_size  = "Taille du tampon de réception";
theUILang.kr_ao_send_buffer_size     = "Taille du tampon d'envoi";
theUILang.kr_ao_max_downloads_div    = "Diviseur de téléchargements max.";
theUILang.kr_ao_max_uploads_div      = "Diviseur d'envois max.";
theUILang.kr_ao_max_file_size        = "Taille de fichier maximale";
theUILang.kr_ao_split_file_size      = "Taille de fractionnement de fichier";
theUILang.kr_ao_split_suffix         = "Suffixe de fractionnement";
theUILang.kr_ao_http_cacert          = "Certificat CA HTTP";
theUILang.kr_ao_http_capath          = "Chemin CA HTTP";
theUILang.kr_ao_http_proxy           = "Proxy HTTP";
theUILang.kr_ao_proxy_address        = "Adresse du proxy";
theUILang.kr_ao_bind                 = "Adresse de liaison";
theUILang.kr_ao_session              = "Répertoire de session";
theUILang.kr_ao_timeout_safe_sync    = "Délai de sync sûr";
theUILang.kr_ao_timeout_sync         = "Délai de sync";
theUILang.kr_empty_ratio_rules       = "Aucune règle de ratio pour l'instant";
theUILang.kr_empty_rss_filters       = "Aucun filtre pour l'instant";
theUILang.kr_empty_rss_group         = "Aucun flux dans ce groupe pour l'instant";
theUILang.kr_empty_checklist        = "Rien de sélectionné";

/* Icon picker (js/icons.js). */
theUILang.kr_icons_choose        = "Choisir une icône";
theUILang.kr_icons_tab_icons     = "Icônes";
theUILang.kr_icons_tab_upload    = "Téléverser une image";
theUILang.kr_icons_search        = "Rechercher des icônes";
theUILang.kr_icons_categories    = "Catégories";
theUILang.kr_icons_tint          = "Teinte";
theUILang.kr_icons_tint_auto     = "Auto (variante)";
theUILang.kr_icons_upload_aria   = "Téléverser une image PNG";
theUILang.kr_icons_drop_title    = "Déposez une PNG ici ou cliquez pour parcourir";
theUILang.kr_icons_drop_hint     = "PNG uniquement. Affiché aussi dans ruTorrent standard.";
theUILang.kr_icons_upload_note   = "Une image téléversée est conservée telle quelle et prime sur un glyphe choisi. Retirez-la pour revenir à la valeur intelligente par défaut.";
theUILang.kr_icons_reset         = "Réinitialiser à la valeur intelligente par défaut";
theUILang.kr_icons_use           = "Utiliser l'icône";
theUILang.kr_icons_remove        = "Retirer l'image";
theUILang.kr_icons_upload_btn    = "Téléverser";
theUILang.kr_icons_no_match      = "Aucune icône ne correspond à “{term}”";
theUILang.kr_icons_cat_all       = "Toutes";
theUILang.kr_icons_more_cats     = "Plus de catégories";
theUILang.kr_icons_more          = "Plus";
theUILang.kr_icons_more_count    = "Plus ({n})";
theUILang.kr_icons_upload_failed = "Échec du téléversement : {msg}";
theUILang.kr_icons_sub_tracker   = "Tracker : {name}";
theUILang.kr_icons_sub_label     = "Étiquette : {name}";

/* Details empty states (js/details.js). */
theUILang.kr_det_empty_general  = "Sélectionnez un torrent pour voir son aperçu";
theUILang.kr_det_empty_files    = "Sélectionnez un torrent pour voir ses fichiers";
theUILang.kr_det_empty_trackers = "Sélectionnez un torrent pour voir ses trackers";
theUILang.kr_det_empty_peers    = "Sélectionnez un torrent pour voir ses clients";
theUILang.kr_det_empty_pieces   = "Sélectionnez un torrent pour voir ses pièces";

/* Sidebar rail (js/sidebar.js). */
theUILang.kr_nav_collapse = "Réduire la barre latérale";
theUILang.kr_nav_expand   = "Développer la barre latérale";

/* Custom select popover (js/select.js). */
theUILang.krNoMatches = "Aucune correspondance";
theUILang.krNoOptions = "Aucune option";

/* Peers pane (js/peers.js). */
theUILang.kr_noPeers           = "Aucun client connecté";
theUILang.kr_peerFlagIncoming  = "Connexion entrante";
theUILang.kr_peerFlagEncrypted = "Chiffré";
theUILang.kr_peerFlagSnubbed   = "Snobé";

/* About / What's new (js/about.js; the palette command in js/extras.js). */
theUILang.kr_wn_title         = "Nouveautés de Krate";
theUILang.kr_wn_link          = "Nouveautés";
theUILang.kr_wn_version       = "Krate v{version}";
theUILang.kr_wn_update        = "Mise à jour disponible : v{version}";
theUILang.kr_wn_update_hint = "KRATE : mettez à jour ruTorrent depuis HarmonyUI ou exécutez {cmd}.";
theUILang.kr_wn_update_manual = "Installation manuelle : exécutez {cmd} dans le dossier du thème.";
theUILang.kr_wn_none          = "Pas encore de notes de version.";
theUILang.krPalHelp            = "Aide";
