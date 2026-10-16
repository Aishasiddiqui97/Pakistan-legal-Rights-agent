"""Document ingestion CLI script."""
import argparse
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import get_settings
from app.core.logging import setup_logging, get_logger
from app.db.session import init_db, get_db
from app.services.ingestion_service import IngestionService

setup_logging()
logger = get_logger(__name__)


def ingest_directory(directory: Path, category_mapping: dict = None):
    """
    Ingest all documents from a directory.

    Args:
        directory: Directory containing documents
        category_mapping: Optional mapping of filename patterns to categories
    """
    if not directory.exists():
        logger.error(f"Directory not found: {directory}")
        return

    if not directory.is_dir():
        logger.error(f"Path is not a directory: {directory}")
        return

    # Initialize database
    init_db()

    # Default category mapping based on filename
    if category_mapping is None:
        category_mapping = {
            "salary": "unpaid_salary",
            "employment": "unpaid_salary",
            "wage": "unpaid_salary",
            "harassment": "workplace_harassment",
            "tenant": "tenant_landlord",
            "landlord": "tenant_landlord",
            "rent": "tenant_landlord",
            "eviction": "tenant_landlord",
        }

    # Find all PDF and TXT files recursively
    files = list(directory.glob("**/*.pdf")) + list(directory.glob("**/*.txt"))

    if not files:
        logger.warning(f"No PDF or TXT files found in {directory}")
        return

    logger.info(f"Found {len(files)} documents to ingest")

    successful = 0
    failed = 0

    with get_db() as db:
        ingestion_service = IngestionService(db)

        for file_path in files:
            logger.info(f"Processing: {file_path.name}")

            # Determine category from parent directory or filename
            parent_dir = file_path.parent.name.lower()
            filename_lower = file_path.stem.lower()
            category = "unpaid_salary"  # Default

            # First try to determine from parent directory
            if "employment" in parent_dir or "employement" in parent_dir:
                category = "unpaid_salary"
            elif "harassment" in parent_dir:
                category = "workplace_harassment"
            elif "tenant" in parent_dir or "tenancy" in parent_dir:
                category = "tenant_landlord"
            else:
                # Fall back to filename patterns
                for pattern, cat in category_mapping.items():
                    if pattern in filename_lower:
                        category = cat
                        break

            # Use original filename as title (preserve exact formatting)
            title = file_path.stem

            try:
                document = ingestion_service.ingest_document(
                    file_path=file_path,
                    title=title,
                    category=category,
                    jurisdiction="Karachi, Sindh, Pakistan",
                )

                logger.info(
                    f"✓ Successfully ingested: {title} "
                    f"({document.total_chunks} chunks)"
                )
                successful += 1

            except Exception as e:
                logger.error(f"✗ Failed to ingest {file_path.name}: {e}")
                failed += 1

    logger.info(f"\nIngestion complete: {successful} successful, {failed} failed")


def rebuild_index():
    """Rebuild the vector index from database."""
    init_db()

    logger.info("Rebuilding vector index...")

    with get_db() as db:
        ingestion_service = IngestionService(db)
        count = ingestion_service.rebuild_vector_store()

    logger.info(f"✓ Vector index rebuilt with {count} vectors")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="LegalSaathi AI Document Ingestion"
    )

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Ingest command
    ingest_parser = subparsers.add_parser(
        "ingest",
        help="Ingest documents from directory"
    )
    ingest_parser.add_argument(
        "--directory",
        "-d",
        type=Path,
        required=True,
        help="Directory containing documents"
    )

    # Rebuild command
    rebuild_parser = subparsers.add_parser(
        "rebuild",
        help="Rebuild vector index from database"
    )

    args = parser.parse_args()

    if args.command == "ingest":
        ingest_directory(args.directory)
    elif args.command == "rebuild":
        rebuild_index()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
