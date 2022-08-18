#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{fs, io::{Write}};

#[tauri::command]
fn save_json(json: String, path: String) -> Result<String, String> {
    match fs::File::create(path){
        Ok(mut file) => {
                match file.write_all(json.as_bytes()) {
                    Ok(_) => {return Ok("ok".to_string())}
                    Err(error) => {
                        println!("couldn't save data to prizes.json file {}", error.to_string());
                        return Err("not ok".to_string());
                    }
                }
        }
        _ => {
            println!("couldn't craete prizes.json");
        }
    }
    return Err("not ok".to_string());
}
#[tauri::command]
fn read_json(path: String) -> Result<String, String> {
    if let Ok(json_string) = fs::read_to_string(&path) {
        return Ok(json_string);
    } else {
        println!("error when reading {}", &path);
        return Err(format!("error when reading {}", path));
    }
}

fn main() {
    println!("\nEND COMPILING\n--------------------------------------------");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_json, read_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
