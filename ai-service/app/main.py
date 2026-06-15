import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List

from .detector import YOLOv8Detector
from .memory import MemoryManager
from .ollama_client import OllamaClient

app = FastAPI(title="VisionMemory AI Service")

# Initialize components
detector = YOLOv8Detector()
memory_manager = MemoryManager(
    mongo_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/visionmemory")
)
ollama_client = OllamaClient(
    base_url=os.getenv("OLLAMA_URL", "http://localhost:11434")
)

class AnalysisResult(BaseModel):
    detectedLabels: list
    llmResponse: str
    memoryUsed: bool

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. Detect objects
        detections = detector.detect(temp_file_path)
        
        if not detections:
            os.remove(temp_file_path)
            return AnalysisResult(
                detectedLabels=[],
                llmResponse="I don't see any recognizable objects in this image.",
                memoryUsed=False
            )

        # Extract unique label names
        label_names = list(set([d["label"] for d in detections]))
        
        # 2. Query Memory
        memory_context_list = memory_manager.get_memory_for_labels(label_names)
        memory_used = len(memory_context_list) > 0
        
        # 3. Build context-aware prompt & Call Ollama (pass image for vision model)
        llm_response = await ollama_client.analyze_scene(temp_file_path, detections, memory_context_list)
        
        # Cleanup
        os.remove(temp_file_path)
        
        return AnalysisResult(
            detectedLabels=detections,
            llmResponse=llm_response,
            memoryUsed=memory_used
        )
        
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))
