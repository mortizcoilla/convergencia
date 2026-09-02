"""
Deploy script — sube el contenido de dist/ a HostGator via FTP.
Lee credenciales de .env.deploy.local o variables de entorno.
"""
import ftplib
import os
import sys
from pathlib import Path


def load_config() -> dict:
    """Carga configuración desde .env.deploy.local o variables de entorno."""
    env_path = Path(__file__).parent / ".env.deploy.local"
    config: dict[str, str] = {}

    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            config[key.strip()] = value.strip().strip('"').strip("'")

    def pick(key: str, default: str = "") -> str:
        return config.get(key) or os.environ.get(key) or default

    return {
        "host":     pick("FTP_HOST"),
        "user":     pick("FTP_USER"),
        "password": pick("FTP_PASSWORD"),
        "remote":   pick("FTP_REMOTE", "/public_html/"),
    }


def upload_dir(ftp: ftplib.FTP, local_dir: Path, remote_dir: str) -> None:
    """Sube un directorio local recursivamente al FTP."""
    items = sorted(local_dir.iterdir(), key=lambda p: (p.is_file(), p.name))

    # Crear directorio remoto si no existe
    try:
        ftp.mkd(remote_dir)
    except ftplib.error_perm:
        pass  # ya existe

    for item in items:
        if item.name.startswith("."):
            continue

        remote_path = f"{remote_dir}{item.name}"

        if item.is_dir():
            upload_dir(ftp, item, remote_path + "/")
        else:
            with open(item, "rb") as f:
                ftp.storbinary(f"STOR {remote_path}", f)
            print(f"  ↑ {remote_path}")


def main() -> int:
    cfg = load_config()
    if not all([cfg["host"], cfg["user"], cfg["password"]]):
        print("ERROR: faltan credenciales FTP.", file=sys.stderr)
        print("Crea un archivo .env.deploy.local con FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE", file=sys.stderr)
        print("(copia .env.deploy.example como base)", file=sys.stderr)
        return 1

    dist = Path(__file__).parent / "dist"
    if not dist.exists():
        print(f"ERROR: {dist} no existe. Corre 'npm run build' primero.", file=sys.stderr)
        return 1

    print(f"Conectando a {cfg['host']}...")
    ftp = ftplib.FTP(cfg["host"], timeout=30)
    ftp.login(cfg["user"], cfg["password"])
    print(f"  Conectado como {cfg['user']}")

    print(f"Subiendo {dist} → {cfg['remote']}")
    try:
        upload_dir(ftp, dist, cfg["remote"])
    finally:
        ftp.quit()

    print("✓ Deploy completo")
    return 0


if __name__ == "__main__":
    sys.exit(main())
