"""Check duplicate vector_ids in FAISS."""
from app.rag.vector_store import VectorStore

vs = VectorStore()

print(f"Total vectors: {vs.size}")
print(f"Total metadata entries: {len(vs.metadata)}\n")

print("Checking for duplicate vector_ids:\n")

# Find all positions for 1_0 and 2_0
duplicates = {}
for i, meta in enumerate(vs.metadata):
    vid = meta['vector_id']
    if vid not in duplicates:
        duplicates[vid] = []
    duplicates[vid].append(i)

# Show duplicates
print("Vector IDs that appear multiple times:")
for vid, positions in duplicates.items():
    if len(positions) > 1:
        print(f"\nvector_id '{vid}' appears {len(positions)} times at positions: {positions}")
        for pos in positions:
            meta = vs.metadata[pos]
            print(f"  Position {pos}: doc_id={meta['document_id']}, chunk_idx={meta['chunk_index']}, category={meta['category']}")

# Count expected vs actual
from app.db.session import SessionLocal
from app.db.models import DocumentChunk

db = SessionLocal()
db_count = db.query(DocumentChunk).count()
print(f"\nDatabase chunks: {db_count}")
print(f"FAISS vectors: {vs.size}")
print(f"Difference: {vs.size - db_count} extra vectors in FAISS")
