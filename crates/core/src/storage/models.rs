// DISTINCT COMMENT FOR MODELS
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CliTool {
    pub id: String,
    pub name: String,
    pub path: PathBuf,
    pub version: String,
    #[serde(default)]
    pub category_id: Option<String>,
    #[serde(default)]
    pub custom_env: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Template {
    pub id: String,
    pub cli_id: String,
    pub name: String,
    pub args: Vec<String>,
    #[serde(default)]
    pub env: HashMap<String, String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pwd: Option<PathBuf>,
    #[serde(default)]
    pub last_run: Option<String>,
}

pub fn default_language() -> String {
    "zh".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CliMasterStorage {
    #[serde(default)]
    pub cli_tools: Vec<CliTool>,
    #[serde(default)]
    pub categories: Vec<Category>,
    #[serde(default)]
    pub templates: Vec<Template>,
    #[serde(default = "default_language")]
    pub language: String,
}

impl Default for CliMasterStorage {
    fn default() -> Self {
        Self {
            cli_tools: Vec::new(),
            categories: Vec::new(),
            templates: Vec::new(),
            language: default_language(),
        }
    }
}

pub type AppConfig = CliMasterStorage;

