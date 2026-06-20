use thiserror::Error;

#[derive(Error, Debug)]
pub enum StorageError {
    #[error("Could not resolve local AppData or configuration directory")]
    DirectoryResolutionError,

    #[error("I/O error occurred: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Failed to parse or serialize configuration: {0}")]
    SerializationError(#[from] serde_json::Error),

    #[error("CLI tool not found: {0}")]
    CliToolNotFound(String),

    #[error("Category not found: {0}")]
    CategoryNotFound(String),

    #[error("Template not found: {0}")]
    TemplateNotFound(String),

    #[error("Validation error: {0}")]
    Validation(String),
}

pub type Result<T> = std::result::Result<T, StorageError>;
