use std::env;
use std::process;
use climaster_core::storage::get_cli_tools;

fn print_help() {
    println!("climaster - CLI Tool Manager");
    println!("Usage:");
    println!("  climaster [options] <command> [args]");
    println!();
    println!("Options:");
    println!("  -h, --help      Show this help menu");
    println!("  -v, --version   Show version info");
    println!();
    println!("Commands:");
    println!("  list            List all registered CLI tools");
    println!("  search <query>  Search for registered CLI tools by query");
}

fn print_version() {
    println!("climaster {}", env!("CARGO_PKG_VERSION"));
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        print_help();
        process::exit(0);
    }

    let first_arg = &args[1];

    match first_arg.as_str() {
        "-h" | "--help" | "help" => {
            print_help();
            process::exit(0);
        }
        "-v" | "--version" | "version" => {
            print_version();
            process::exit(0);
        }
        "list" => {
            let mut format_json = false;
            let mut i = 2;
            while i < args.len() {
                match args[i].as_str() {
                    "--json" => {
                        format_json = true;
                        i += 1;
                    }
                    "--format" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --format requires a value");
                            process::exit(1);
                        }
                        let val = &args[i + 1];
                        if val == "json" {
                            format_json = true;
                        } else if val == "table" {
                            format_json = false;
                        } else {
                            eprintln!("Error: invalid format '{}'", val);
                            process::exit(1);
                        }
                        i += 2;
                    }
                    _ => {
                        eprintln!("Error: excessive or unknown argument '{}'", args[i]);
                        process::exit(1);
                    }
                }
            }

            let tools = match get_cli_tools() {
                Ok(t) => t,
                Err(e) => {
                    eprintln!("Error loading configuration: {}", e);
                    process::exit(1);
                }
            };

            if format_json {
                let json_str = serde_json::to_string_pretty(&tools).unwrap();
                println!("{}", json_str);
            } else {
                println!("{:<20} {:<50} {:<10} {:<15}", "Name", "Path", "Version", "Category");
                println!("{}", "-".repeat(100));
                for t in tools {
                    let cat = t.category_id.unwrap_or_else(|| "None".to_string());
                    println!("{:<20} {:<50} {:<10} {:<15}", t.name, t.path.display(), t.version, cat);
                }
            }
        }
        "search" => {
            if args.len() < 3 {
                eprintln!("Error: search query is required");
                process::exit(1);
            }

            let query = &args[2];
            if query == "--json" || query.starts_with('-') {
                eprintln!("Error: search query is required");
                process::exit(1);
            }

            let mut format_json = false;
            if args.len() > 3 {
                if args[3] == "--json" {
                    format_json = true;
                } else {
                    eprintln!("Error: unknown argument '{}'", args[3]);
                    process::exit(1);
                }
            }

            let tools = match get_cli_tools() {
                Ok(t) => t,
                Err(e) => {
                    eprintln!("Error loading configuration: {}", e);
                    process::exit(1);
                }
            };

            let query_lower = query.to_lowercase();
            let matches: Vec<_> = tools.into_iter()
                .filter(|t| t.name.to_lowercase().contains(&query_lower) || t.path.to_string_lossy().to_lowercase().contains(&query_lower))
                .collect();

            if format_json {
                let json_str = serde_json::to_string_pretty(&matches).unwrap();
                println!("{}", json_str);
            } else {
                println!("{:<20} {:<50} {:<10} {:<15}", "Name", "Path", "Version", "Category");
                println!("{}", "-".repeat(100));
                for t in matches {
                    let cat = t.category_id.unwrap_or_else(|| "None".to_string());
                    println!("{:<20} {:<50} {:<10} {:<15}", t.name, t.path.display(), t.version, cat);
                }
            }
        }
        "mock-run" => {
            let mut i = 2;
            while i < args.len() {
                match args[i].as_str() {
                    "--print-env" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --print-env requires a name");
                            process::exit(1);
                        }
                        let name = &args[i + 1];
                        let val = env::var(name).unwrap_or_else(|_| "".to_string());
                        println!("{}", val);
                        i += 2;
                    }
                    "--stdout" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --stdout requires text");
                            process::exit(1);
                        }
                        println!("{}", args[i + 1]);
                        i += 2;
                    }
                    "--stderr" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --stderr requires text");
                            process::exit(1);
                        }
                        eprintln!("{}", args[i + 1]);
                        i += 2;
                    }
                    "--stdout-loop" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --stdout-loop requires a count");
                            process::exit(1);
                        }
                        let count: usize = args[i + 1].parse().unwrap_or(0);
                        for line_num in 0..count {
                            println!("Line {}", line_num);
                            std::thread::sleep(std::time::Duration::from_millis(10));
                        }
                        i += 2;
                    }
                    "--sleep" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --sleep requires milliseconds");
                            process::exit(1);
                        }
                        let ms: u64 = args[i + 1].parse().unwrap_or(0);
                        std::thread::sleep(std::time::Duration::from_millis(ms));
                        i += 2;
                    }
                    "--exit" => {
                        if i + 1 >= args.len() {
                            eprintln!("Error: --exit requires a code");
                            process::exit(1);
                        }
                        let code: i32 = args[i + 1].parse().unwrap_or(0);
                        process::exit(code);
                    }
                    "--spawn-child" => {
                        let self_exe = env::current_exe().unwrap_or_else(|_| std::path::PathBuf::from("climaster"));
                        let mut cmd = process::Command::new(self_exe);
                        cmd.arg("mock-run");
                        for a in &args[i + 1..] {
                            cmd.arg(a);
                        }
                        let mut child = cmd.spawn().expect("failed to spawn child");
                        let _ = child.wait();
                        process::exit(0);
                    }
                    _ => {
                        eprintln!("Error: unknown mock-run option '{}'", args[i]);
                        process::exit(1);
                    }
                }
            }
            process::exit(0);
        }
        _ => {
            eprintln!("Error: Unknown command '{}'", first_arg);
            print_help();
            process::exit(1);
        }
    }
}
