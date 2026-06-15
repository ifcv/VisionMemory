from pymongo import MongoClient

class MemoryManager:
    def __init__(self, mongo_uri="mongodb://localhost:27017/visionmemory"):
        self.client = MongoClient(mongo_uri)
        self.db = self.client.get_default_database()
        if self.db.name is None:
            # Fallback if URI has no db
            self.db = self.client["visionmemory"]
            
        self.collection = self.db["memoryentries"]

    def get_memory_for_labels(self, labels: list) -> list:
        # Query MongoDB for MemoryEntry documents matching the labels
        # Fuzzy matching is requested, but regex matching for each label is a good start
        memories = []
        for label in labels:
            # Use a case-insensitive regex search
            query = {"label": {"$regex": f"^{label}$", "$options": "i"}}
            entry = self.collection.find_one(query)
            if entry:
                memories.append({
                    "label": entry["label"],
                    "observations": entry.get("observations", [])
                })
        return memories
