use std::{fmt::format, fs, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

const SETTINGS_FILE: &str = "settings.json";
const SESSION_FILE: &str = "session.json";

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub theme: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "system".into(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    pub vault_path: Option<String>,
    pub tabs: Vec<TabEntry>,
    pub active_tab_id: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TabEntry {
    pub id: String,
    pub path: Option<String>,
    pub r#type: i8,
    pub name: String
}

impl Default for Session {
    fn default() -> Self {
        Self {
            vault_path: None,
            tabs: vec![],
            active_tab_id: None,
        }
    }
}

fn app_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_local_data_dir()
        .map_err(|e| format!("Failed to resolve app local data dir: {e}"))
}

pub fn init_app_storage(app: &AppHandle) -> Result<(), String> {
    let dir = app_data_dir(app)?;
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create app data dir: {e}"))?;

    let settings_path = dir.join(SETTINGS_FILE);

    if !settings_path.exists() {
        atomic_write_json(&settings_path, &Settings::default())?;
    }

    let session_path = dir.join(SESSION_FILE);

    if !session_path.exists() {
        atomic_write_json(&session_path, &Session::default())?;
    }

    Ok(())
}

fn atomic_write_json<T: Serialize>(path: &PathBuf, data: &T) -> Result<(), String> {
    let json = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    let tmp_path = path.with_extension("json.tmp");

    fs::write(&tmp_path, json).map_err(|e| format!("Failed to write temp file: {e}"))?;
    fs::rename(&tmp_path, path).map_err(|e| format!("Failed to renamne temp file: {e}"))?;

    Ok(())
}

#[tauri::command]
pub fn load_settings(app: AppHandle) -> Result<Settings, String> {
    let path = app_data_dir(&app)?.join(SETTINGS_FILE);
    let raw = fs::read_to_string(&path).map_err(|e| format!("Failed to read settings: {e}"))?;
    Ok(serde_json::from_str::<Settings>(&raw)
        .map_err(|e| format!("Failed to parse settings: {e}"))?)
}

#[tauri::command]
pub fn save_settings(app: AppHandle, settings: Settings) -> Result<(), String> {
    let path = app_data_dir(&app)?.join(SETTINGS_FILE);
    atomic_write_json(&path, &settings)
}

#[tauri::command]
pub fn load_session(app: AppHandle) -> Result<Session, String> {
    let path = app_data_dir(&app)?.join(SESSION_FILE);
    let raw = fs::read_to_string(&path).map_err(|e| format!("Failed to read settings: {e}"))?;
    Ok(serde_json::from_str::<Session>(&raw)
        .map_err(|e| format!("Failed to parse session: {e}"))?)
}

#[tauri::command]
pub fn save_session(app: AppHandle, session: Session) -> Result<(), String> {
    let path = app_data_dir(&app)?.join(SESSION_FILE);
    atomic_write_json(&path, &session)
}
