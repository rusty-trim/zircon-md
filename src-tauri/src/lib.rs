mod storage;
mod lexer;
mod parser;
use storage::{
    init_app_storage, load_session, load_settings, load_vault_files, save_session, save_settings, load_file_content
};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            init_app_storage(app.handle())?;
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_settings,
            load_session,
            save_settings,
            save_session,
            load_vault_files,
            load_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
