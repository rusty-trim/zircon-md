mod lexer;
mod parser;
mod storage;
use storage::{
    init_app_storage, load_file_content, load_session, load_settings, load_vault_files,
    save_file_content, save_session, save_settings,
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
            save_file_content,
            load_vault_files,
            load_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
