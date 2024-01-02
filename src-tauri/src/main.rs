// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// src-tauri/src/main.rs
#[tauri::command]
fn execute_command(project_name: String, project_type: String) -> Result<(), String> {
    // Use the received parameters to build and execute the command
    let command = format!("npm create vite@latest {} --template {}", project_name, project_type);

    // Simulate command execution (replace with actual execution logic)
    println!("Executing command: {}", &command);

    Ok(())
}
